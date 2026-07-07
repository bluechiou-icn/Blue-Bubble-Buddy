---
name: bbb-state-and-memory
description: Cross-session memory discipline via STATE.md — read it before starting any run, update it after every run, and leave handoff notes a zero-context successor can resume from. Load this skill at the start of any session in a repo that has (or should have) a STATE.md; before ending any working session; when the user says "update state", "handoff", "pick up where we left off", "resume", "what did the last session do", or "continue"; or when deciding whether a fact belongs in STATE.md, ARCHAEOLOGY.md, CLAUDE.md, code, or docs. Provides the STATE.md template, the division-of-memory table, the session-handoff checklist, and staleness/date-stamp rules. Not for writing investigation post-mortems (use bbb-failure-archaeology) or turning corrections into standing rules (use bbb-rule-distillation).
---

# bbb-state-and-memory — STATE.md discipline and session handoff

## Purpose / when to use

This skill defines how work survives the end of a session. Claude Code sessions
(and human working sessions) lose all conversational context when they end; the
only memory the next session gets is what was written to files. STATE.md is the
file that carries **current state and open work** across that gap. Load this
skill at the start of every run in a repo that uses STATE.md, and again in the
last minutes of every run, when you write the handoff. A "run" here means one
working session: from loading context to ending the final turn (one or more
passes of the Goal→Action→Check loop — see `bbb-eval-loop`).

## When NOT to use this skill

- **Recording an investigation post-mortem** (symptom → root cause → evidence →
  status): that is `bbb-failure-archaeology`. STATE.md only holds a one-line
  pointer to the archaeology entry.
- **Distilling a repeated correction into a standing rule** for every future
  session: that is `bbb-rule-distillation`. STATE.md never holds behavior rules.
- **Deciding what counts as evidence** for the claims you write into STATE.md:
  that is `bbb-verification-and-evidence`.
- **Investigating an unfamiliar repo for the first time**: that is
  `bbb-project-discovery`. If the repo has no STATE.md yet, discovery produces
  the first snapshot; this skill tells you where to write it.

## The contract (non-negotiable)

1. **READ before start.** The first action of any run is to read STATE.md at
   the repo root. If it exists, trust it as the map but not as the territory —
   re-verify anything stale (see "Staleness discipline" below). If it does not
   exist, create it from the template in this skill and say so in the first
   run log.

   ```bash
   cat STATE.md
   ```

2. **UPDATE after every run.** Before ending the session, record: what was
   **classified** (issues triaged, findings categorized), what fixes were
   **drafted or applied** (with evidence), and what was **escalated** (handed
   to a human or another owner). This is part of finishing the task, not
   optional cleanup — the turn-ending discipline in `f5-mode` applies: you may
   not end a run with the STATE.md update still on your to-do list.

3. **The failure mode this prevents:** a session that ends without updating
   STATE.md has silently destroyed its successor's context. The successor will
   re-derive facts, re-fight settled battles, or — worse — act on the previous
   snapshot as if it were current. Nothing in the session transcript survives;
   only the file does.

Self-check before ending a run (verified 2026-07-07 in this repo):

```bash
git status --porcelain -- STATE.md
```

If you did substantive work this run and that command prints nothing (no
modification and no untracked marker), you skipped the update. Go back.

## The STATE.md template

STATE.md is a **dashboard, not a chronicle**. Target under ~100 lines — one
screenful a successor can absorb in a minute. Overwrite freely: keep only the
latest run log and the current snapshot. Old versions live in git history;
investigation stories live in ARCHAEOLOGY.md. If a section is growing
run-over-run, you are chronicling — move the history out.

```markdown
# STATE.md — <project name>
Read this before doing anything. Update it before ending your session.
(See .claude/skills/bbb-state-and-memory/SKILL.md for the rules.)

## Current snapshot (verified YYYY-MM-DD)
- What exists: <components/files that are real, one line each>
- What works: <claim> — re-verify: `<one-line command>`
- What is broken or unknown: <claim, with the symptom>

## Last run (YYYY-MM-DD)
- Goal: <what this session set out to do>
- Outcome: <what actually happened> — evidence: <command output / file / test result>
- Classified: <...> | Fixed: <...> | Escalated: <...>
- Handoff:
  - Next action: <exact command or file+edit, executable without thinking>
  - Blocking issue: <what stops progress, and what input unblocks it — or "none">
  - Files in flight: <uncommitted/half-edited files, from `git status --porcelain=v1`>
  - Re-verify state: `<command(s) that confirm the snapshot still holds>`

## Open items / escalations
| Item | Owner | Blocked on | Since |
|---|---|---|---|
| <one line> | <person/session/role> | <the missing input> | YYYY-MM-DD |

## Decisions
- YYYY-MM-DD: <decision, one line>. Story: ARCHAEOLOGY.md entry #N
```

Rules per section:

- **Current snapshot** — present tense, verifiable claims only, each with a
  verified date and (where possible) a re-verification one-liner. No history.
- **Last run** — exactly one run. When you start a new run, the previous log
  gets overwritten after you have read it. Evidence follows the standards in
  `bbb-verification-and-evidence`; unverified claims are labeled unverified.
- **Open items / escalations** — every row has an owner. An escalation without
  an owner is a note, not an escalation, and it will rot.
