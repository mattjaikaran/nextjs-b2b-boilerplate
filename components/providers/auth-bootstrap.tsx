'use client';

import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useEffect } from 'react';

/**
 * Restore the cached user on mount. Cookie-authenticated backends keep the
 * session in HttpOnly cookies, so there are no bearer tokens to read.
 */
export function AuthBootstrap() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}
