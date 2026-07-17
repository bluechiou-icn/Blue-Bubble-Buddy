---
name: bbb-rule-distillation
description: Turns corrections, incidents, and repeated mistakes into durable written rules, and maintains those rules over time. Load this skill when the user corrects the same class of behavior a second time; when an investigation or incident reveals a non-obvious constraint worth writing down; when a review keeps flagging the same defect pattern; when deciding whether a piece of feedback should become a rule at all; when choosing where a rule lives (CLAUDE.md vs STATE.md vs the archaeology chronicle vs a full skill); when a cluster of related rules has grown enough to be promoted into a skill; or when an existing rule fires wrongly, has gone stale, or is being ignored and needs auditing or retirement. Do NOT load it for recording what happened (bbb-failure-archaeology), tracking current work (bbb-state-and-memory), or writing the skill itself (bbb-skill-authoring).
---

# Rule Distillation — Turning Corrections into Durable Rules

## Purpose and when to use

This skill is the self-improvement pipeline that converts corrections, incidents, and
repeated mistakes into durable rules — short written instructions that future sessions
obey without rediscovering the lesson. Use it at three moments: (1) when you notice a
repeat signal (same correction twice, same defect flagged again, a non-obvious constraint
uncovered by an investigation), (2) when you must decide WHERE a new rule lives, and
(3) when an existing rule misfires or goes stale and must be promoted or retired. A
"rule" here means exactly one imperative sentence plus a one-line rationale — anything
larger is a different artifact (see the placement table below).

## When NOT to use this skill

| You are trying to... | Use instead |
|---|---|
| Record what happened in an investigation (symptom, root cause, evidence, status) | `bbb-failure-archaeology` — the chronicle owns stories; rules only cite them |
| Track current work: open tasks, session handoff, what was fixed or escalated | `bbb-state-and-memory` — STATE.md owns transient state; rules are permanent |
| Actually write a new skill (format, description, template, size budget) | `bbb-skill-authoring` — this skill only decides WHEN a rule becomes a skill |
| Change this library's own skills or doctrine | `bbb-change-control` — distillation drafts the rule; change control gates it |

## Step 1 — Decide whether to distill (the trigger table)

Distill only on repeat or on proven non-obviousness. The default answer to "should this
become a rule?" is NO. Every rule added dilutes attention on every existing rule — a
project with 40 rules is a project where sessions skim all 40. This failure mode is
called rule inflation, and it makes all rules weaker.

| Signal | Distill? | Why |
|---|---|---|
| User corrects the same CLASS of behavior a second time | YES | Twice is a pattern, not noise. Waiting for a third costs another incident. |
| An investigation reveals a non-obvious constraint (something the repo cannot tell the next session) | YES | The next session will hit it blind. One rule is cheaper than one re-investigation. |
| A review keeps flagging the same defect pattern across changes | YES | The pattern is systemic; per-review comments are not sticking. |
| A one-off preference or taste comment ("I'd have named this differently") | NO | One data point. If it repeats, it becomes a second correction and qualifies then. |
| The lesson is already covered by an existing rule | NO — sharpen the existing rule instead | Two rules for one behavior means neither is the authority (one home per fact). |
| A fact about the current task ("the staging DB is down this week") | NO — write it in STATE.md | Transient facts rot fast; rules must stay true. See `bbb-state-and-memory`. |

Borderline test: ask "will this still be the correct behavior in six months, in a session
with zero memory of today?" If not, it is state or a story, not a rule.

## Step 2 — Draft the rule (format)

A rule is exactly two parts:

1. **One imperative sentence** stating the behavior. Testable: a reader can tell whether
   a given action complied or not.
2. **One-line rationale or incident reference** in parentheses: why the rule exists, or
   a pointer to the archaeology entry that does. A rule nobody can trace to a reason
   gets deleted in the next audit — untraceable rules are indistinguishable from
   superstition, and readers learn to skip them.

### Good rules

