# Frozen Files - Manual Edit Only

This document lists files that should **never** be automatically regenerated during CI runs.

## 🔒 Frozen Documentation Files

These files are manually maintained and should only be updated by maintainers:

- `README.md` - Project overview and getting started guide
- `CONTRIBUTING.md` - Contribution guidelines
- `SECURITY.md` - Security policy
- `LICENSE` - Project license
- `TESTING.md` - Testing documentation
- `PRD.md` - Product requirements document
- `OFFLINE_FIRST_IMPLEMENTATION.md` - Offline-first testing implementation details

## 🔒 Frozen Configuration Files

These files define project structure and should not be auto-generated:

- `.github/workflows/main.yml` - CI/CD pipeline (validation only)
- `.github/workflows/TESTING.md` - Workflow testing guide
- `.github/dependabot.yml` - Dependency update configuration
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `playwright.config.ts` - E2E test configuration

## 📝 Regeneration Policy

### CI Pipeline Rules

The CI pipeline (`npm ci && npm run build && npm run test:e2e`) must:
- ✅ Only **validate** code (lint, typecheck, build, test)
- ❌ Never modify or regenerate any tracked files
- ✅ Leave repository clean (`git status` shows no changes after run)

### Manual Regeneration Only

If documentation needs to be regenerated:

1. **Use the manual script**: `npm run regen-docs`
2. **Requires confirmation**: Interactive prompt prevents accidental runs
3. **Review changes**: Always review and commit regenerated files manually
4. **Never in CI**: Regeneration scripts must not run during CI/CD pipelines

## 🚫 Anti-Patterns to Avoid

- ❌ Auto-generating docs on every build
- ❌ Modifying source files during test runs
- ❌ Running regeneration scripts in CI workflows
- ❌ Using pre/post build hooks to update documentation
- ❌ Committing generated files automatically

## ✅ Correct Workflow

```bash
# Development: validation only (no file modifications)
npm ci
npm run lint
npm run build
npm run test:e2e

# Documentation updates: manual only (when needed)
npm run regen-docs  # Interactive confirmation required
git add .
git commit -m "docs: update documentation"
git push
```

## 📋 Maintenance Notes

- Last updated: October 2025
- Policy owner: Repository maintainers
- Enforcement: CI checks verify no file modifications occur
