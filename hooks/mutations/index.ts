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
  useRequestPasswordReset,
  useResetPassword,
  useUpdateProfile,
  useVerifyMagicLink,
} from './use-auth-mutations';

// Org mutations
export {
  useCreateOrganization,
  useInviteMember,
  useRemoveMember,
  useUpdateOrganization,
} from './use-org-mutations';

// Todo mutations
export {
  useCreateTodo,
  useDeleteTodo,
  useToggleTodo,
  useUpdateTodo,
} from './use-todo-mutations';
