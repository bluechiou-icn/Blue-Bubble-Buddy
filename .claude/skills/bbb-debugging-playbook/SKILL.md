---
name: bbb-debugging-playbook
description: Disciplined, project-agnostic debugging method — reproduce first, rank competing mechanisms, run discriminating experiments one change at a time, and accept a fix only when one mechanism explains every observation including the negatives. Load this skill whenever a session is diagnosing any bug, error, crash, regression, flaky or intermittent failure, wrong output, failing test, or "it worked yesterday" report, in any codebase; before proposing any restart, delete, cache-clear, or config edit intended to make a failure go away; and when installing a symptom-to-triage table into a new project. Do not load it for feature work (use bbb-eval-loop) or for multi-week hard problems (use bbb-campaign-planning).
---

# Debugging Playbook

## Purpose

This skill is the method for finding out WHY something is broken, in any project. Load it the moment you are handed a bug, a failing test, a crash, a regression, or any "X does not work" report. It gives you a fixed loop (reproduce → triage → discriminate → explain → fix → verify → record) that replaces guess-and-retry, and a triage-table template each project should fill in with its own known failure modes. The core promise: a fix accepted under this playbook is explained, not lucky.

## When NOT to use this skill

- **Building or extending a feature** — that is goal-directed work, not diagnosis. Use `bbb-eval-loop`.
- **A hard problem expected to take days or weeks** (unclear mechanism, multiple candidate solutions, research needed) — a single debugging loop is too small a container. Use `bbb-campaign-planning`.
- **Testing a research hunch rather than fixing a defect** — use `bbb-research-methodology` for the full hypothesis discipline.
- **Writing up an investigation that is already finished** — go straight to `bbb-failure-archaeology`.

## The loop at a glance

1. **Read the actual error text.** All of it, before forming any theory.
2. **Reproduce the failure on demand.** No fix before a reliable reproduction (Rule 1 below).
3. **Check the project's triage table** for this symptom; if the project has none, start one (template below).
4. **Rank the candidate mechanisms** — a "mechanism" is the specific cause-and-effect chain that would produce this symptom, not a vague area of suspicion.
5. **Run one discriminating experiment per iteration**, with predictions written down first.
6. **Accept a mechanism only when it explains ALL observations**, including the cases that did NOT fail.
7. **Fix the mechanism, not the symptom.**
8. **Exit protocol:** verify per `bbb-verification-and-evidence`, then record per `bbb-failure-archaeology`.

## Rule 1: Reproduce first

Do not write a fix before you can trigger the failure on demand. A reliable reproduction is a concrete command or action sequence that produces the failure every time — or, for intermittent bugs, at a known approximate rate (e.g. "fails about 1 run in 10"). The reproduction is your only proof that a fix works: without it, "the bug went away" and "the bug did not happen this time" are indistinguishable.

If you decide to proceed WITHOUT a reproduction (sometimes forced: production-only failure, one-off data corruption, cost of reproduction too high), you must:

1. Label the decision explicitly in your report: **"NO-REPRO FIX — proceeding without a reproduction because <reason>."**
2. State what you will watch instead (a log line, a metric, a recurrence window) to detect whether the fix actually worked.
3. Treat the fix as unverified until that signal arrives — report it that way (see `bbb-verification-and-evidence`).

Why this is dangerous: a no-repro fix cannot be tested, so a wrong one ships silently, the symptom recurs later under a different title, and the next engineer starts from zero — now with a misleading "fix" in the history suggesting the cause was already found.

## The symptom → triage table

Every project should maintain a triage table mapping its known symptoms to ranked mechanisms and the experiment that tells them apart. It lives in the project's own docs (a natural home is next to the archaeology chronicle — see `bbb-failure-archaeology`). When you debug in a project that has one, check it first; when you finish an investigation the table did not cover, add a row.

Empty template — copy this into the project:

```markdown
| Symptom (quote it exactly) | Likely mechanisms, ranked | Discriminating experiment | Owner skill / doc |
|---|---|---|---|
| <the observable failure, verbatim> | 1. <most likely> 2. <next> 3. <...> | <one check whose outcome differs per mechanism> | <skill or doc that owns the fix procedure> |
```

Filled generic example rows (adapt the specifics to your project):

| Symptom (quote it exactly) | Likely mechanisms, ranked | Discriminating experiment | Owner skill / doc |
|---|---|---|---|
| "Tests pass locally but fail in CI" | 1. Environment difference (tool versions, env vars, OS) 2. Test-order dependence or shared state between tests 3. Stale CI cache | Run the failing test locally with CI's exact tool versions and in CI's test order; if it now fails locally, mechanism 1 or 2 — vary order alone to split them | Project's CI doc |
| "My change has no effect at runtime" | 1. Stale build artifact being executed 2. Editing the wrong file or a copied/vendored duplicate 3. The edited code path is never reached | Put a deliberate loud marker (print/log or even a syntax error) at the exact edit site and re-run; no visible change means mechanisms 1 or 2 — the code you edited is not what runs | Project's build doc |
| "Fails intermittently, roughly 1 run in N" | 1. Race condition / timing dependence 2. Unseeded randomness 3. Flaky external dependency (network, clock, third-party service) | Fix the random seed and force single-threaded/serialized execution; measure the failure rate over 20+ runs before and after — which intervention changes the rate identifies the mechanism | Project's test doc |

## Discriminating experiments

An experiment is discriminating only if its outcome DIFFERS depending on which hypothesis is true. "Try turning the cache off and see if it helps" is not an experiment — a pass tells you nothing about the other hypotheses, and a fix that "helps" may be masking the mechanism. The design procedure:

