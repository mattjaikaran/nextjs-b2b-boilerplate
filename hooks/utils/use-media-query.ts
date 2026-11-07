'use client';

/**
 * Media Query Hooks
 * Responsive design utilities
 */

import { useSyncExternalStore } from 'react';

/**
 * Hook to check if a media query matches
 */
const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    onChange => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );

/**
 * Predefined breakpoint hooks
 */
const useIsMobile = () => useMediaQuery('(max-width: 639px)');
const useIsTablet = () =>
  useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)');

/**
 * Hook for preferred color scheme
 */
const usePrefersDarkMode = () =>
  useMediaQuery('(prefers-color-scheme: dark)');

/**
 * Hook for reduced motion preference
 */
const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

/**
 * Hook that returns current breakpoint
 */
const useBreakpoint = (): 'mobile' | 'tablet' | 'desktop' | 'large' => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLargeDesktop = useIsLargeDesktop();

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isLargeDesktop) return 'large';
  return 'desktop';
};
