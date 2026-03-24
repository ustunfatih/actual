---
name: pre-commit-check
description: Run the full Actual Budget pre-commit quality checklist before committing. Verifies [AI] prefix, typecheck, lint, and tests all pass.
disable-model-invocation: false
---

# Pre-Commit Quality Checklist

You are running the mandatory pre-commit checklist for the Actual Budget repository.
Work through each step below IN ORDER. Do not skip any step.

## Step 1 — Verify commit message has [AI] prefix

Ask the user: "What is your planned commit message?"

If the message does NOT start with `[AI]`, stop immediately and say:
> "Your commit message must start with `[AI]`. Proposed fix: `[AI] <your message>`"

Wait for confirmation before continuing.

## Step 2 — Run typecheck

```bash
yarn typecheck 2>&1 | tail -20
```

If there are TypeScript errors, list them clearly and fix them before proceeding.
If clean, confirm: "✓ Typecheck passed"

## Step 3 — Run lint fix

```bash
yarn lint:fix 2>&1 | tail -10
```

If there are unfixable lint errors, surface them.
If clean, confirm: "✓ Lint passed"

## Step 4 — Run relevant tests

Determine which packages were modified, then run:

```bash
# For targeted workspace test (replace <pkg> with changed package):
yarn workspace @actual-app/<pkg> test 2>&1 | tail -20

# Or for all tests:
yarn test 2>&1 | tail -20
```

If tests fail, show the failures and fix them before proceeding.
If clean, confirm: "✓ Tests passed"

## Step 5 — Check for untranslated strings

If any UI-facing string literals were added to `desktop-client`, remind the user:
> "Check that new user-facing strings use the translation system (see eslint rule `no-untranslated-strings`)."

## Step 6 — Confirm and commit

All checks passed. Stage and commit with the `[AI]`-prefixed message. Do NOT use `--no-verify`.

```bash
git add <files>
git commit -m "[AI] <message>"
```

## Quick Reference Rules (from AGENTS.md)

- ALL commit messages MUST start with `[AI]`
- Never use `--no-verify` or `--no-gpg-sign`
- Never force-push master
- Run `yarn typecheck` → `yarn lint:fix` → tests before every commit
