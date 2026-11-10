'use client';

/**
 * Auth Mutation Hooks
 * React Query hooks backed by the generated OpenAPI SDK.
 */

import { authGetCurrentUserQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import {
  authLogin,
  authLogout,
  authRequestPasswordlessLogin,
  authSignup,
  userUpdateUser,
} from '@/api/generated/sdk.gen';
import {
  toAuthResponse,
  toSignupBody,
  toUser,
  toUserUpdateBody,
} from '@/lib/api-mappers';
import { api } from '@/lib/api';
import { useAuth, useUI } from '@/lib/store';
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

/**
 * Hook for user login
 */
export const useLogin = (
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, LoginCredentials>,
    'mutationFn'
  >
) => {
  const { login } = useAuth();
  const { addNotification } = useUI();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async credentials => {
      const response = await authLogin({ body: credentials, throwOnError: true });
      return toAuthResponse(response.data);
    },
    onSuccess: data => {
      login(data);
      queryClient.invalidateQueries({
        queryKey: authGetCurrentUserQueryKey(),
      });
      addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have been successfully logged in.',
      });
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Login failed',
        message: error.message,
      });
    },
    ...options,
  });
};

/**
 * Hook for user registration
 */
export const useRegister = (
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, RegisterCredentials>,
    'mutationFn'
  >
) => {
  const { register } = useAuth();
  const { addNotification } = useUI();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: async credentials => {
      const response = await authSignup({
        body: toSignupBody(credentials),
        throwOnError: true,
      });
      return toAuthResponse(response.data);
    },
    onSuccess: data => {
      register(data);
      queryClient.invalidateQueries({
        queryKey: authGetCurrentUserQueryKey(),
      });
      addNotification({
        type: 'success',
        title: 'Account created!',
        message: 'Your account has been successfully created.',
      });
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Registration failed',
        message: error.message,
      });
    },
    ...options,
  });
};

/**
 * Hook for sending magic link
 */
export const useMagicLink = (
  options?: Omit<
    UseMutationOptions<{ message: string }, Error, MagicLinkRequest>,
    'mutationFn'
  >
) => {
  const { addNotification } = useUI();

  return useMutation<{ message: string }, Error, MagicLinkRequest>({
    mutationFn: async request => {
      await authRequestPasswordlessLogin({
        body: { email: request.email },
        throwOnError: true,
      });
      return { message: 'Magic link sent' };
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Magic link sent!',
        message: 'Check your email for the login link.',
      });
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Failed to send magic link',
        message: error.message,
      });
    },
    ...options,
  });
};

/**
 * Hook for user logout
 */
export const useLogout = (
  options?: Omit<
    UseMutationOptions<{ message: string }, Error, void>,
    'mutationFn'
  >
) => {
  const { logout } = useAuth();
  const { addNotification } = useUI();
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const response = await authLogout({ throwOnError: true });
      return { message: response.data.message };
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      addNotification({
        type: 'success',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
      });
    },
    onError: () => {
      // Still logout locally even if API call fails
      logout();
      queryClient.clear();
      addNotification({
        type: 'warning',
        title: 'Logged out',
        message: 'You have been logged out locally.',
      });
    },
    ...options,
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = (
  options?: Omit<UseMutationOptions<User, Error, Partial<User>>, 'mutationFn'>
) => {
  const { user, setUser } = useAuth();
  const { addNotification } = useUI();
  const queryClient = useQueryClient();

  return useMutation<User, Error, Partial<User>>({
    mutationFn: async updates => {
      if (!user) {
        throw new Error('You must be signed in to update your profile.');
      }
      const response = await userUpdateUser({
        path: { user_id: user.id },
        body: toUserUpdateBody(updates),
        throwOnError: true,
      });
      return toUser(response.data);
    },
    onSuccess: data => {
      setUser(data);
      queryClient.invalidateQueries({
        queryKey: authGetCurrentUserQueryKey(),
      });
      addNotification({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile has been updated successfully.',
      });
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: error.message,
      });
    },
    ...options,
  });
};

/**
 * Hook for changing password.
 *
 * The paired contract has no change-password operation, so this posts through
 * the shared axios instance, which keeps auth, refresh and error handling.
 */
export const useChangePassword = (
  options?: Omit<
    UseMutationOptions<
      { message: string },
      Error,
      { currentPassword: string; newPassword: string }
    >,
    'mutationFn'
  >
) => {
  const { addNotification } = useUI();
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const response = await api.post<
        { message: string } | ApiResponse<{ message: string }>
      >('/api/auth/change-password', { currentPassword, newPassword });
      const payload = response.data;
      return 'success' in payload ? payload.data : payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authGetCurrentUserQueryKey(),
      });
      addNotification({
        type: 'success',
        title: 'Password changed',
        message: 'Your password has been changed successfully.',
      });
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Password change failed',
        message: error.message,
      });
    },
    ...options,
  });
};
