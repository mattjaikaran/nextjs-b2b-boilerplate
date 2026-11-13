# Code standards

Reference detail for [AGENTS.md](../AGENTS.md). The rules below are the ones the gates
enforce; run `bun run gauntlet` before committing.

## Gate mapping

`bun run check-conventions` scans `app/`, `components/`, `forms/`, `hooks/`, `lib/`,
`types/`, and `config/` (excluding `components/ui`) and fails on:

| Check                    | Rule                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `NO_ANY_CAST`            | No `as any`; model the type instead.                                                 |
| `NO_TS_IGNORE`           | No `@ts-ignore` / `@ts-expect-error`; fix the type error.                            |
| `NO_CONSOLE_LOG`         | No `console.log` in application code; use the toast or error boundaries.             |
| `NO_WINDOW_LOCATION`     | Use `useRouter()` from `next/navigation`, not `window.location.href =`.              |
| `NO_INLINE_NAVIGATE`     | Use `redirect()` in a server component, not a `<Navigate>` component.                |
| `NO_NPM_YARN`            | No `npm install` / `yarn add` in code, scripts, or docs; use Bun.                    |
| `NO_DEFAULT_EXPORT`      | Components and forms use named exports. Route files keep Next's default exports.     |
| `API_DIRECT_AXIOS`       | Import `api` from `@/lib/api`; do not construct Axios clients outside the API layer. |
| `NO_USE_STATE_FOR_FORMS` | Form state uses React Hook Form + Zod, not `useState`.                               |
| `NO_INLINE_FETCH`        | No `fetch()` or `axios.` calls outside `hooks/`, `lib/`, and `app/api/`.             |
| `COMPONENT_SIZE`         | Component files stay at or below 300 lines; split instead of growing.                |

`bun run check-dependencies` fails when a `package.json` dependency has no row in
[DEPENDENCIES.md](../DEPENDENCIES.md); add the row with the dependency.

`bun run lint:strict` runs [oxlint](../.oxlintrc.json) over the repo and fails on warnings;
`bun run lint` and `bun run lint:fix` drop that or apply fixes. The config turns on the
TypeScript, react, nextjs, import and jsx-a11y plugins, keeps `correctness` at error, and
enforces `react/rules-of-hooks`, `react/exhaustive-deps`, `typescript/no-unused-vars` and
`prefer-const`. Generated code under `src/api/generated/` is ignored.

`bun run format:check` verifies formatting with [oxfmt](../.oxfmtrc.json) and `bun run format`
rewrites the repo. Both skip `src/api/generated/` and `bun.lock`.

`bun run doctor` runs react-doctor with `--blocking error`; [doctor.config.json](../doctor.config.json)
ignores generated code and build output.

`bun run check-agents` fails when `AGENTS.md` is missing, one of its relative links does
not resolve, or `CLAUDE.md` exists with anything other than `@AGENTS.md`.

## TypeScript

- `strict` is on. Prefer precise types over assertions; parse external data with Zod.
- Shared types live in `types/` and are re-exported from `types/index.ts`.
- Client modules that use browser APIs start with `'use client'`.

## Naming and structure

- Files: kebab-case (`org-switcher.tsx`, `use-todo-queries.ts`).
- Components: PascalCase named exports; hooks start with `use`.
- One domain per folder under `forms/`; hooks are grouped by role under `hooks/queries/`,
  `hooks/mutations/`, and `hooks/api/`.
- Import through the `@/*` alias; keep relative imports inside a single folder.

## Styling

- Tailwind utility classes with `cn` for conditional merging; avoid ad-hoc CSS files.
- Use the design tokens declared in `app/globals.css`.
- Follow the existing shadcn/ui composition patterns instead of inventing new primitives.
