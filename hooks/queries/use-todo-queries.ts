'use client';

/**
 * Todo Query Hooks
 * React Query hooks backed by the generated OpenAPI SDK.
 */

import { todoListTodosQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import { todoListTodos } from '@/api/generated/sdk.gen';
import {
  toPaginatedTodos,
  toTodo,
  toTodoQuery,
  toTodoStats,
} from '@/lib/api-mappers';
import type { PaginatedResponse, QueryParams, Todo, TodoStats } from '@/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const STATS_QUERY = { page_size: 100 };

/**
 * Hook to fetch paginated todos
 */
export const useTodos = (
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Todo>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const query = toTodoQuery(params);

  return useQuery<PaginatedResponse<Todo>, Error>({
    queryKey: todoListTodosQueryKey({ query }),
    queryFn: async () => {
      const { data } = await todoListTodos({ query, throwOnError: true });
      return toPaginatedTodos(data, params);
    },
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Hook to fetch todo statistics
 */
export const useTodoStats = (
  options?: Omit<UseQueryOptions<TodoStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TodoStats, Error>({
    queryKey: todoListTodosQueryKey({ query: STATS_QUERY }),
    queryFn: async () => {
      const { data } = await todoListTodos({
        query: STATS_QUERY,
        throwOnError: true,
      });
      return toTodoStats(data.results.map(toTodo));
    },
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
};
