import { existsSync } from 'node:fs';

import { defineConfig } from '@hey-api/openapi-ts';

const specCandidates = [
  'backend/docs/openapi/openapi.json',
  '../backend/docs/openapi/openapi.json',
  'openapi.json',
];

const input =
  process.env.OPENAPI_SPEC ??
  specCandidates.find((candidate) => existsSync(candidate)) ??
  'openapi.json';

export default defineConfig({
  input,
  output: process.env.OPENAPI_OUTPUT ?? 'src/api/generated',
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: './src/api/hey-api.ts',
    },
    '@hey-api/sdk',
    {
      name: 'zod',
      compatibilityVersion: 4,
      requests: true,
      responses: true,
      definitions: true,
    },
    '@tanstack/react-query',
  ],
});
