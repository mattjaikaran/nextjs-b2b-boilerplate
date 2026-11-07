import { config, isDjangoSPA } from '@/config';
import { getCSRFToken } from '@/lib/django-integration';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import type { ApiError, ApiResponse } from '@/types';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface DjangoErrorResponse {
  detail?: string | { msg: string; loc: string[] }[];
  message?: string;
  code?: string;
}

const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
    // The paired backend authenticates with HttpOnly cookies, so every
    // request must opt in to sending and storing them.
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const token =
        typeof window === 'undefined'
          ? null
          : localStorage.getItem(config.auth.tokenKey);
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }

      if (isDjangoSPA()) {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          requestConfig.headers['X-CSRFToken'] = csrfToken;
        }
      }

      return requestConfig;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<DjangoErrorResponse>) => {
      const originalRequest = error.config as
        | ExtendedAxiosRequestConfig
        | undefined;

      const refreshToken =
        typeof window === 'undefined'
          ? null
          : localStorage.getItem(config.auth.refreshTokenKey);
      const canRefresh = isDjangoSPA()
        ? !!refreshToken
        : useAuthStore.getState().isAuthenticated;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        canRefresh
      ) {
        originalRequest._retry = true;

        try {
          if (isDjangoSPA()) {
            const refreshPath = `${config.django?.apiPrefix ?? '/api'}/token/refresh`;
            const response = await instance.post<
              ApiResponse<{ accessToken: string }> | { access: string }
            >(refreshPath, { refresh: refreshToken });

            let newToken: string;
            if ('access' in response.data) {
              newToken = response.data.access;
            } else if (
              'data' in response.data &&
              response.data.data?.accessToken
            ) {
              newToken = response.data.data.accessToken;
            } else {
              throw new Error('Invalid refresh response');
            }

            localStorage.setItem(config.auth.tokenKey, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          } else {
            // The paired backend rotates the HttpOnly refresh cookie. The
            // request body is empty; the cookie carries the credential.
            await instance.post(
              '/api/auth/refresh',
              undefined,
              { _retry: true } as ExtendedAxiosRequestConfig
            );
          }

          return instance(originalRequest);
        } catch (refreshError) {
          if (typeof window !== 'undefined') {
            useAuthStore.getState().logout();
            if (window.location.pathname !== '/login') {
              window.location.assign('/login');
            }
          }
          return Promise.reject(refreshError);
        }
      }

      let errorMessage = 'An error occurred';
      const responseData = error.response?.data;

      if (responseData) {
        if (typeof responseData.detail === 'string') {
          errorMessage = responseData.detail;
        } else if (Array.isArray(responseData.detail)) {
          errorMessage = responseData.detail.map(d => d.msg).join(', ');
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      const apiError: ApiError = {
        message: errorMessage,
        code: responseData?.code || error.code,
        details: undefined,
      };

      return Promise.reject(apiError);
    }
  );

  return instance;
};

export const api = createApiInstance();
