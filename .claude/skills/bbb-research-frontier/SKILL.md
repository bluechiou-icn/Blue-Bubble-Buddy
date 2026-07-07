---
name: bbb-research-frontier
description: The open problems where the Blue-Bubble-Buddy library could advance the state of the art in agent-workflow engineering — each with why current practice fails, this project's specific asset, the first three concrete steps in this repo, and a falsifiable "you have a result when…" milestone. Load this skill when choosing a research direction for the library; when the user asks "what's next", "what should we explore", "where can this be novel", or "what are the open problems"; when writing a roadmap, grant-style pitch, or positioning statement for the project; or when checking whether a novelty claim is allowed yet. Everything in this file is labeled open or candidate — it contains no settled results. Not for day-to-day work (the other skills), executing a decided campaign (bbb-campaign-planning), or experiment mechanics (bbb-research-methodology).
---

# Research Frontier

## Purpose

This is the library's map of problems worth attacking — chosen because current
practice measurably fails there and this project holds a specific asset. Every
entry is OPEN or CANDIDATE. Nothing here is a result, and none of it may be
cited as one (`bbb-change-control`, non-negotiable 3).

## When NOT to use this skill

- Doing today's work: every other skill in the library.
- Running an already-decided multi-session effort: `bbb-campaign-planning`.
- The experiment mechanics for attacking any entry: `bbb-research-methodology`.

## Frontier problems (status as of 2026-07-07)

### F1 — Automated skill-eval harness  [OPEN]
- **Why current practice fails:** skill quality is judged by humans reading
  transcripts. There is no regression signal — an edit that degrades model
  behavior ships silently, because nothing measures behavior before and after.
- **This project's asset:** a rubric-friendly behavior contract (`f5-mode`) —
  binary-checkable discipline rules — plus written methodology
  (`bbb-research-methodology`) for scoring transcripts against it.
- **First three steps in this repo:** (1) commit 3 benchmark task definitions
  under `eval/tasks/`; (2) commit the binary rubric as `eval/rubric.md`,
  derived from the f5-mode contract; (3) write `eval/score.md` — the manual
  scoring protocol — and score one real transcript to shake out ambiguous
  rubric items.
- **You have a result when:** a deliberately degraded copy of a skill (e.g.
  f5-mode with the evidence rules deleted) scores lower than the intact skill
  by a pre-registered margin, while the intact skill's score is stable across
  3 runs. If a known-bad skill does NOT score lower, the harness is refuted.

### F2 — Cross-model behavior parity measurement  [CANDIDATE — campaign designed]
- **Why current practice fails:** "smaller model + skills ≈ bigger model's
  discipline" is folklore; nobody quantifies the gap or tracks it across
  model generations.
- **Asset:** the candidate campaign in `bbb-campaign-planning` (phases and
  gates already designed); this entry owns the open measurement-science
  questions it will hit: rubric validity (do the binary checks measure
  discipline or formatting?), run-to-run variance (how many runs make a delta
  trustworthy?), and task representativeness.
- **First three steps:** (1) execute that campaign's Phase 1 baseline;
  (2) publish per-dimension variance across 3 identical runs; (3) have an
  adversarial reviewer attack the rubric's validity before any treatment run.
- **You have a result when:** the parity score separates model tiers on the
  same tasks with non-overlapping ranges across runs — i.e., the metric
  detects a difference everyone agrees exists. If it can't, it measures noise.

### F3 — Automated rule distillation  [OPEN]
- **Why current practice fails:** humans notice repeated corrections
  unreliably; the correction→rule pipeline (`bbb-rule-distillation`) runs
  only when someone remembers to run it.
- **Asset:** a written rule format, placement table, and promotion thresholds
  — i.e., a target schema an automated miner could emit into.
- **First three steps:** (1) hand-tag corrections in ~10 real session
  transcripts to build a tiny labeled set; (2) write a prompt that extracts
  correction candidates from a transcript and measure it against the tags;
  (3) define the human-approval gate — an auto-proposed rule is a DRAFT until
  a person accepts it (no auto-merge into CLAUDE.md, ever).
- **You have a result when:** the miner recovers ≥ a pre-registered fraction
  of hand-tagged corrections with a false-proposal rate a human reviewer
  rates tolerable on transcripts it never saw.

### F4 — Skill-trigger precision and recall  [OPEN]
- **Why current practice fails:** nobody measures when skills load that
  shouldn't or fail to load when they should; description writing is craft
  without feedback (`bbb-skill-authoring`'s worked experiment is the seed).
- **Asset:** 16 real skills with deliberately trigger-rich descriptions — a
  ready-made test corpus.
- **First three steps:** (1) for each of 5 skills, author 5 should-load and 5
  should-not-load task prompts; (2) run and record which skills actually load;
  (3) publish the confusion table and rewrite the worst description (Class 2).
- **You have a result when:** description edits move precision/recall in the
  predicted direction on held-out prompts — description quality becomes
  steerable, not folklore.

### F5 — Self-updating library loop  [CANDIDATE — safety question first]
- **Why current practice fails:** review findings and drift die in reports;
  fixing them depends on a human relaying them into edits.
- **Asset:** machine-checkable change classes and gates (`bbb-change-control`)
  and per-skill re-verification one-liners — the raw material of automation.
- **First three steps:** (1) script a drift checker that runs every skill's
  provenance re-verification command and reports failures; (2) let a session
  auto-DRAFT Class 2 fixes from those failures; (3) write the never-auto-merge
  list (doctrine, non-negotiables, anything Class 3+) BEFORE wiring any
  automation.
- **You have a result when:** an injected drift (e.g., renaming a command a
  skill cites) is detected and a correct fix drafted with zero prompting —
  and the never-auto-merge list provably blocks a doctrine edit in the same
  pipeline.

## Positioning (what may be claimed, as of 2026-07-07)

Established practice elsewhere — claim no novelty: runbooks, post-mortems
(failure archaeology's ancestor), eval rubrics, multi-agent review.
Genuinely uncommon here — claimable only as APPROACH until the corresponding
milestone is hit: a portable cross-model behavior-parity contract (F2) and
self-improvement discipline shipped as loadable skills with measured effect
(F1/F5). Until then, describe this library as "a disciplined skill library
with a measurement roadmap" — nothing stronger survives review.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Advanced
  layer). Statuses are the volatile fact: any executed first step or hit/missed
  milestone must update the entry's status line (Class 2, route through
  `bbb-change-control`).
- Re-verify statuses against reality: `ls eval/ docs/campaigns/ 2>/dev/null`
  at the repo root — artifacts appearing there mean an entry has moved and
  this file is stale.
- Re-verify cross-references: `ls .claude/skills/` lists every sibling named
  here.
