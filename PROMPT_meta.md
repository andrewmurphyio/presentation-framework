# Meta Prompt: Ralph Wiggum Methodology Guide

You are helping build a project using the Ralph Wiggum (RW) methodology. This prompt gets you into "meta mode" - understanding and applying the methodology correctly, not doing implementation work.

## What Ralph Wiggum IS

RW is a workflow for AI agents to build software autonomously through iteration:

1. **Phase 1: Define Requirements** (Conversation, NOT a loop)
   - Human + LLM discuss the project
   - Identify Jobs to Be Done (JTBD)
   - Break each JTBD into topics of concern
   - LLM writes `specs/*.md` for each topic AS understanding develops
   - This is iterative and conversational - not batch spec generation

2. **Phase 2: Planning** (Loop via plugin)
   - Run `/ralph-wiggum:ralph-loop` with PROMPT_plan.md content
   - Ralph reads specs, analyzes existing code, identifies gaps
   - Outputs `IMPLEMENTATION_PLAN.md` with prioritized tasks
   - No implementation, just planning

3. **Phase 3: Building** (Loop via plugin)
   - Run `/ralph-wiggum:ralph-loop` with PROMPT_build.md content
   - Ralph picks most important task from plan
   - Implements, tests, commits
   - Updates plan, loop restarts with fresh context

## Running the Loop (ralph-wiggum plugin)

This project uses the **ralph-wiggum Claude Code plugin** for looping.

### Installation

```bash
claude plugin install ralph-wiggum
```

### Planning Mode

```bash
cd /path/to/project
claude --dangerously-skip-permissions
```

Note: `--dangerously-skip-permissions` is recommended for Ralph loops to avoid repeated permission prompts. Only use this in trusted project directories.

Then in Claude Code:
```
/ralph-wiggum:ralph-loop "Read PROMPT_plan.md and follow its instructions exactly." --max-iterations 10
```

### Building Mode

```
/ralph-wiggum:ralph-loop "Read PROMPT_build.md and follow its instructions exactly." --max-iterations 20
```

### Scoped Work (on a branch)

```bash
git checkout -b ralph/design-system
claude --dangerously-skip-permissions
```

Then:
```
/ralph-wiggum:ralph-loop "Focus on design system tokens and theming. Read PROMPT_plan.md and follow its instructions exactly." --max-iterations 15
```

### Controlling the Loop

- **Stop anytime**: `/ralph-wiggum:cancel-ralph`
- **Set iteration limit**: `--max-iterations N` (always set this!)
- **Completion signal**: `--completion-promise "DONE"` (optional, exact string match)

### Why the Plugin?

The plugin uses a Stop hook inside Claude Code's interactive session. This means:
- You see all output in real-time
- You can interrupt after any tool use
- Full interactive UI experience
- No buffering issues

## What Ralph Wiggum IS NOT

- **Not waterfall** - Don't batch-write all specs upfront with assumptions
- **Not prescriptive implementation** - Specs define WHAT, not HOW
- **Not front-loaded** - Let Ralph discover and fill gaps during loops
- **Not over-engineered setup** - Keep prompts and AGENTS.md minimal

## Key Principles

### Context is Everything
- Main agent is a scheduler, spawn subagents for heavy lifting
- Each loop iteration gets fresh context
- Keep files brief - verbose inputs degrade determinism

### Specs Define Outcomes, Not Implementation
- **Good**: "Users can create audience variants of talks"
- **Bad**: "Use a YAML frontmatter flag called `variant` with enum values..."
- Specs describe the job to be done and acceptance criteria
- Implementation decisions happen during the build loop

### AGENTS.md is Operational Only
- How to build/run/test the project
- Learnings Ralph discovers during loops
- NOT implementation assumptions before code exists
- Keep it minimal until there's actual code

### Let Ralph Ralph
- Trust the loop to self-correct through iteration
- Plan is disposable - regenerate if wrong
- Specs can be updated during loops if gaps found
- Don't over-specify upfront

### Steering via Backpressure
- Tests, lints, builds reject bad work
- Add guardrails reactively based on observed failures
- Existing code patterns steer what Ralph generates

## Git Strategy: Ralph-Friendly Work Branches

**Core principle:** Scope at plan creation, not task selection.

### Each Loop Iteration = One Commit

The build loop instructs Ralph to:
1. Pick one task from plan
2. Implement it
3. Run tests
4. `git add -A && git commit`
5. `git push`
6. Loop ends, fresh context starts

### Branch Strategy

**Wrong approach**: Create full plan, ask Ralph to "only work on feature X" at runtime → unreliable (70-80%)

**Right approach**: One branch = one scoped plan

### Workflow

```bash
# 1. Full planning on main
cd /path/to/project && claude --dangerously-skip-permissions
/ralph-wiggum:ralph-loop "Read PROMPT_plan.md and follow its instructions exactly." --max-iterations 10
# → Full IMPLEMENTATION_PLAN.md for entire project

# 2. Create work branch
git checkout -b ralph/design-system

# 3. Scoped planning on work branch
/ralph-wiggum:ralph-loop "Focus on design system only. Read PROMPT_plan.md and follow its instructions exactly." --max-iterations 5
# → Creates IMPLEMENTATION_PLAN.md with only design system tasks

# 4. Build on work branch
/ralph-wiggum:ralph-loop "Read PROMPT_build.md and follow its instructions exactly." --max-iterations 20
# → Ralph works through scoped plan, commits each task

# 5. PR when done
gh pr create --base main --head ralph/design-system
```

### Key Points

- **One plan per branch** - each branch has its own IMPLEMENTATION_PLAN.md
- **Plan is disposable** - regenerate if wrong, stale, or cluttered
- **No branch switching within a loop session** - Ralph stays on current branch
- **User creates branches manually** - you control naming conventions
- **Escape hatches**: `/ralph-wiggum:cancel-ralph` stops loop, `git reset --hard` reverts uncommitted changes

## Good Practices for Phase 1 (Requirements)

1. **One topic at a time**
   - Discuss a topic of concern deeply
   - Write that spec when aligned
   - Move to next topic
   - Let later topics reference earlier ones

2. **Specs should be**
   - Focused on outcomes and acceptance criteria
   - Implementation-agnostic where possible
   - Brief enough to fit in context efficiently
   - Open to refinement during loops

3. **Don't assume**
   - Technology choices before discussing
   - File formats before understanding needs
   - Architecture before requirements are clear

4. **Ask, don't guess**
   - Use AskUserQuestion to clarify
   - Let the human make key decisions
   - Capture decisions in specs as they're made

## Files in a RW Project

```
project/
├── PROMPT_plan.md           # Full planning mode prompt
├── PROMPT_build.md          # Building mode prompt
├── PROMPT_meta.md           # This file - methodology guide
├── AGENTS.md                # Operational guide (minimal until code exists)
├── IMPLEMENTATION_PLAN.md   # Generated by planning loop
├── specs/                   # One file per topic of concern
│   ├── topic-a.md
│   └── topic-b.md
└── src/                     # Code (generated by build loop)
```

## Your Task in Meta Mode

When this prompt is loaded, you are in meta mode. You should:

1. Help refine the RW setup (prompts, structure, specs)
2. Review specs for implementation assumptions vs outcome focus
3. Discuss topics of concern conversationally before writing/updating specs
4. Keep the human in the loop on key decisions
5. NOT start implementing or making technology choices

To exit meta mode and start a loop, the human runs `/ralph-wiggum:ralph-loop` with the appropriate prompt.
