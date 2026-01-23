# PLANNING MODE

## Your Task

Create or update @IMPLEMENTATION_PLAN.md with a focused, phased plan.

## Process

1. Read `specs/*` to understand requirements
2. Read existing `src/*` to understand what's built
3. Compare specs vs implementation to find gaps
4. Update @IMPLEMENTATION_PLAN.md

## Plan Structure

The plan MUST have:
- **One current phase** with detailed, checkboxed tasks (the phase being worked on)
- **Future phases** as ONE-LINE summaries only (no task lists)
- Clear "Phase X complete" markers for finished work

Example structure:
```
## Phase 1: MVP ✅ Complete

## Phase 2: Navigation (CURRENT)
- [ ] Task 1 with details
- [ ] Task 2 with details
- [ ] Task 3 with details

## Future Work
- Phase 3: Animations (one line summary)
- Phase 4: Presenter view (one line summary)
```

## Rules

- Plan only. Do NOT implement anything.
- Keep current phase small (5-10 tasks max)
- Future phases are just titles - no task lists
- Confirm gaps with code search before adding tasks
- If specs are missing, note them but don't write them here

## Goal

A presentation library with: design system, themes, layouts, components, animations, navigation, presenter view, variants, and media support.

Build incrementally. Each phase delivers working functionality.
