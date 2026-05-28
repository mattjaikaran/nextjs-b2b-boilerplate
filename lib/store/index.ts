'use client';

import { config } from '@/config';
import { useAuthStore } from './slices/authSlice';
import { useConfigStore } from './slices/configSlice';
import { useTodoStore } from './slices/todoSlice';
import { useUIStore } from './slices/uiSlice';

export { useAuthStore } from './slices/authSlice';
export { useConfigStore } from './slices/configSlice';
export { useTodoStore } from './slices/todoSlice';
export { useUIStore } from './slices/uiSlice';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    tokens: store.tokens,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    setUser: store.setUser,
    setTokens: store.setTokens,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    initializeAuth: store.initializeAuth,
  };
};

export const useUI = () => useUIStore();
export const useTodos = () => useTodoStore();

export const useFeatureEnabled = (feature: keyof typeof config.features) =>
  config.features[feature];