- `Skills live only at .claude/skills/<name>/SKILL.md; never ship a .skill zip at repo root. (Incident: V1.0 packaging — Claude Code cannot discover a zip; see the archaeology chronicle.)`
- `Paste the passing test output before reporting a fix as done. (User corrected fabricated "done" reports twice, 2026-06.)`
- `Run the migration in dry-run mode before applying it to any shared database. (An unchecked column drop took prod down; see archaeology entry.)`

Each is one sentence, imperative, testable, and traceable.

### Bad rules — and why each fails

- `Be careful with packaging.` — Not testable. No action a reader can comply with or violate.
- `Follow best practices for state management.` — "Best practices" is not a behavior; every reader decodes it differently.
- `Always use port 8080.` — Imperative and testable, but no rationale. First audit deletes it because nobody can say whether it still applies.
- `The user prefers shorter variable names (mentioned once, 2026-07-01).` — A one-off taste comment. It fails the trigger table; recording it as a rule is rule inflation.

## Step 3 — Place the rule (the placement table)

One artifact per kind of knowledge. Placing a rule in two homes guarantees they drift
apart; place it once and cross-reference.

| What you actually have | Where it lives | Details owned by |
|---|---|---|
| A project-wide behavioral rule ("in this repo, always/never X") | `CLAUDE.md` of the target project (the memory file Claude Code loads every session) | This skill |
| A current-work item: open task, pending decision, this-week fact | `STATE.md` | `bbb-state-and-memory` |
| The full investigation story behind the rule (symptom, root cause, evidence) | The archaeology chronicle; the rule cites the entry in its rationale | `bbb-failure-archaeology` |
| A rule that has grown procedures, checklists, or scripts | Promote it into a full skill (next section) | `bbb-skill-authoring`; route through `bbb-change-control` when it touches this library |

Formatting in CLAUDE.md: one bullet per rule (`- <sentence>. (<rationale>.)`), grouped
under a topic heading once a topic has more than one rule. Bullets keep rules countable
and auditable (commands below).

## The promotion path: rule → cluster → skill

Rules grow. Promote deliberately, at these thresholds:

1. **Rule** (1 imperative sentence + rationale). Lives as one bullet in CLAUDE.md.
2. **Rule cluster** (3 or more related rules on one topic). Group them under a shared
   heading in CLAUDE.md so readers see the topic as a unit. Still just sentences —
   no procedures.
3. **Skill** — promote the cluster when it needs procedure, examples, or scripts to be
   followable: readers keep asking "how exactly?", the rules have sprouted sub-steps,
   or you are tempted to embed a command sequence in a bullet. Write the skill using
   `bbb-skill-authoring`; if the skill belongs to this library, the addition passes
   `bbb-change-control` as a new-skill change. Then REPLACE the cluster in CLAUDE.md
   with a single pointer line (e.g. `- For release packaging, load the bbb-install-and-use skill.`)
   — leaving the old bullets beside the new skill creates two homes for one fact.

Do not skip levels upward: a single correction never goes straight to a skill. Writing
a skill for a one-sentence lesson buries the sentence under scaffolding nobody reads.

## The retirement path: audit and remove

Rules are audited when one of these fires, not on a calendar:

| Audit trigger | What it looks like |
|---|---|
| A rule fired wrongly | It blocked a correct action, or a session had to argue its way around it. |
| A rule stopped firing | The situation it governs no longer occurs (tool removed, workflow changed). |
| A rule has no traceable rationale | Nobody in the session can say why it exists and no incident is cited. |

Retirement procedure:

1. Confirm the rule is dead: check that the rationale's incident no longer applies, or
   that the behavior it mandates is now impossible or handled elsewhere.
2. Delete the bullet from CLAUDE.md.
3. Add a one-line note to the archaeology chronicle: the rule text, why it was retired,
   and the date (format owned by `bbb-failure-archaeology`).
4. If the rule had been promoted into a skill, retire through `bbb-change-control` instead
   of deleting directly.

Never leave a stale rule "just in case". Dead rules teach sessions to ignore the live
ones: once a reader catches one rule being wrong, every other rule loses authority.
The one-line archaeology note preserves the history at zero attention cost.

