---
name: bbb-campaign-planning
description: The decision-gated campaign format for hard problems that span multiple sessions — numbered phases with exact commands, expected observations at every gate, explicit branches when reality disagrees, a ranked solution menu, fenced-off known wrong paths, and a validation-and-promotion protocol. Load this skill when a problem is too big for one session's eval loop; when the user says "campaign", "battle plan", "attack plan", "this will take weeks", or asks how to hand a hard problem to future sessions; when work on a hard problem keeps restarting from scratch each session; or when a solution attempt needs a go/no-go decision structure. Includes a candidate campaign for this library's own hardest problem (cross-model behavior parity). Not for single-session tasks (bbb-eval-loop) or open research questions without a decided goal (bbb-research-methodology, bbb-research-frontier).
---

# Campaign Planning

## Purpose

Some problems outlive any single session: they need several work sessions,
have competing solution approaches, and have wrong paths that have already
burned time. A campaign is a written, decision-gated plan that lets ANY
session — including a zero-context one — pick up the problem, execute the
current phase, read the gate, and either advance or branch, without re-deciding
what has already been decided.

## When NOT to use this skill

- The problem fits in one session: run `bbb-eval-loop` directly.
- The goal itself is still undecided (a hunch, not a plan): develop it with
  `bbb-research-methodology`; frontier-scale open problems live in
  `bbb-research-frontier`.
- Routine debugging: `bbb-debugging-playbook`.

## When a problem deserves a campaign

Any two of: spans multiple sessions; has 2+ competing solution approaches;
has known wrong paths that must be fenced; needs go/no-go decisions a future
session must be able to make alone; failure is expensive enough that "judged
by eye" is unacceptable.

## The campaign document

Lives in the target project (convention: `docs/campaigns/<name>.md`), is
updated at every gate, and STATE.md points at the active campaign and current
phase (`bbb-state-and-memory`). Template:

```markdown
# Campaign: <name>            Status: <phase N / stalled / done>  (<date>)

## Problem and definition of done
<What is broken/missing. Done = a MEASURABLE condition: numbers, passing
checks, rubric scores. "Looks better" is not a definition of done.>

## Phases
### Phase 1 — <name>
- Commands: <exact, copy-pasteable>
- EXPECT: <the observation/numbers you should see>
- Gate: if EXPECT holds → Phase 2.
  If you see <X> instead → <branch: Phase 1b / solution menu item 2 / escalate>.
- Result (filled at execution): <observed values, date, session>
### Phase 2 — …

## Solution menu (ranked)
1. <approach> — obligation before attempting: <the theory/derivation/measurement
   that must exist first, so attempts are arguments, not gambles>
2. <approach> — obligation: …

## Fenced wrong paths — do NOT re-attempt
- <path> — <one-line reason>; evidence: <chronicle entry / gate result>

## Validation and promotion
<How a candidate result becomes an adopted change: the acceptance evidence
required, and the change-control route it must pass (for this library:
bbb-change-control; for a target project: its own process).>
```

Rules that make campaigns survive sessions:

1. **Every gate pre-commits its expectation.** A gate without a written EXPECT
   is an opinion checkpoint, and a future session will rationalize whatever it
   sees (same pre-commitment rule as `bbb-eval-loop`, at phase scale).
2. **Branches are written before they're needed.** "If you see X instead → Y"
   is authored while calm, not improvised while frustrated.
3. **Wrong paths get fenced with evidence,** citing the chronicle
   (`bbb-failure-archaeology`) — an unfenced dead end will be re-walked.
4. **Results are appended at execution time,** with date and observed numbers;
   the campaign doc is both plan and log.
5. **Success is measurable, never judged by eye.** If the problem is visual,
   the measure is a criteria table over screenshots (`bbb-visual-self-check`).

## Candidate campaign: cross-model behavior parity

Status: CANDIDATE — designed 2026-07-07, not yet executed. Everything below is
a plan with target thresholds to be set from Phase 1 baselines; there are no
results yet, and no effectiveness claim is being made.

**Problem.** This library exists so Sonnet-class sessions can work at
Fable-class discipline. Today "does it work?" is judged by reading transcripts
— unmeasured. **Done =** a parity score, defined below, measured with the
library ≥ a pre-registered threshold above the no-library baseline, stable
across 3 runs per task.

- **Phase 1 — Rubric and baseline.** Derive a binary rubric from the `b5-mode`
  contract per recipe 2 in `bbb-research-methodology` (five yes/no checks on
  the final transcript). Run 3 benchmark tasks (one debug, one feature, one report)
  WITHOUT the library; score transcripts. EXPECT: measurable rubric misses in
  the baseline (if baseline is already near-perfect → the rubric is too easy →
  branch: tighten rubric before proceeding).
- **Phase 2 — Treatment.** Same tasks, same models, library installed. EXPECT:
  score deltas on the rubric dimensions the skills target. If no delta →
  branch: check the skills actually loaded (trigger problem →
  `bbb-skill-authoring`) before concluding content failure.
- **Phase 3 — Iterate.** For each lagging dimension, change ONE skill at a
  time and re-run (`bbb-eval-loop` within the phase). Gate: pre-registered
  threshold met on 3 consecutive runs.
- **Promotion.** Rubric + scores land in the repo; skill changes route through
  `bbb-change-control` (Class 2/3); the measurement-science open questions
  (rubric validity, run variance) live in `bbb-research-frontier`.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Advanced layer).
- Volatile facts: the parity campaign is a candidate design — when it is
  executed, its phases' Result fields and this skill's status line must be
  updated (Class 2 change); the `docs/campaigns/` convention is a house
  convention, not a tool requirement.
- Re-verify the active-campaign pointer discipline: `grep -n "campaign" STATE.md`
  in any project claiming to run one (expect a path and current phase).