1. Write down the competing mechanisms (from your triage ranking).
2. Design one check where mechanism A predicts observation X and mechanism B predicts observation Y, with X ≠ Y.
3. **Write the predictions down BEFORE running.** If you cannot state what each mechanism predicts, the experiment cannot discriminate — redesign it.
4. Run it. Change exactly one thing. Compare the result to the predictions and eliminate the losers.

Worked micro-example: symptom is "config value ignored in production."

| Mechanism | Prediction for the experiment "log the loaded config at startup" |
|---|---|
| A: wrong config file is being loaded | Log shows a value from some OTHER file (identifiable by its distinctive neighbors) |
| B: file is loaded but the value is overridden later | Log shows the CORRECT value at startup; it changes downstream |
| C: value loaded correctly but consumer reads a different key | Log shows the correct value throughout; consumer's read site names a different key |

One log line, three distinct predicted outcomes — one run eliminates two mechanisms. For the full hypothesis discipline (predictions as numbers, adversarial refutation, idea lifecycle), load `bbb-research-methodology`.

## The acceptance bar: one mechanism, ALL observations

You have found the root cause only when a single mechanism explains every observation you have collected — including the negatives. "Why did it NOT fail in case B?" is as binding as "why did it fail in case A?" A mechanism that predicts failure everywhere, when you observed failure only somewhere, is wrong or incomplete.

Before writing the fix, run this checklist:

1. List every observation from the investigation: each failure, each non-failure, each timing, each environment difference.
2. For each one, write the sentence "the mechanism explains this because …". No hand-waving entries ("probably related").
3. If any observation is unexplained, the investigation is not done — either the mechanism is wrong or there are two bugs.
4. If your fix works but you cannot say why, STOP and say so explicitly. A fix that works for unexplained reasons is an incident waiting to recur: the real mechanism is still live and will resurface wearing a different symptom.

## Trap catalog

Each trap comes with the one-line story of how it burns time. Check yourself against this table whenever an investigation stalls.

| Trap | How it costs time |
|---|---|
| **Fixing the symptom, not the mechanism** | You add a null-check where the crash happens; three weeks later the same bad data crashes a different consumer, and now there are two investigations instead of one. |
| **Shotgun changes** (multiple edits per iteration) | You change five things, the bug disappears, and you now cannot say which change mattered — so you either ship four superstitious edits or spend a day un-picking them. One change per iteration preserves attribution. |
| **Trusting stale state** (old builds, cached artifacts, leftover processes) | You debug "impossible" behavior for an hour before discovering the process you are testing was started yesterday and never picked up your code. Run the stale-state sweep below FIRST when behavior contradicts the source you are reading. |
| **Pattern-matching to a known failure and skipping evidence** | The signal LOOKS like last month's outage, so you restart the service — but this time the cause is different, the restart destroys the evidence, and the bug returns at 2am. Before ANY state-changing command (restart, delete, cache-clear, config edit), check that the evidence supports THAT specific action, not merely that the symptom resembles a case where it once helped. |
| **Debugging the wrong layer** | You spend the afternoon in application code when the failure is in the proxy in front of it; nothing you change has any effect, which was itself the clue. When no experiment at your current layer changes the outcome, move a layer up or down. |
| **Not reading the actual error text** | The stack trace's third line named the missing file the whole time; you reconstructed it from theory in 40 minutes instead of 40 seconds. Read the WHOLE error — message, trace, and the first error in the log, not the last. |

### Stale-state sweep (run when behavior contradicts the code you are reading)

All commands verified on Linux, 2026-07-07; substitute your project's artifact and process names.

```bash
git status --short          # uncommitted or unexpected local edits
git log --oneline -5        # what actually changed recently
git diff --stat HEAD        # working-tree drift from last commit
ps aux | grep -v grep | grep -i <process-name>   # leftover processes still serving old code
ls -l <built-artifact> <source-file>             # artifact older than source = stale build
```

Then rebuild/restart from clean state and re-run the reproduction before trusting any further observation.

## Exit protocol

A debugging task is not finished when the code compiles or the symptom disappears once.

1. **Re-run the reproduction.** It must have failed before the fix and pass after — the fix must flip it. For intermittent bugs, run enough iterations to beat the known failure rate.
2. **Verify to the change-type's bar** — tests, logs, or rendered output as evidence, per `bbb-verification-and-evidence`. Report anything unverified as unverified.
3. **Record the investigation** — symptom, root cause, evidence, status — in the project's archaeology chronicle, per `bbb-failure-archaeology`, so the battle is never refought.
4. **Update the triage table** if this symptom or mechanism was not already in it.
5. If this is the second time the same class of mistake caused a bug, distill it into a durable rule — see `bbb-rule-distillation`.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Primitives pillar). The method is project-agnostic and intentionally contains no project-specific failure modes — those belong in each target project's own filled-in triage table.
- Volatile facts: (a) sibling skill names (`bbb-eval-loop`, `bbb-campaign-planning`, `bbb-research-methodology`, `bbb-verification-and-evidence`, `bbb-failure-archaeology`, `bbb-rule-distillation`) — re-verify with `ls .claude/skills/` from the library root; (b) the stale-state sweep commands were verified on Linux with GNU coreutils/git on 2026-07-07 — re-verify by running each line in your target environment (on macOS/BSD the `ps` and `ls` flags shown still work, but this is unverified — requires a macOS/BSD host).
- The example triage rows are generic illustrations, not claims about any specific project; replace them when instantiating the table.
