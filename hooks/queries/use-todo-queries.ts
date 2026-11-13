'use client';

/**
 * Todo Query Hooks
 * React Query hooks backed by the generated OpenAPI SDK.
 */

import { todoListTodosQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import { todoListTodos } from '@/api/generated/sdk.gen';
import { toPaginatedTodos, toTodoQuery } from '@/lib/api-mappers';
import type { PaginatedResponse, QueryParams, Todo, TodoStats } from '@/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const STATS_QUERY = { page_size: 1 };

const countTodos = async (filters: { completed?: boolean } = {}) => {
  const { data } = await todoListTodos({
    query: { ...filters, ...STATS_QUERY },
    throwOnError: true,
  });
  return data.count;
};

/**
 * Hook to fetch paginated todos
 */
export const useTodos = (
  params?: QueryParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Todo>, Error>, 'queryKey' | 'queryFn'>,
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
  options?: Omit<UseQueryOptions<TodoStats, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TodoStats, Error>({
    // Mark the derived shape so it cannot collide with a useTodos page.
    queryKey: [...todoListTodosQueryKey({ query: STATS_QUERY }), 'stats'],
    queryFn: async () => {
      const [total, completed, pending] = await Promise.all([
        countTodos(),
        countTodos({ completed: true }),
        countTodos({ completed: false }),
      ]);
      return { total, completed, pending };
    },
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
};
