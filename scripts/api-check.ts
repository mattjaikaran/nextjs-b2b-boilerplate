#!/usr/bin/env bun
/**
 * Fail when the committed OpenAPI client differs from the producer schema.
 */

import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateApi } from './api-generate';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMMITTED_DIR = 'src/api/generated';

async function files(root: string, directory = root): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return files(root, path);
      if (!entry.isFile()) {
        throw new Error(`Unexpected generated entry: ${path}`);
      }
      return [relative(root, path)];
    }),
  );
  return paths.flat().sort();
}

// Generate beside the committed client so the runtime config import path has
// the same depth as the real output.
const temporary = await mkdtemp(join(PROJECT_ROOT, 'src/api/check-'));
try {
  const fresh = temporary;
  generateApi(fresh);

  const committed = join(PROJECT_ROOT, COMMITTED_DIR);
  const [expected, actual] = await Promise.all([files(fresh), files(committed)]);
  const drift: string[] = [];
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);

  for (const path of expected) {
    if (!actualSet.has(path)) {
      drift.push(`Missing: ${path}`);
      continue;
    }
    const [left, right] = await Promise.all([
      readFile(join(fresh, path)),
      readFile(join(committed, path)),
    ]);
    if (!left.equals(right)) drift.push(`Changed: ${path}`);
  }
  for (const path of actual) {
    if (!expectedSet.has(path)) drift.push(`Extra: ${path}`);
  }

  if (drift.length) {
    throw new Error(`Generated API drift. Run bun run api:generate.\n${drift.join('\n')}`);
  }
  console.log('Generated API matches the OpenAPI contract.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
