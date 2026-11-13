'use client';

import { todoListTodosQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import { todoCreateTodo, todoUpdateTodo } from '@/api/generated/sdk.gen';
import { toCreateTodoBody, toTodo, toUpdateTodoBody } from '@/lib/api-mappers';
import { useUI } from '@/lib/store';
import type { CreateTodoRequest, Todo, UpdateTodoRequest } from '@/types';
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

const invalidateTodos = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: todoListTodosQueryKey() });
};

export const useCreateTodo = (
  options?: Omit<UseMutationOptions<Todo, Error, CreateTodoRequest>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<Todo, Error, CreateTodoRequest>({
    mutationFn: async (data) => {
      const response = await todoCreateTodo({
        body: toCreateTodoBody(data),
        throwOnError: true,
      });
      return toTodo(response.data);
    },
    onSuccess: (data) => {
      invalidateTodos(queryClient);
      addNotification({
        type: 'success',
        title: 'Todo created',
        message: `"${data.title}" has been created successfully.`,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create todo',
        message: error.message,
      });
    },
    ...options,
  });
};

export const useUpdateTodo = (
  options?: Omit<
    UseMutationOptions<Todo, Error, { id: string; updates: UpdateTodoRequest }>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<Todo, Error, { id: string; updates: UpdateTodoRequest }>({
    mutationFn: async ({ id, updates }) => {
      const response = await todoUpdateTodo({
        path: { todo_id: id },
        body: toUpdateTodoBody(updates),
        throwOnError: true,
      });
      return toTodo(response.data);
    },
    onSuccess: (data) => {
      invalidateTodos(queryClient);
      addNotification({
        type: 'success',
        title: 'Todo updated',
        message: `"${data.title}" has been updated successfully.`,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update todo',
        message: error.message,
      });
    },
    ...options,
  });
};
