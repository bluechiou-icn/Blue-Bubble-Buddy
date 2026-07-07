---
name: bbb-research-methodology
description: The discipline that turns a hunch into an accepted result — hypotheses that predict numbers before running, discriminating experiments, adversarial refutation, and an idea lifecycle that ends in adoption or documented retirement. Load this skill when someone proposes a change on a hunch ("I think X would improve Y"); when evaluating whether a claimed improvement is real; when designing an experiment, benchmark, rubric, or A/B comparison for agent behavior or workflows; when the user says "prove it", "how do we know", "run an experiment", or "is this actually better"; or when an idea keeps being re-proposed and needs a definitive verdict. Contains the evidence bar, the lifecycle state table, and analysis recipes (baseline-vs-treatment transcript scoring, binary rubric design, negative-case analysis). Not for ordinary bug diagnosis (bbb-debugging-playbook) or executing an already-decided plan (bbb-eval-loop, bbb-campaign-planning).
---

# Research Methodology

## Purpose

A hunch becomes an accepted result only by surviving a process designed to
kill it. This skill defines that process for agent-workflow engineering —
the library's domain — so improvements are adopted on evidence and bad ideas
die documented deaths instead of returning every few months.

## When NOT to use this skill

- Diagnosing a concrete bug: `bbb-debugging-playbook` (it applies a lighter
  version of the same hypothesis discipline).
- Executing a plan whose goal is already decided: `bbb-eval-loop` for one
  session, `bbb-campaign-planning` for many.
- Cataloguing which open problems are worth attacking: `bbb-research-frontier`.

## The evidence bar

A claim is accepted only when BOTH hold:

1. **One mechanism explains ALL observations — including the negatives.**
   If your explanation covers why A improved but not why B didn't change,
   you do not have a result; you have a coincidence with a story.
2. **It survives assigned adversarial refutation.** Someone — a human or a
   subagent with an explicit prompt (`bbb-subagent-orchestration`) — is given
   the job of breaking the claim: alternative explanations, confounds,
   cherry-picked cases, run-to-run variance. A claim nobody tried to kill is
   untested, not supported.

## Hypothesis-predicts-numbers-before-running

Before any experiment, write down — in the experiment note, not your head:

```markdown
Hypothesis: <mechanism, one sentence>
If TRUE, expect:  <numbers/observables>
If FALSE, expect: <different numbers/observables>
Confounds guarded: <what else could produce the TRUE pattern, and how excluded>
```

An experiment whose outcome you cannot predict differently under different
hypotheses discriminates nothing — redesign it before spending the run. After
running, compare observed vs predicted; surprises in EITHER direction go into
the note verbatim.

## The idea lifecycle

| State | Meaning | Exit condition |
|---|---|---|
| Hunch | Unwritten intuition | Written as a hypothesis with predictions, or dropped |
| Hypothesis | Predictions on record | Experiment designed and run |
| Experiment | Running in a sandbox/branch/flag — never the main line | Results compared to predictions |
| Under review | One-mechanism check + adversarial refutation assigned | Survives → adoption path; fails → retirement |
| ADOPTED | Routed through change control (`bbb-change-control` here; the target project's process elsewhere) | — |
| RETIRED | Documented in the chronicle (`bbb-failure-archaeology`) WITH the evidence against it | May be reopened only by new evidence |

The retirement rule is load-bearing: an idea retired without documentation
will be re-proposed by someone who wasn't there — usually within months.

## Analysis recipes

**1. Baseline-vs-treatment transcript comparison.** The workhorse for "does
this skill/prompt/rule actually change behavior?": fix a small set of
benchmark tasks; run each with and without the intervention, same model and
settings, ≥3 runs per arm (single runs measure noise); score every transcript
against a pre-registered rubric; compare arms per dimension, not just in
aggregate.

**2. Binary rubric design.** Rubric items must be checkable yes/no per
transcript, not 1–10 vibes. Example, derived from the `f5-mode` contract:

| # | Check (yes/no) |
|---|---|
| 1 | First sentence of the final reply states what happened/was found |
| 2 | Every completion claim maps to a tool result in the transcript |
| 3 | Unverified items are explicitly labeled unverified |
| 4 | Zero changes outside the task's stated scope |
| 5 | Turn ends only at done-or-blocked (no "I will now…" endings) |

**3. Negative-case analysis.** Collect cases where the intervention should
NOT fire (for a skill: tasks its description should not match) and verify it
doesn't. An intervention that fires everywhere is a cost everywhere — measure
both precision and recall, not recall alone.

## Worked example (designed 2026-07-07, not yet run — no result is claimed)

- **Hypothesis:** trigger-rich skill descriptions (concrete situations and
  user phrasings) increase correct skill-loading over vague summaries, because
  the loading decision sees only name+description (`bbb-skill-authoring`).
- **If TRUE, expect:** on 10 should-load and 10 should-not-load tasks, the
  trigger-rich variant of the same skill loads in ≥8/10 should-load cases with
  ≤1/10 false fires; the vague variant loads in noticeably fewer should-load
  cases across 3 runs.
- **If FALSE, expect:** both variants load at similar rates — implying loading
  is driven by something other than description wording.
- **Confounds guarded:** identical skill BODY in both arms (only the
  description differs); tasks authored before either description was written.
- **Adoption vs retirement:** TRUE → the good/bad description examples in
  `bbb-skill-authoring` stay normative (Class 2 note added citing the result);
  FALSE → that section is rewritten and the result recorded in the chronicle.

## Where good ideas come from

In observed order of yield: repeated user corrections (`bbb-rule-distillation`),
patterns across chronicle entries (`bbb-failure-archaeology`), findings that
recur across reviews (`bbb-change-control`), and the frontier list
(`bbb-research-frontier`). Track provenance — knowing which sources pay is
itself a finding.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Advanced
  layer). The method sections are doctrine; the worked example is a design,
  not a result, and must be updated (Class 2) if the experiment is ever run.
- Volatile facts: none executable; the example rubric mirrors the `f5-mode`
  contract — if that contract changes, regenerate the rubric.
- Re-verify cross-references: `ls .claude/skills/` at the library root should
  list every sibling named here.
