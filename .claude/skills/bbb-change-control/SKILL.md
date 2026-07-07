---
name: bbb-change-control
description: How changes TO the Blue-Bubble-Buddy library are classified, gated, and reviewed, and the library's seven non-negotiables with their rationale. Load this skill before merging, editing, adding, or removing anything in this library's .claude/skills/ tree or its doctrine documents; when the user asks "can I just change this skill", "add a skill", "retire a skill", or "who approves this"; when a review of library content is being set up (factual/doctrine/usability reviewers); or when any skill or session appears to be routing around review. Defines Class 1–4 changes and their gates, the three-reviewer-plus-fixer workflow, and the doctrine every skill must obey. Not for changes to a target project (use that project's own process) and not for how to write the skill content itself (bbb-skill-authoring).
---

# Change Control

## Purpose

This library is load-bearing: sessions in other repos follow its runbooks
verbatim, so a wrong or contradictory skill propagates errors everywhere the
library is installed. Changes are therefore classified and gated — heavier
review for heavier blast radius.

## When NOT to use this skill

- Changing a TARGET project that merely consumes these skills: follow that
  project's own change process.
- Writing or formatting the content of a skill: `bbb-skill-authoring`.
- Deciding whether an idea becomes a rule or a skill: `bbb-rule-distillation`.

## Change classification

| Class | What | Gate |
|---|---|---|
| 1 | Typo/formatting; no meaning change | Self-merge after re-reading the full diff |
| 2 | Factual update inside one skill (a command changed, a date-stamp refresh, a drifted path) | Re-run the affected verification command, paste its output into the change description, update the skill's Provenance section |
| 3 | New skill, removed skill, or restructuring across skills | Full `bbb-skill-authoring` pre-submission checklist + the three-reviewer workflow below |
| 4 | Doctrine: editing the non-negotiables, the format spec, or the library's ownership map | Everything in Class 3 + explicit sign-off from the project owner; no session may self-approve |

When in doubt between two classes, take the higher one.

## The three-reviewer workflow (Class 3+)

Three independent reviews over the complete change, then one fixer. Reviewers
may be subagents (`bbb-subagent-orchestration` has the prompt patterns) or
humans; independence — not sharing the author's assumptions — is the point.

| Reviewer | Looks for | Severity question |
|---|---|---|
| FACTUAL | Every command/flag/path/claim re-verified against reality; anything invented or stale | Would it send an engineer down a wrong path? |
| DOCTRINE | Contradictions with the non-negotiables or between skills; overstated claims; behavior changes without gating | Does it break a promise the library makes? |
| USABILITY | Description trigger quality; duplication (one home per fact); self-containedness; scannability | Will the right reader find and follow it? |

Findings are ranked blocking / important / minor. The fixer applies blocking
and important fixes, lists minor ones as future work, and reports what was
fixed versus deferred. Author and fixer may be the same session; author and
reviewer must not be, except when no second session is available — then the
deviation is recorded in STATE.md (`bbb-state-and-memory`).

## The non-negotiables

Nothing in the library may contradict these. Each carries its rationale;
rules without rationale die in audits (`bbb-rule-distillation`).

1. **Ground truth only.** Every published command/flag/path verified by
   execution. *A zero-context reader cannot detect a lie; a wrong runbook is
   worse than none.*
2. **One home per fact.** Every fact/procedure lives in exactly one skill;
   siblings cross-reference by name. *Duplicates drift independently and the
   reader cannot tell which copy is current.*
3. **No oversell.** Unproven ideas are labeled open/candidate; novelty claims
   require the supporting milestone to be already hit. *The library's
   authority rests on never having claimed something false.*
4. **Skills live only at `.claude/skills/<name>/SKILL.md`.** *Founding
   incident: V1.0 shipped as a `Blue_Bubble.skill` ZIP at the repo root,
   which Claude Code cannot discover; it was deleted in commit `964db20`
   (chronicle entry #1 in `bbb-failure-archaeology`).*
5. **Self-contained for a zero-context reader.** No private or user-specific
   paths as load-bearing sources; jargon defined at first use. *The reader
   has nothing but the file.*
6. **Provenance mandatory.** Every skill ends with "Provenance and
   maintenance": authorship date, volatile facts, re-verification one-liners.
   *Skills outlive their authors; drift must be detectable by the reader.*
7. **STATE.md read before and updated after every run** on this library.
   *A session that skips this destroys its successor's context —
   `bbb-state-and-memory` owns the format.*

## No routing around

A skill that instructs readers to modify this library without the gates above
is itself a doctrine violation (Class 4 finding — blocking). The same applies
to sessions: "it's just a small improvement" is Class 2 at minimum, and Class
2 still requires re-running the verification command it touches.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library
  (Self-Improvement pillar). The classification table and non-negotiables were
  set by the library's founding engineer; changing them is Class 4 by
  definition.
- Volatile facts: commit SHAs `9e292eb`/`964db20` are permanent unless history
  is rewritten; the reviewer workflow assumes subagent capability may exist —
  the degraded single-session variant is recorded above.
- Re-verify the founding incident: `git log --oneline --all -- Blue_Bubble.skill`
  (expect the add and the delete).
- Re-verify no skill routes around review:
  `grep -rn "without review\|skip change control" .claude/skills/ --include=SKILL.md`
  (expect exactly one match — this line itself; verified 2026-07-07).
