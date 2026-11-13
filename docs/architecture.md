# Architecture

Reference detail for [AGENTS.md](../AGENTS.md). Keep rules in one place: this file owns
layering and data-flow conventions.

## Layers

| Layer      | Location                                           | Role                                                                                                          |
| ---------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Routes     | `app/`                                             | App Router pages, layouts, route handlers. Server components unless interactivity requires a client leaf.     |
| Forms      | `forms/<domain>/`                                  | React Hook Form components with Zod resolvers.                                                                |
| Components | `components/`                                      | Presentational and shared UI. `components/ui/` holds shadcn primitives.                                       |
| Hooks      | `hooks/queries/`, `hooks/mutations/`, `hooks/api/` | TanStack Query bindings; the only place components read or write server state.                                |
| API        | `src/api/generated/`                               | OpenAPI-generated SDK and TanStack Query key helpers; `lib/api-mappers.ts` maps SDK payloads to domain types. |
| Client     | `lib/api.ts`                                       | The single Axios instance: base URL, timeout, JWT attach/refresh, Django CSRF header.                         |
| State      | `lib/store/`                                       | Zustand slices for UI and auth state.                                                                         |
| Config     | `config/index.ts`                                  | Typed environment configuration and `isDjangoSPA()`.                                                          |
| Types      | `types/`                                           | Shared TypeScript types.                                                                                      |

## Data flow

`page or component → hook → generated SDK → lib/api.ts → backend`

- Components never call `fetch`, `axios`, or `api` directly; the convention gate rejects
  inline API calls outside `hooks/`, `lib/`, and `app/api/`.
- TanStack Query owns server state. Do not copy query data into Zustand; Zustand is for
  client-only state such as UI toggles and the auth session.
- Query keys come from the generated `src/api/generated/@tanstack/react-query.gen.ts`
  helpers (for example `todoListTodosQueryKey`) so invalidation stays consistent.

## Client and server boundaries

- `app/` files are server components by default. Add `'use client'` only to files that use
  hooks, browser APIs, or event handlers (forms, providers, query hooks).
- Navigate with `useRouter()` from `next/navigation`; server redirects use `redirect()`.
- Route handlers live in `app/api/<name>/route.ts`. `app/api/health/route.ts` is the health
  probe template.

## Backend integration

- Standalone mode talks to `NEXT_PUBLIC_API_BASE_URL`.
- Django SPA mode (`NEXT_PUBLIC_MODE=django-spa`) uses `/api/v1`, sends the `csrftoken`
  cookie value as `X-CSRFToken`, and enables credentialed requests.
- `next.config.ts` rewrites `/api/v1/:path*` to `INTERNAL_API_URL` (default
  `http://localhost:8000`). The browser never needs the internal host.

## UI system

- Tailwind CSS v4 is configured through `app/globals.css` and `postcss.config.mjs`; there is
  no `tailwind.config`.
- shadcn/ui primitives in `components/ui/` are generated. Add or update them with
  `bunx shadcn@3.8.5 add <component>` instead of hand-editing, since regeneration overwrites
  local changes.
- Icons come from `lucide-react`; class merging uses `cn` from `lib/utils.ts`.
