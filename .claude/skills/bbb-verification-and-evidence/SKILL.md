---
name: bbb-verification-and-evidence
description: Defines what counts as evidence and how to verify and report work. Load this skill whenever a session is about to claim "done", "fixed", "it works", or "tested"; before writing any progress or completion report; when deciding how to verify a code, config, docs, or data change or a deletion; when setting acceptance criteria for a task; or when a user asks "how do you know that worked?". Contains the evidence hierarchy (runtime observation down to "it should work"), acceptance-threshold discipline (agree the pass condition before running), per-change-type verification recipes, reporting rules for verified vs unverified work, and the evidence statement template for ending a task.
---

# Verification and Evidence

## Purpose / when to use

This skill defines the evidence bar for all work: what counts as proof that something works, how to verify each type of change, and how to report results honestly. Load it before claiming any task is done, before writing a progress report, and when choosing how to verify a change you just made. The one-sentence rule it exists to enforce: a claim of completed work is only as strong as the tool output behind it, and a fabricated or unbacked "done" is the worst failure a session can produce.

## When NOT to use this skill

- You need the working loop that repeatedly applies this evidence bar (goal → action → check → repeat, gate criteria, stop conditions): load `bbb-eval-loop`. This skill defines what a valid check IS; that skill defines when and how often to run one.
- You are verifying visual output (UI, charts, rendered documents): load `bbb-visual-self-check`, which ships a working screenshot script. Reading the code that produces a visual is never verification of the visual.
- You are making a research-grade claim (a hypothesis about why something behaves a certain way, a performance comparison you want others to trust): load `bbb-research-methodology`, which adds predictions-before-running and adversarial refutation on top of this skill's bar.
- You are debugging and need the "one mechanism must explain ALL observations" standard: load `bbb-debugging-playbook`.
- You want the overall session behavior contract that this evidence bar plugs into (conclusion-first replies, turn-ending discipline): load `f5-mode`.

## The evidence hierarchy

Evidence comes in five strength levels. Always report which level backs each claim, and always seek the highest level the change allows. "Sufficient" below means: sufficient to state the claim without hedging in a report.

| Level | Evidence type | What it looks like | Sufficient when | NOT sufficient when |
|---|---|---|---|---|
| 1 (strongest) | Observed runtime behavior / test output, with the actual command shown | You ran the command in this session, and the report quotes both the command and its output (or exit code). Example: `pytest tests/test_auth.py` output pasted with `2 passed`. | Almost always. This is the default bar for "done". | The test does not actually exercise the changed path (a passing but irrelevant test is level 5 wearing a costume), or the output is from a previous session or another machine. |
| 2 | Reproducible measurement | A number produced by a command anyone can re-run: row counts, checksums, timings, byte sizes, HTTP status codes. | Verifying data changes, performance claims, and file integrity, where behavior is a quantity rather than a pass/fail run. | The measurement proxy does not capture what matters (file size unchanged does not mean content unchanged — use a checksum), or it was run once for a claim about variance or trends. |
| 3 | Logs | Output the system emitted while running, read after the fact: server logs, CI logs, build output. | Confirming that an event occurred (a request arrived, a job ran, a config was loaded) when you cannot re-drive the flow directly. | Proving correct behavior, not just occurrence. Logs show what was recorded, not what happened; absence of an error line is not presence of success. Prefer re-running the flow (level 1) whenever possible. |
| 4 | Static reasoning about code | "I read the function; the new branch handles the null case." No execution. | Low-stakes claims where execution is impossible in this environment (e.g., code that requires production credentials) — and only when explicitly labeled as reasoning, not as verification. | Any claim of "works", "fixed", or "done". Reading code tells you what you believe it does; only running it tells you what it does. Typechecks and compiles are barely above this level: they prove form, not behavior. |
| 5 (weakest) | "It should work" | A prediction with no artifact behind it. | Never sufficient for a claim. Only acceptable phrased as an explicit expectation: "I expect X; unverified." | Everywhere else. If you catch yourself writing "should", either go get level 1–2 evidence or label the item unverified. |

Two rules that follow from the hierarchy:

1. State the level. A report line like "auth flow fixed (verified: ran `npm test -- auth`, 12 passed)" is level 1. "Auth flow fixed (the diff looks correct)" is level 4 and must be labeled unverified.
2. Do not launder evidence upward. Summarizing a level-4 belief in confident language does not make it level 1. The words "verified" and "confirmed" are reserved for levels 1–2 with the command shown.

## Acceptance-threshold discipline

Agree on the pass condition BEFORE running anything, and measure success against that pre-agreed threshold — never judge success by eye after the fact. A threshold decided after seeing the output is not a threshold; it is a rationalization.

1. Before running, write down the threshold in checkable form. Valid forms:
   - A number with a comparison: "p95 latency ≤ 250 ms", "all 3 rows migrated, 0 rows dropped".
   - An exit code: "`pytest tests/` exits 0".
   - An exact output or diff condition: "`diff expected.txt actual.txt` produces no output (exit 0)".
   - A pre-stated visual criterion (for visual work, define it here but check it via `bbb-visual-self-check`): "the chart renders with all 4 series visible and a legend".
2. Source the threshold, in priority order: the user's explicit statement > the task specification > the prior baseline (the behavior before your change) > your own proposal, stated to the user or the task record BEFORE the run.
3. Run, then compare the output against the written threshold verbatim. The result is pass or fail; there is no "close enough".
4. If the result fails the threshold, report the failure with output (see Reporting discipline). Do not move the threshold to fit the result. If you believe the threshold itself was wrong, say so explicitly, propose a new one with a reason, and get it agreed before re-running — that is a renegotiation, not a pass.
5. Where this sits in a working loop — defining the check before each action and deciding when the loop has converged — is owned by `bbb-eval-loop`.

