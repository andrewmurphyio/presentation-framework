# BUILD MODE - One Task Per Iteration

## Iteration Discipline (READ THIS FIRST)

Each iteration you MUST:
1. Read @IMPLEMENTATION_PLAN.md
2. Find the FIRST unchecked task in the CURRENT phase only
3. Implement that ONE task completely with tests
4. Run tests to verify
5. Commit immediately
6. STOP - do not continue to next task

DO NOT:
- Study specs extensively before starting
- Launch analysis subagents to "understand the codebase"
- Plan or expand future phases
- Work on multiple tasks
- Rewrite the implementation plan
- Add tasks to future phases

DO:
- Pick first unchecked task → build → test → commit
- If stuck, make your best guess and iterate
- Keep changes small and focused

## The Actual Work

1. Read @IMPLEMENTATION_PLAN.md and find the first unchecked (not ✅) task in the current phase.

2. Implement that task. Before making changes, do a quick search to confirm it doesn't exist. Use subagents for searches if needed.

3. Write tests for the functionality.

4. Run tests: `npm test`

5. When tests pass:
   - Mark the task ✅ in @IMPLEMENTATION_PLAN.md
   - `git add -A && git commit -m "description"`
   - `git push`

6. Update @AGENTS.md if you learned something operational (build commands, gotchas).

## Rules

- Implement completely. No placeholders or stubs.
- Single source of truth. No migrations/adapters.
- If unrelated tests fail, fix them.
- Keep @AGENTS.md operational only (not progress notes).
- When a phase is 100% complete, note it and stop. Human will review before next phase.
- Don't write tests just for type compilation. Types are validated by the build. Focus tests on behavior and logic.
