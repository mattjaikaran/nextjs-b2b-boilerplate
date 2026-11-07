import { config } from '@/config';
import { api } from '@/lib/api';

import type { CreateClientConfig } from './generated/client.gen';

/**
 * Give the generated client the app's axios instance so its auth
 * interceptors (bearer token, refresh, CSRF) keep applying.
 */
export const createClientConfig: CreateClientConfig = override => ({
  ...override,
  axios: api,
  baseURL: config.api.baseUrl,
});
