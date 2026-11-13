# Testing

Reference detail for [AGENTS.md](../AGENTS.md). This repo has no unit-test suite, and unit
tests are not part of the gate.

## What runs

| Check                   | Command                      |
| ----------------------- | ---------------------------- |
| Lint                    | `bun run lint`               |
| Typecheck               | `bun run typecheck`          |
| Conventions             | `bun run check-conventions`  |
| Dependencies documented | `bun run check-dependencies` |
| Agent docs              | `bun run check-agents`       |
| All gates               | `bun run gauntlet`           |
| Production build        | `bun run build`              |

A change is verified by running the affected page or API against the dev server plus the
gates above. State which command or scenario proved the change; do not claim a check that
was not run. Known pre-existing failures are noted in [AGENTS.md](../AGENTS.md#commands).

## When a change needs a test

Add a real behavioral test at the level the change lives at:

- **User-facing flows** — Playwright e2e under `tests/e2e/`, driven by the app's own
  selectors and real routes. Cover the behavior and its failure path, not markup.
- **Backend or API routes** — a smoke script under `tests/smoke/` that starts the app,
  calls the route, and asserts the response.

Wire any new test as a Bun script in `package.json` so it runs from a clean checkout with
`bun install`. Do not add unit tests for components, hooks, or utilities.
