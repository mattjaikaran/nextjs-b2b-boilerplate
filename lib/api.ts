'use client';

import { config, isDjangoSPA } from '@/config';
import { getCSRFToken } from '@/lib/django-integration';
import type { ApiError, ApiResponse, QueryParams } from '@/types';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
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
    withCredentials: isDjangoSPA(),
  });

  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(config.auth.tokenKey);
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

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem(
            config.auth.refreshTokenKey
          );
          if (refreshToken) {
            const refreshPath = isDjangoSPA()
              ? '/token/refresh'
              : '/auth/refresh';
            const refreshPayload = isDjangoSPA()
              ? { refresh: refreshToken }
              : { refreshToken };

            const response = await instance.post<
              ApiResponse<{ accessToken: string }> | { access: string }
            >(refreshPath, refreshPayload);

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
            return instance(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem(config.auth.tokenKey);
          localStorage.removeItem(config.auth.refreshTokenKey);
          localStorage.removeItem('user');
          window.location.href = '/login';
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

export const handleApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>
): T => {
  if (response.data.success && response.data.data !== undefined) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'API request failed');
};
