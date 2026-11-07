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
  TodoStats,
  UpdateTodoRequest,
  User,
} from '@/types';

const PRIORITIES: readonly TodoPriority[] = ['low', 'medium', 'high'];

const toPriority = (priority: string): TodoPriority =>
  PRIORITIES.includes(priority as TodoPriority)
    ? (priority as TodoPriority)
    : 'medium';

export const toTodo = (todo: TodoSchema): Todo => ({
  id: todo.id,
  title: todo.title,
  description: todo.description || undefined,
  completed: todo.completed,
  priority: toPriority(todo.priority),
  createdAt: todo.created_at,
  updatedAt: todo.updated_at,
  userId: todo.user,
  tags: [],
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
  tokens: { accessToken: '', refreshToken: '' },
});

export const toTodoQuery = (params?: QueryParams) => ({
  page: params?.page,
  page_size: params?.page_size,
  search: params?.search,
  ordering: params?.ordering,
  completed:
    typeof params?.filters?.completed === 'boolean'
      ? params.filters.completed
      : undefined,
  priority:
    typeof params?.filters?.priority === 'string'
      ? params.filters.priority
      : undefined,
});

export const toPaginatedTodos = (
  response: PaginatedResponseSchemaTodoSchema,
  params?: QueryParams
): PaginatedResponse<Todo> => {
  const limit = params?.page_size ?? response.results.length;
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

export const toTodoStats = (todos: Todo[]): TodoStats => ({
  total: todos.length,
  completed: todos.filter(todo => todo.completed).length,
  pending: todos.filter(todo => !todo.completed).length,
  overdue: 0,
  byPriority: todos.reduce<Record<string, number>>((counts, todo) => {
    counts[todo.priority] = (counts[todo.priority] ?? 0) + 1;
    return counts;
  }, {}),
});

export const toCreateTodoBody = (
  todo: CreateTodoRequest
): CreateTodoSchema => ({
  title: todo.title,
  description: todo.description ?? '',
  completed: false,
  priority: todo.priority,
});

export const toUpdateTodoBody = (
  updates: UpdateTodoRequest
): UpdateTodoSchema => ({
  title: updates.title,
  description: updates.description,
  completed: updates.completed,
  priority: updates.priority,
});

export const toSignupBody = (
  credentials: RegisterCredentials
): UserSignupSchema => {
  const localPart = credentials.email
    .split('@')[0]
    .replace(/[^a-zA-Z0-9_]/g, '')
    .slice(0, 100);
  return {
    email: credentials.email,
    username: localPart.length >= 3 ? localPart : `user${Date.now()}`,
    password: credentials.password,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
  };
};

export const toUserUpdateBody = (updates: Partial<User>) => ({
  firstName: updates.firstName,
  lastName: updates.lastName,
});
