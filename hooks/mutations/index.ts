'use client';

/**
 * Mutation Hooks Exports
 * Domain-specific hooks for mutations
 */

// Auth mutations
export {
  useChangePassword,
  useLogin,
  useLogout,
  useMagicLink,
  useRegister,
  useUpdateProfile,
} from './use-auth-mutations';

// Todo mutations
export {
  useCreateTodo,
  useUpdateTodo,
} from './use-todo-mutations';