Audit commands (run in the target project root; verified 2026-07-17 against this
repository's numbered-style CLAUDE.md, which the earlier bullet-only pattern
silently counted as 0):

```bash
# Count rules — a rising count with no retirements is the rule-inflation smell.
# Matches both "- rule" bullets and "1. rule" numbered styles:
grep -cE '^(- |[0-9]+\. )' CLAUDE.md

# List rules missing a parenthesized rationale — deletion candidates for the audit:
grep -nE '^(- |[0-9]+\. )' CLAUDE.md | grep -v '('
```

The second command assumes rationales are written in parentheses as this skill
specifies; it is a heuristic, so read its hits before deleting anything.

## Worked example: one full distillation, end to end

This library's founding incident — the V1.0 packaging mistake recorded as
entry AR-001 in `bbb-failure-archaeology` — walked through the pipeline.

| Pipeline stage | What happened here |
|---|---|
| 1. Signal | An investigation revealed a non-obvious constraint: Claude Code only discovers skills at `.claude/skills/<name>/SKILL.md`; nothing in the repo said so. Trigger table row 2 → distill. |
| 2. Draft | `Skills live only at .claude/skills/<name>/SKILL.md; never ship a .skill zip at repo root. (Incident: V1.0 packaging; see the archaeology chronicle.)` One sentence, testable, traceable. |
| 3. Place | Project-wide behavioral rule → the project's memory file / doctrine, with the story itself placed in the archaeology chronicle, not in the rule. |
| 4. Later: promote | The topic grew procedure (where each surface loads skills from, the verified zip command for claude.ai upload) — past the skill threshold. The mechanics became the `bbb-install-and-use` skill, and the rule itself was embedded as a doctrine item guarded by `bbb-change-control`. |
| 5. Retirement check | Not retired: the constraint still holds (as of 2026-07-07), the rationale is traceable, and the rule still fires whenever packaging comes up. It survives audits. |

Note the division of labor: the RULE is one sentence in doctrine; the STORY is an
archaeology entry; the PROCEDURE is a skill. Three artifacts, three homes, one incident.

## Distillation checklist

1. Does the signal pass the trigger table? If NO, stop — do not write a rule.
2. Is there already a rule covering this behavior? If YES, sharpen that rule instead.
3. Draft: one imperative sentence + one-line rationale or incident reference.
4. Place it using the placement table; write the story (if any) to the archaeology
   chronicle and cite it from the rule.
5. If the topic now has 3+ rules, consider clustering; if the cluster needs procedure,
   promote to a skill via `bbb-skill-authoring` (and `bbb-change-control` for this library).
6. On any misfire or dead rule: retire it with a one-line archaeology note.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy library (Self-Improvement pillar), from
  the authoring brief and this repo's git history.
- Volatile facts: the founding-incident summary and the sibling skill names
  (`bbb-state-and-memory`, `bbb-failure-archaeology`, `bbb-skill-authoring`,
  `bbb-change-control`, `bbb-install-and-use`) are correct as of 2026-07-07. The
  promotion thresholds (2 corrections to distill, 3+ rules to cluster) are this
  library's working doctrine, not measured constants — treat them as defaults, and
  change them only through `bbb-change-control`.
- Re-verify the founding incident: `git -C /home/user/Blue-Bubble-Buddy log --oneline`
  (verified 2026-07-07: shows `964db20 Delete Blue_Bubble.skill` after `9e292eb Blue-Bubble-Buddy-V1.0`).
- Re-verify sibling skills still exist: `ls /home/user/Blue-Bubble-Buddy/.claude/skills/`
  (in a target repo: `ls .claude/skills/`).
- Re-verify the audit commands against your project's CLAUDE.md:
  `grep -cE '^(- |[0-9]+\. )' CLAUDE.md` and
  `grep -nE '^(- |[0-9]+\. )' CLAUDE.md | grep -v '('`
  (verified 2026-07-17 against this repository's CLAUDE.md: count 5, all with
  bold-title rationales; the pre-fix bullet-only pattern returned 0 here).
