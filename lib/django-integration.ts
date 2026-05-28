'use client';

import { config } from '@/config';

/**
 * Get CSRF token from cookie. Used when running as Django SPA.
 */
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;
  const name = config.django?.csrfTokenName ?? 'csrftoken';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value ?? '');
  }
  return null;
}

