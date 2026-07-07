---
name: bbb-eval-loop
description: Runs the Goal → Action → Check → Repeat loop, the library's central orchestration pattern for multi-step work. Load this skill whenever a task needs more than one edit-and-verify cycle — making a test suite pass, applying a bug fix, migrating a config, tuning output toward a measurable target — or whenever a session shows loop pathologies, repeating the same failed fix, polishing endlessly, or unsure whether to keep iterating, branch, or stop. Covers decomposing a goal into explicit success criteria and smallest verifiable actions, the iron rule of defining the check BEFORE performing the action, gate decisions after each check (proceed / retry with a change / branch / escalate), convergence and stop-polishing rules, hard iteration caps, and the triggers that force escalation to a human. For diagnosing WHY something is broken, load bbb-debugging-playbook first — this loop then drives the fix once the mechanism is known.
---

# bbb-eval-loop — the Goal → Action → Check → Repeat loop

## Purpose / when to use

This skill is the standard operating procedure for any task that takes more than one
step to complete and whose outcome can be observed. It turns a fuzzy goal ("make the
tests pass", "fix the rendering bug") into a sequence of small actions, each verified
by a check that was defined *before* the action was taken, with an explicit decision
gate after every check. Use it as the outer loop for debugging, feature work, config
changes, refactors, and data fixes. It is the Orchestration pillar's core pattern;
most other skills in this library plug into one of its four phases.

## When NOT to use this skill

- **One-shot trivial edits where the check IS the action.** Fixing a typo in a
  string, renaming a variable the editor confirms, adding a line to a list — if
  performing the action and observing its success are the same event, running a
  formal loop is overhead. Do the edit, confirm it, report it.
- **Long, decision-gated, multi-phase efforts** (days of work, ranked solution
  menus, known wrong paths to fence off). The loop is one engine inside such an
  effort, but the effort itself needs the campaign format — load
  `bbb-campaign-planning`.
- **Deciding what counts as a valid check.** This skill assumes you can name a
  trustworthy check; the evidence hierarchy and per-change-type verification
  recipes are owned by `bbb-verification-and-evidence`.
- **Checking visual output** (UI, charts, rendered documents). The loop applies,
  but the CHECK phase must render and screenshot, never read code and assume —
  load `bbb-visual-self-check` for the how.
- **Diagnosing WHY something is broken.** Reproduce-first triage, ranked
  mechanisms, and discriminating experiments are owned by
  `bbb-debugging-playbook`; run its method first, then use this loop to drive
  the fix once the mechanism is known.
- **Research questions** where you are testing a hypothesis rather than driving
  toward a known target. Use the hypothesis-predicts-numbers-before-running
  discipline in `bbb-research-methodology`.

## The loop at a glance

Repeat the four phases until a stop condition (see below) fires:

| Phase | You produce | Rule |
|---|---|---|
| 1. GOAL | Success criteria + a decomposed list of smallest verifiable actions | Criteria must be observable, not aspirational |
| 2. CHECK (defined) | The exact command/observation that will prove the next action worked, with the expected value | Written down BEFORE the action — the iron rule |
| 3. ACTION | One smallest verifiable change | One change per iteration; never batch unrelated changes |
| 4. CHECK (run) → GATE | The check's actual output, compared to the expected value, then a gate decision | Proceed / retry with a change / branch / escalate — never silently continue |

Note the ordering: the check is *defined* in phase 2 but *run* in phase 4. The
action sits between the check's definition and its execution. That ordering is the
whole point.

## Phase 1 — Decompose the goal

Write these down (in your working notes, or in STATE.md for long tasks — see
`bbb-state-and-memory`) before touching anything:

1. **Success criteria.** One to five statements, each observable by a command or a
   concrete observation. Bad: "the code is clean." Good: "`node --test` reports
   `# fail 0`" or "the /login page renders the form with no console errors."
2. **Baseline.** Run the success-criteria checks NOW, before any change, and record
   the output. You cannot claim progress later without knowing where you started,
   and a baseline sometimes reveals the goal is already met or the problem is
   elsewhere.
3. **Smallest verifiable actions.** Break the goal into steps where each step's
   effect can be observed independently. The test for "small enough": if the check
   fails, is the cause unambiguous? If a step could fail for three different
   reasons, split it.
4. **Iteration budget.** Set a hard cap before starting (default: 5 iterations per
   success criterion; 3 for anything you expected to be easy). Write the number
   down — a cap chosen after you are frustrated is not a cap.

## Phase 2 — The iron rule: define the CHECK before the ACTION

Before performing any action, answer in writing:

- **What command or observation will prove this step worked?**
- **What exact output do I expect?** Name the value where possible ("`# pass 3`,
  `# fail 0`", "HTTP 200 with a JSON body containing `\"status\": \"ok\"`",
  "screenshot shows the button right-aligned"). "It should look better" is not a
  check.
- **What output would prove it did NOT work?** If you cannot name a failing
  observation, the check cannot fail, and a check that cannot fail is not a check.

Why this ordering is non-negotiable: a check invented *after* the action is
selected — consciously or not — to confirm what you just did. Pre-committing to the
check and its expected value is what makes the loop an evaluation instead of a
self-congratulation. This is the same discipline `bbb-research-methodology` applies
to experiments (predict the numbers before running); the loop is its everyday form.

What qualifies as a valid check (test output beats logs beats reasoning beats
vibes) is owned by `bbb-verification-and-evidence` — consult it when the obvious
check feels weak.

## Phase 3 — Act

Perform exactly one smallest verifiable action. Constraints:

- **One change per iteration.** If you change two things and the check improves,
  you do not know which change did it — and worse, one may have hurt. Shotgun
  changes are a named trap in `bbb-debugging-playbook`.
- **Stay in scope.** No drive-by refactors, no speculative hardening. The loop's
  power comes from attributability; unrelated edits destroy it.

## Phase 4 — Run the check, then gate

Run the exact check defined in Phase 2. Compare actual output to expected output.
Then make ONE of these four gate decisions — explicitly, never by drifting on:

| Gate | Take it when | Then |
|---|---|---|
| **PROCEED** | Actual output matches expected output | Record the evidence (command + output). Move to the next action, or to stop-condition evaluation if this was the last one. |
| **RETRY with a change** | Check failed, and the failure output tells you something new | Form a new hypothesis FROM the failure output, define a new expected value if needed, act again. Retrying the identical action with no change in hypothesis is forbidden — same input, same output. |
| **BRANCH** | Check failed in a way that invalidates an assumption behind the plan (wrong file, wrong layer, goal decomposition was wrong) | Go back to Phase 1 for the affected part: re-decompose. Record why the old branch was abandoned so it is not silently retried later. |
| **ESCALATE** | Any escalation trigger below fires | Stop the loop. Report state to the human (see below). |

A partially-passing check (e.g., 2 of 3 tests now pass) is a RETRY, not a PROCEED:
the criterion was `fail 0`, not "fewer failures." Record the partial progress as
evidence, but do not soften the gate.

## Stop conditions — when the loop is done

Evaluate these at every gate. The loop ends when any one fires:

1. **Convergence.** All success criteria from Phase 1 pass their checks, with
   recorded evidence for each. This is the only stop that lets you report the goal
   as complete — and you report it with the evidence, per
   `bbb-verification-and-evidence`.
2. **The stop-polishing rule.** If the last iteration changed nothing about what
   the user or reader would do next — the tests already passed and you were
   "improving" style, the answer was already correct and you were rewording it —
   the loop converged one iteration ago. Stop. Additional loops after convergence
   only add risk (new bugs, scope creep) and cost. The test is always: *does
   another iteration change the reader's or user's next action?* No → stop.
3. **Hard iteration cap reached.** You hit the budget set in Phase 1 without
   convergence. Do not silently grant yourself more iterations — that is how
   sessions burn hours on a wall. Escalate with the loop log (below).
4. **An escalation trigger fires** (next section).

## Escalation triggers — when the loop must halt and surface to the human

Escalate immediately, mid-loop, regardless of budget remaining, when:

- **The next action is destructive or irreversible.** Deleting data, force-pushing,
  dropping a table, overwriting the only copy, changing production settings. The
  loop never authorizes destruction; only the human does.
- **Requirements ambiguity.** Two readings of the goal now demand different
  actions, and the repo/context cannot resolve which. Ask one pointed question with
  your recommended reading — do not pick silently and do not present an options
  essay.
- **Repeated identical failure.** The same check has failed with the *same* output
  twice despite a changed action between the failures. Your mental model is wrong
  in a way iteration is not fixing; a third identical attempt is superstition.
- **The fix works but you cannot explain why.** An unexplained pass is a latent
  regression. Either invest one iteration in explanation (see the
  "one mechanism must explain ALL observations" bar in `bbb-debugging-playbook`)
  or escalate it as unverified-in-mechanism.

**What an escalation must contain:** the goal and success criteria, the baseline,
a per-iteration log (action taken → check run → actual vs expected output → gate
decision), what you now believe and why, and ONE recommended next step. An
escalation without the loop log forces the human to re-run your loop.

## Worked mini-example (verified in this environment, 2026-07-07)

Goal: make a small Node project's test suite pass. Success criterion: `node --test`
reports `# fail 0`. Iteration cap: 3. The project has a `slugify(title)` function
and three unit tests. (Every command and output below was actually run.)

**Baseline.** Check defined: `node --test`, expect current failure count.
Ran it — output tail:

```
# tests 3
# pass 1
# fail 2
```

Two failures: "collapses repeated separators" and "trims leading/trailing
separators". Baseline recorded.

**Iteration 1.**
- CHECK defined first: `node --test 2>&1 | grep -E '^# (tests|pass|fail)'` —
  expected `# pass 3` / `# fail 0`.
- ACTION: one change — the replace regex `/[^a-z0-9]/g` becomes `/[^a-z0-9]+/g` so
  runs of separators collapse into one hyphen.
- CHECK run — actual output:

```
# tests 3
# pass 2
# fail 1
```

- GATE: expected `fail 0`, got `fail 1` → **RETRY with a change**. The failure
  output names the surviving failure (the trim test), which is new information:
  collapsing was fixed, trimming is a separate defect. Not a PROCEED despite the
  improvement — the criterion is `fail 0`.

**Iteration 2.**
- CHECK defined: same command, expected `# pass 3` / `# fail 0`.
- ACTION: one change — append `.replace(/^-+|-+$/g, "")` to strip leading and
  trailing hyphens.
- CHECK run — actual output:

```
# tests 3
# pass 3
# fail 0
```

- GATE: actual matches expected → **PROCEED**. All success criteria pass with
  recorded evidence → **convergence**. Stop-polishing rule applies: the regex could
  be made "more elegant," but no further iteration changes what anyone does next,
  so the loop ends here. Report: goal complete, evidence above, 2 of 3 budgeted
  iterations used.

Had iteration 2 produced `# fail 1` again with the identical assertion output,
that would be the second identical failure after a changed action — an escalation
trigger, with the log above as the escalation body.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy library (Orchestration pillar).
- The loop mechanics, gate table, and stop conditions are doctrine-level and not
  expected to drift. Volatile facts are limited to the worked example's tooling:
  it assumes Node's built-in test runner (`node --test`, available since Node 18;
  verified on Node v22.22.2, 2026-07-07) and its TAP-style `# pass` / `# fail`
  summary lines.
- Re-verify the example's command shape: `node --help | grep -m1 -- '--test'`
  (prints the flag's help line if it exists), and in any repo with a `test/`
  directory of `*.test.js` files,
  `node --test 2>&1 | grep -E '^# (tests|pass|fail)'` (confirms the summary-line
  format this skill greps for).
- Default iteration caps (5 per criterion, 3 for expected-easy work) are house
  convention, not measured optima — treat them as candidates; changing them is a
  factual update routed through `bbb-change-control`.
