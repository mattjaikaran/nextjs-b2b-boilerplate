# AGENTS.md

Single source of agent instructions for this repository. The nearest `AGENTS.md`
wins; this repo has exactly one. Other tools may read it through `CLAUDE.md`, which
must be absent or contain only `@AGENTS.md`.

## Project overview

- Next.js 16 App Router B2B SaaS boilerplate. Bun is the runtime and package manager;
  TypeScript is strict.
- UI: Tailwind CSS v4 + shadcn/ui. Client state: Zustand. Server state: TanStack Query.
  Forms: React Hook Form + Zod. HTTP: one Axios instance in `lib/api.ts`.
- Optional Django backend: `/api/v1/*` is rewritten to `INTERNAL_API_URL`, with a CSRF
  helper and a JWT refresh interceptor.
- `README.md` describes the feature set; [docs/architecture.md](docs/architecture.md) has
  the layers and data flow.

## Commands

Run everything from the repo root with Bun. `npm install` and `yarn add` are rejected by
the convention gate.

| Task                     | Command                      |
| ------------------------ | ---------------------------- |
| Install dependencies     | `bun install`                |
| Dev server               | `bun dev`                    |
| Production build         | `bun run build`              |
| Run the production build | `bun start`                  |
| Lint                     | `bun run lint`               |
| Lint (CI, warnings fail) | `bun run lint:strict`        |
| Format                   | `bun run format`             |
| Check formatting         | `bun run format:check`       |
| Typecheck                | `bun run typecheck`          |
| Convention gate          | `bun run check-conventions`  |
| Dependency gate          | `bun run check-dependencies` |
| Agent-docs gate          | `bun run check-agents`       |
| All gates                | `bun run gauntlet`           |
| React diagnostics        | `bun run doctor`             |
| Enable the commit hook   | `bun run hooks:install`      |

`bun install` rewrites `bun.lock` because package versions are pinned in `package.json`;
commit the refreshed lock together with the dependency change that caused it.

Every gate passes: `bun run lint:strict`, `bun run format:check`, `bun run typecheck`,
`bun run build`, `bun run doctor`, `check-conventions`, `check-dependencies`, and
`check-agents`. A change must not add diagnostics; run the relevant gate on the paths you
touched (`bunx oxlint <paths>`, `bunx oxfmt --check <paths>`,
`bun run check-conventions -- --check <ID>`).

## Code standards and architecture

Read [docs/code-standards.md](docs/code-standards.md) for the rules each gate enforces and
[docs/architecture.md](docs/architecture.md) before adding a route, hook, or service. Fix the
diagnostics your change introduces; the gates are green on a clean tree.

## Testing policy

There is no unit-test suite and unit tests are not run. Verify behavior by exercising the
affected page or API and by running the gates. When a change needs an automated test, add
Playwright e2e coverage under `tests/e2e/` or a backend smoke script under `tests/smoke/`,
wired as a Bun script. See [docs/testing.md](docs/testing.md).

## Git and commit rules

- Conventional Commits: `type(scope): Imperative summary`, subject at most 50 characters,
  body wrapped at 72. Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`,
  `ci`, `perf`, `style`.
- One logical change per commit; stage explicit paths. Never commit `.env*` files, secrets,
  or build output.
- Do not force-push a shared branch or amend a commit that has been pushed.

## Spec workflow

Work driven by agent-run starts from a spec in `tasks/specs/`. Read
[tasks/specs/README.md](tasks/specs/README.md) and the spec for the current task before
editing. Modify only the files the spec lists as owned, and run its gate commands before
committing.

## Security

- `NEXT_PUBLIC_*` values ship to the browser; never put secrets there. Keep tokens under the
  configured auth storage key and out of logs.
- Validate external input with Zod at the API boundary.
- Hard rules are enforced by tooling: `.githooks/pre-commit` (installed with
  `bun run hooks:install`) runs the agent-docs gate, and `.gitignore` excludes env files and
  personal agent overrides.
- Report vulnerabilities privately to the maintainer; do not open a public issue with
  exploit details.

## Agent skills

Skills live in `.claude/skills/<name>/SKILL.md` with `name` and `description` frontmatter so
only the description loads until the skill is used. `react-doctor` is symlinked from the
package that ships it; run it with `bun run doctor`.
