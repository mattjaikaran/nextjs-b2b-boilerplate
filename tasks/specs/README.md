# Specs

Task specs consumed by agent-run live in this directory, one file per task:
`tasks/specs/<task>.md`. The spec is the requirement; read it before touching code and keep
changes inside its declared ownership.

## Required sections

```markdown
## Goal

What the change must achieve, in one or two sentences.

## Files owned

The files or directories this task may modify. Anything else is out of scope.

## Acceptance

Observable, checkable outcomes (behavior, response, rendered state).

## Gate

The commands that must pass before the commit, for example:

- bun run gauntlet
- bun run build
```

## Rules

- If the spec conflicts with [AGENTS.md](../../AGENTS.md), the spec wins for that task; note
  the conflict in the commit body.
- Do not edit another task's spec or files listed under a different task.
- Run every command in the Gate section and report the actual result.
- When a task needs a test, follow [docs/testing.md](../../docs/testing.md).
