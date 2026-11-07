import type { User } from './user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DjangoJWTTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface MagicLinkRequest {
  email: string;
}

export interface AuthResponse {
  user: User;
  /** Cookie-authenticated backends return no bearer tokens. */
  tokens: AuthTokens | null;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
}
