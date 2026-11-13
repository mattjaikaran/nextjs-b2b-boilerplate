import type {
  CreateTodoSchema,
  PaginatedResponseSchemaTodoSchema,
  TodoSchema,
  UpdateTodoSchema,
  UserSchema,
  UserSignupSchema,
} from '@/api/generated/types.gen';
import type {
  AuthResponse,
  CreateTodoRequest,
  PaginatedResponse,
  QueryParams,
  RegisterCredentials,
  Todo,
  TodoPriority,
  UpdateTodoRequest,
  User,
} from '@/types';

const PRIORITIES: readonly TodoPriority[] = ['low', 'medium', 'high'];

const toPriority = (priority: string): TodoPriority =>
  PRIORITIES.includes(priority as TodoPriority) ? (priority as TodoPriority) : 'medium';

export const toTodo = (todo: TodoSchema): Todo => ({
  id: todo.id,
  title: todo.title,
  description: todo.description || undefined,
  completed: todo.completed,
  priority: toPriority(todo.priority),
  createdAt: todo.created_at,
  updatedAt: todo.updated_at,
  userId: todo.user,
});

export const toUser = (user: UserSchema): User => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName ?? '',
  lastName: user.lastName ?? '',
  isActive: user.isActive ?? true,
  lastLogin: user.lastLogin ?? undefined,
  createdAt: user.dateJoined ?? '',
  updatedAt: user.dateJoined ?? '',
});

export const toAuthResponse = (user: UserSchema): AuthResponse => ({
  user: toUser(user),
  tokens: null,
});

export const toTodoQuery = (params?: QueryParams) => ({
  page: params?.page,
  page_size: params?.page_size,
  search: params?.search,
  ordering: params?.ordering,
  completed: typeof params?.filters?.completed === 'boolean' ? params.filters.completed : undefined,
  priority: typeof params?.filters?.priority === 'string' ? params.filters.priority : undefined,
});

export const toPaginatedTodos = (
  response: PaginatedResponseSchemaTodoSchema,
  params?: QueryParams,
): PaginatedResponse<Todo> => {
  const limit = params?.page_size ?? 50;
  return {
    data: response.results.map(toTodo),
    pagination: {
      page: params?.page ?? 1,
      limit,
      total: response.count,
      totalPages: limit > 0 ? Math.ceil(response.count / limit) : 0,
    },
  };
};

export const toCreateTodoBody = (todo: CreateTodoRequest): CreateTodoSchema => ({
  title: todo.title,
  description: todo.description ?? '',
  completed: false,
  priority: todo.priority,
});

export const toUpdateTodoBody = (updates: UpdateTodoRequest): UpdateTodoSchema => ({
  title: updates.title,
  description: updates.description,
  completed: updates.completed,
  priority: updates.priority,
});

export const toSignupBody = (credentials: RegisterCredentials): UserSignupSchema => {
  // Keep the domain so users with the same local part do not collide.
  const username = credentials.email.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 100);
  return {
    email: credentials.email,
    username: username.length >= 3 ? username : `user_${username}`.slice(0, 100),
    password: credentials.password,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
  };
};

export const toUserUpdateBody = (updates: Partial<User>) => ({
  firstName: updates.firstName,
  lastName: updates.lastName,
});
