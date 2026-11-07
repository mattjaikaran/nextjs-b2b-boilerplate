'use client';

import type { AuthState, AuthTokens, User } from '@/types';
import { create } from 'zustand';

const USER_KEY = 'user:v1';
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export interface AuthSlice extends AuthState {
  login: (data: { user: User; tokens?: AuthTokens | null }) => void;
  register: (data: { user: User; tokens?: AuthTokens | null }) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

const readTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
};

const clearStoredSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const useAuthStore = create<AuthSlice>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  hasHydrated: false,
  isLoading: false,
  error: null,

  login: (data) => {
    const tokens = data.tokens ?? null;
    if (typeof window !== 'undefined') {
      // Cookie-authenticated backends return no bearer tokens; do not leave
      // stale credentials behind from a previous session.
      if (tokens) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    set({
      user: data.user,
      tokens,
      isAuthenticated: true,
      hasHydrated: true,
      isLoading: false,
      error: null,
    });
  },

  register: (data) => {
    get().login(data);
  },

  logout: () => {
    clearStoredSession();
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      hasHydrated: true,
      isLoading: false,
      error: null,
    });
  },

  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  setTokens: (tokens) => {
    set({ tokens });
    if (typeof window === 'undefined') return;
    if (tokens) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  initializeAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) {
        set({ hasHydrated: true });
        return;
      }
      const user = JSON.parse(userStr) as User;
      set({
        user,
        // Cookie sessions have no bearer tokens; the HttpOnly cookies are
        // sent by the axios instance, so the cached user is enough to restore.
        tokens: readTokens(),
        isAuthenticated: true,
        hasHydrated: true,
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      clearStoredSession();
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        hasHydrated: true,
      });
    }
  },
}));