## Verification recipes by change type

Minimum verification per change type. "Minimum" means: below this, the item is unverified and must be labeled so. All example commands below were run and confirmed working on this library's environment (Linux, GNU coreutils, as of 2026-07-07).

| Change type | Minimum verification | Recipe |
|---|---|---|
| Code change | Run the affected flow end-to-end and observe the changed behavior. A passing typecheck or compile is NOT verification — it proves the code is well-formed, not that it does the right thing. | 1. Identify the user-visible flow the change affects. 2. Run it with real inputs (the actual CLI command, the actual test that exercises the changed lines, the actual request). 3. Quote command + output in the report. If nothing can exercise the change, that is a design smell — say so and label the change unverified. |
| Config change | Observe the changed behavior, not just that the config parses or the service restarts. | 1. Capture the behavior BEFORE the change (the baseline). 2. Apply the config, reload/restart whatever reads it. 3. Exercise the behavior the config controls and show it differs from the baseline in the intended way. A config accepted silently but never exercised is unverified. |
| Docs change | Render the doc and proofread it against ground truth: every command in the doc gets run, every path and flag gets checked against the repo. | 1. Run each published command exactly as written and confirm the documented output/behavior. 2. Check each file path exists (`ls <path>`). 3. If the doc renders (Markdown, HTML), view the rendered form — for rendered-output checking, use `bbb-visual-self-check`. A doc whose commands were not run is unverified (Doctrine: wrong runbooks are worse than none). |
| Data change | Row counts, checksums, and spot samples — before and after. | 1. Row count: `wc -l file.csv` before and after; state expected delta beforehand (threshold discipline). 2. Integrity/identity: `sha256sum file.csv` — equal checksums prove identical content; sizes do not. 3. Spot sample: `shuf -n 5 file.csv` and eyeball the sampled rows against the intended transformation. 4. For structured comparisons: `diff before.csv after.csv` (exit 0 = identical). |
| Deletion | Prove nothing still references the deleted thing, then prove the system still works without it. | 1. Search for references by every name the thing had: `grep -rn "<name>" --exclude-dir=.git .` — the required result is no matches (grep exits 1). Repeat for aliases, import paths, and config keys. 2. Run the affected flow end-to-end (as for a code change). 3. Check git history for consumers you forgot: `git log --oneline -- <deleted-path>` shows who touched it and hints at who used it. |

## Reporting discipline

Fabricated progress is the worst failure class — worse than reporting a failure, worse than reporting nothing. A failure report costs one fix; a false "done" costs the discovery, the re-investigation, and the reader's trust in every other claim in the report. Before sending any progress or completion report, run this checklist:

1. Map every claim to a tool result from THIS session. For each "done/fixed/verified" line, you must be able to point at the specific command and output in this session's transcript that backs it. No tool result → the line gets an "unverified" label or gets cut.
2. Label unverified items explicitly. Use the word "unverified" plus the reason: "unverified — requires production credentials", "unverified — no test exercises this path". Do not bury unverified work in confident prose.
3. Report failed tests WITH their output. A failure report must include the command, the failing output (or the relevant excerpt), and the exit code. "Some tests failed" without output is not a report; it forces the reader to re-run everything.
4. Declare skipped steps. If the plan had a step you did not do, say "skipped: <step> because <reason>". Silence about a skipped step is a form of fabrication.
5. State verified completions without hedging. If level 1–2 evidence exists, say "done" plainly. Hedging on verified work ("this should now be fixed") is as misleading as confidence on unverified work — it hides the fact that you actually checked.
6. Never claim future work as done. "I will run the tests" and "the tests pass" are different reports; if the turn ends before the run, the item is unverified.

## The evidence statement

End every task with an evidence statement: a short block that lets a zero-context reader audit the work without re-reading the session. Template:

```
EVIDENCE STATEMENT
Done:
- <item 1> — verified by: <command run> → <key output / exit code>
- <item 2> — verified by: <command run> → <key output / exit code>
Unverified:
- <item> — why it could not be verified here, and the command a
  future session should run to verify it
Skipped:
- <planned step> — reason
Failed / open:
- <item> — command, failing output excerpt, current best understanding
```

Rules for filling it in: every "Done" line carries its own command and result (evidence level 1–2); "Unverified" is present even when empty ("Unverified: none") so its absence can never be ambiguous; anything in "Failed / open" links to the fuller failure output earlier in the report. If the task is part of a longer campaign, the evidence statement is also what gets copied into the session handoff — see `bbb-state-and-memory` for where it lives.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Orchestration pillar). The evidence hierarchy, threshold discipline, and reporting rules are portable doctrine and should be stable; the example commands are the volatile part.
- Volatile facts: the recipe commands assume GNU coreutils on Linux (`sha256sum`, `shuf`, `wc`, `grep -r --exclude-dir`, `diff`), verified in this repo's environment as of 2026-07-07. On macOS, `sha256sum` may be `shasum -a 256` and `shuf` may be `gshuf` (unverified — no macOS host in this environment).
- Re-verify tool availability: `command -v sha256sum shuf wc grep diff` (all five paths should print).
- Re-verify the deletion recipe's no-match behavior: `grep -rn "string_that_does_not_exist" --exclude-dir=.git . ; echo "exit: $?"` (expect `exit: 1`).
- Re-verify sibling cross-references still exist: `ls /path/to/repo/.claude/skills/` should list `bbb-eval-loop`, `bbb-visual-self-check`, `bbb-research-methodology`, `bbb-debugging-playbook`, `bbb-state-and-memory`, and `f5-mode`.