- **Decisions** — one line each, newest first. The one line states what was
  decided; the *why* and the investigation behind it live in the archaeology
  chronicle (`bbb-failure-archaeology`). Delete a decision line only when the
  decision is reversed — and then record the reversal as a new line.

## The division of memory

One home per fact. If the same fact lives in two files, one copy will go stale
and the stale copy will eventually be believed.

| Home | Holds | Lifecycle | Governing skill |
|---|---|---|---|
| **STATE.md** | Current state + open work: snapshot, last run, escalations, next action | Volatile — overwritten every run | this skill |
| **ARCHAEOLOGY.md** | Permanent investigation chronicle: every major symptom → root cause → evidence → status | Append-only — entries are never rewritten | `bbb-failure-archaeology` |
| **CLAUDE.md** | Standing behavioral rules auto-loaded into every session | Slow-changing — rules added and retired deliberately | `bbb-rule-distillation` |
| **Code and docs** | The product itself: how the system works *now* | Versioned by git | the target repo's own conventions |

Routing test for any fact you are about to write down:

- "Where are we and what's next?" → STATE.md.
- "How did we learn this / why did that fail?" → ARCHAEOLOGY.md.
- "What must every future session always do (or never do)?" → CLAUDE.md, via
  `bbb-rule-distillation`.
- "How does the system behave?" → code and its docs. Never describe code
  behavior in STATE.md beyond "works / broken / unknown" plus a pointer.

## Session handoff: the last five minutes

The measure of a handoff is whether a **zero-context successor** — a human or
model who has read nothing but STATE.md — can resume in under five minutes.
Spend the last five minutes of every run producing these four things, written
into the `Handoff` block of the Last run section:

1. **Exact next action.** A command to run or a file plus the edit to make.
   "Continue improving the tests" is a theme, not an action; "Run `npm test`,
   then fix the failing assertion in `tests/parse.test.js`" is an action.
2. **Current blocking issue.** What stops progress and precisely what input
   would unblock it (a decision, a credential, a fact only the user knows).
   If nothing blocks, write "none" — absence of the field is ambiguous.
3. **Files in flight.** Any uncommitted or half-edited files, so the successor
   knows what is deliberate work-in-progress versus accidental droppings.
   Capture them with (verified 2026-07-07):

   ```bash
   git status --porcelain=v1
   ```

4. **Commands to re-verify state.** The one-liners that prove the snapshot's
   claims still hold, so the successor re-verifies instead of re-deriving.

Worked example of a bad vs good handoff line:

| Bad (theme, no evidence) | Good (executable, evidenced) |
|---|---|
| Next: keep working on the flaky test | Next: run `npx playwright test login.spec.ts --repeat-each=10`; last run failed 3/10 with timeout on `#submit` (output pasted in ARCHAEOLOGY.md #4) |

## Staleness discipline

A state claim is only as good as its date. Rules:

1. **Date-stamp every claim.** Snapshot lines, run logs, decisions, and open
   items all carry `YYYY-MM-DD`. Get today's date with (verified 2026-07-07):

   ```bash
   date -u +%Y-%m-%d
   ```

2. **The volatility rule.** A successor must re-verify any claim older than
   the volatility of the thing it describes. Guideline scale:

   | Claim type | Goes stale after | Example re-verification |
   |---|---|---|
   | "Tests pass" / "build is green" | any new commit | run the test/build command |
   | "Working tree is clean" / files in flight | any session | `git status --porcelain=v1` |
   | Environment facts (tool versions, services up) | days | `node --version`, health-check command |
   | Architecture, license, ownership | months | read the file in question |

3. **Embed re-verification one-liners.** Wherever possible, a snapshot claim
   carries the exact command that re-proves it, e.g.
   `Skill library has 16 skills — re-verify: ls .claude/skills/*/SKILL.md | wc -l`.
   A claim with a re-verification command costs the successor seconds; a bare
   claim costs them an investigation.

4. **Check when STATE.md itself was last touched.** (verified 2026-07-07;
   prints the last commit date for a tracked file, prints nothing if the file
   was never committed):

   ```bash
   git log -1 --format=%cs -- STATE.md
   ```

   Compare against the repo's last activity (`git log -1 --format='%h %cs %s'`,
   verified 2026-07-07). If the repo has moved since STATE.md was last updated,
   treat the entire snapshot as suspect and re-verify before relying on it.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Memory pillar),
  from the project owner's Phase 0 specification ("Update STATE.md after each
  run with classifications, fixes drafted, escalations. Read it before start.").
- Volatile facts in this skill: the sibling-skill names in the cross-references
  and the division-of-memory table (`bbb-failure-archaeology`,
  `bbb-rule-distillation`, `bbb-verification-and-evidence`,
  `bbb-project-discovery`, `bbb-eval-loop`, `f5-mode`) are accurate as of
  2026-07-07; re-verify with `ls /home/user/Blue-Bubble-Buddy/.claude/skills/`.
- The STATE.md template itself is a convention, not verified against tooling —
  no tool parses it; it is read by humans and models. Change it through this
  library's change control (`bbb-change-control`).
- All shell commands in this skill were run and verified 2026-07-07 on Linux
  with git 2.x in this repo; they are POSIX/git standard and unlikely to drift.
  Re-verify any of them by running it at a target repo's root.
