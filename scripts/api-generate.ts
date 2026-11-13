#!/usr/bin/env bun
/**
 * Generate the OpenAPI client.
 *
 * The generator imports the TypeScript compiler, which Bun cannot load with
 * the current pinned version, so run its CLI under Node.
 */

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function generateApi(output?: string): void {
  const result = spawnSync(
    process.env.NODE_BINARY ?? 'node',
    [
      join('node_modules', '@hey-api', 'openapi-ts', 'bin', 'run.js'),
      '--file',
      'openapi-ts.config.ts',
    ],
    {
      cwd: PROJECT_ROOT,
      env: output ? { ...process.env, OPENAPI_OUTPUT: output } : process.env,
      stdio: 'inherit',
    },
  );

  if (result.status !== 0) {
    throw new Error('OpenAPI client generation failed.');
  }
}

if ((import.meta as ImportMeta & { main?: boolean }).main) generateApi();
