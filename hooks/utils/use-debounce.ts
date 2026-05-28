'use client';

/**
 * Debounce Hooks
 * Utilities for debouncing values and callbacks
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

/**
 * Hook to debounce a value
 */
const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook to debounce a callback function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebouncedCallback = <T extends (...args: any[]) => unknown>(
  callback: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  // Cleanup on unmount
  useEffect(() => {
    const ref = timeoutRef;
    return () => {
      if (ref.current) {
        clearTimeout(ref.current);
      }
    };
  }, []);

  return debouncedCallback;
};

interface DebounceState<T> {
  debouncedValue: T;
  isDebouncing: boolean;
}

type DebounceAction<T> =
  | { type: 'START'; }
  | { type: 'DONE'; payload: T };

function debounceReducer<T>(state: DebounceState<T>, action: DebounceAction<T>): DebounceState<T> {
  switch (action.type) {
    case 'START':
      return { ...state, isDebouncing: true };
    case 'DONE':
      return { debouncedValue: action.payload, isDebouncing: false };
    default:
      return state;
  }
}

/**
 * Hook to debounce with loading state
 */
const useDebounceWithLoading = <T>(
  value: T,
  delay: number = 500
): { debouncedValue: T; isDebouncing: boolean } => {
  const [state, dispatch] = useReducer(debounceReducer<T>, {
    debouncedValue: value,
    isDebouncing: false,
  });

  useEffect(() => {
    dispatch({ type: 'START' });

    const timer = setTimeout(() => {
      dispatch({ type: 'DONE', payload: value });
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return state;
};
