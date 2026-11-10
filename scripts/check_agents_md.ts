#!/usr/bin/env bun
/**
 * Agent-docs gate — fail when AGENTS.md is missing, a relative link in it does
 * not resolve, or CLAUDE.md is anything other than the `@AGENTS.md` import.
 *
 * Usage:
 *   bun run scripts/check_agents_md.ts
 *   bun run scripts/check_agents_md.ts --json
 *
 * Exit: 0 = agent docs valid, 1 = violations.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { argv, exit } from "node:process";

const PROJECT_ROOT = new URL("..", import.meta.url).pathname;

const AGENTS_FILE = join(PROJECT_ROOT, "AGENTS.md");

// [text](target) and ![alt](target), optional "title".
const MARKDOWN_LINK = /!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;

const EXTERNAL_TARGET = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

interface Violation {
  check: string;
  filepath: string;
  line: number;
  message: string;
}

export function extractRelativeLinks(markdown: string): { line: number; target: string }[] {
  const links: { line: number; target: string }[] = [];
  const lines = markdown.split("\n");

  for (let i = 0; i < lines.length; i++) {
    for (const match of lines[i].matchAll(MARKDOWN_LINK)) {
      const target = match[1];
      // Skip anchors, external URLs, and site-absolute paths.
      if (target.startsWith("#") || target.startsWith("/") || EXTERNAL_TARGET.test(target)) {
        continue;
      }
      const path = target.split("#")[0].split("?")[0];
      if (!path) continue;
      links.push({ line: i + 1, target: path });
    }
  }

  return links;
}

export function findBrokenLinks(markdown: string, root: string): Violation[] {
  const violations: Violation[] = [];
  const seen = new Set<string>();

  for (const { line, target } of extractRelativeLinks(markdown)) {
    if (seen.has(target)) continue;
    seen.add(target);
    const resolved = join(root, target);
    if (existsSync(resolved) && (statSync(resolved).isFile() || statSync(resolved).isDirectory())) {
      continue;
    }
    violations.push({
      check: "BROKEN_LINK",
      filepath: "AGENTS.md",
      line,
      message: `"${target}" does not resolve from the repo root`,
    });
  }

  return violations;
}

export function checkClaudeFile(root: string): Violation[] {
  const claudePath = join(root, "CLAUDE.md");
  if (!existsSync(claudePath)) return [];

  const body = readFileSync(claudePath, "utf-8").trim();
  if (body === "@AGENTS.md") return [];

  return [
    {
      check: "CLAUDE_NOT_IMPORT",
      filepath: "CLAUDE.md",
      line: 1,
      message: 'must be absent or contain only "@AGENTS.md" — AGENTS.md is the single source',
    },
  ];
}

function main(): number {
  const { values } = parseArgs({
    args: argv.slice(2),
    options: {
      json: { type: "boolean", default: false },
    },
    strict: false,
  });

  const violations: Violation[] = [];

  if (!existsSync(AGENTS_FILE)) {
    violations.push({
      check: "MISSING_AGENTS_MD",
      filepath: "AGENTS.md",
      line: 0,
      message: "AGENTS.md is missing from the repo root",
    });
  } else {
    violations.push(...findBrokenLinks(readFileSync(AGENTS_FILE, "utf-8"), PROJECT_ROOT));
  }

  violations.push(...checkClaudeFile(PROJECT_ROOT));

  if (values.json) {
    console.log(
      JSON.stringify(
        {
          violations: violations.map((v) => ({
            check: v.check,
            file: v.filepath,
            line: v.line,
            message: v.message,
          })),
          count: violations.length,
        },
        null,
        2
      )
    );
  } else {
    if (violations.length === 0) {
      console.log("Agent docs valid: AGENTS.md present, links resolve, CLAUDE.md in import form.");
    }
    for (const v of violations) {
      console.log(`[${v.check}] ${v.filepath}:${v.line} — ${v.message}`);
    }
    if (violations.length > 0) {
      console.log(`\n${violations.length} violation(s). Fix AGENTS.md before committing.`);
    }
  }

  return violations.length === 0 ? 0 : 1;
}

exit(main());
