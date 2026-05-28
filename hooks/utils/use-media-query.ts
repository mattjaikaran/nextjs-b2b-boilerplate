'use client';

/**
 * Media Query Hooks
 * Responsive design utilities
 */

import { useEffect, useState } from 'react';

/**
 * Hook to check if a media query matches
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

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
