---
name: bbb-skill-authoring
description: How to write a skill for the Blue-Bubble-Buddy library — the canonical format spec, trigger-rich description writing, the house template, and the pre-submission checklist. Load this skill before creating any new SKILL.md in this library or a project that follows its conventions; when the user says "write a skill", "add a skill", "turn this into a skill", or "improve this skill's description"; when a skill exists but never triggers (weak description) or triggers wrongly; or when deciding how to split an oversized skill. Covers loading mechanics (models see only name and description until the body loads), description good/bad examples, section order, size budget, script-verification rules, and provenance requirements. Not for deciding WHETHER something should become a skill (bbb-rule-distillation) or for the review/gating process (bbb-change-control).
---

# Skill Authoring

## Purpose

This is the canonical home of the library's skill format and house style. A
skill is a runbook a zero-context reader loads mid-task: it must trigger at the
right moment, teach in imperative voice, and contain nothing unverified.

## When NOT to use this skill

- Deciding whether a rule or observation deserves to become a skill at all:
  `bbb-rule-distillation` owns the promotion thresholds.
- Getting a finished skill reviewed and merged: `bbb-change-control` owns
  classification, gates, and the reviewer workflow.

## Loading mechanics — the fact that changes everything

A model deciding whether to use a skill sees ONLY the frontmatter `name` and
`description`. The body loads only after the description wins that decision.
Consequences:

- The description is the single highest-leverage text in the file. A perfect
  body behind a vague description never runs.
- The body cannot rely on anything "the model will know from the description
  moment" — once loaded, it must stand alone.
- Descriptions compete: when several skills could plausibly match, the most
  specific trigger wording wins. Vague descriptions lose every contest.

## Writing the description

Third person, ≤1024 characters, and trigger-rich: name the concrete
situations, user phrasings, and task shapes that should load it — and what it
is NOT for, naming the sibling.

**Bad (vague marketing — never triggers):**
> Helpful guidance for better debugging and quality engineering practices.

**Good (situations + phrasings + boundary):**
> Disciplined debugging method — reproduce first, rank competing mechanisms,
> run discriminating experiments one change at a time. Load when diagnosing
> any bug, crash, regression, flaky test, or "it worked yesterday" report;
> before any restart/delete/cache-clear meant to make a failure go away.
> Not for feature work (use bbb-eval-loop).

Trigger-test before submitting: write down three realistic user requests that
SHOULD load the skill and two that should NOT; check the description text
plausibly separates them.

## The format spec (canonical)

| Rule | Value |
|---|---|
| Path | `.claude/skills/<name>/SKILL.md`; helper scripts in `<name>/scripts/` |
| `name` | Equals the directory name; lowercase-hyphens; ≤64 chars |
| `description` | ≤1024 chars, third person, trigger-rich |
| Body length | Target 120–350 lines; split overflow into reference files in the skill dir and link them |
| Section order | Purpose → When NOT to use → core content → Provenance and maintenance (last) |
| Language | English body (bilingual triggers allowed in the description where users actually use them) |
| Scripts | Every shipped script verified by actually running it; document the verified invocation |
| Volatile facts | Date-stamped inline, e.g. "(as of 2026-07-07)" |

## House template

```markdown
---
name: <dir-name>
description: <what it does + "Load this skill when …" triggers + "Not for X — use <sibling>.">
---

# <Title>

## Purpose
<2–4 sentences: what this skill makes the reader able to do, and why it exists.>

## When NOT to use this skill
- <boundary> — use `<sibling>` instead.

## <Core content>
<Imperative runbook: numbered steps, tables, checklists, copy-pasteable
verified commands. Define each jargon term at first use. Most important
content first.>

## Provenance and maintenance
- Authored <date> for the Blue-Bubble-Buddy skill library (<pillar>).
- Volatile facts: <list, with dates>.
- Re-verify: `<one-line command per drift-prone claim>`.
```

## The audience contract

Write for a zero-context mid-level engineer or Sonnet-class model session:

1. **Imperative runbook voice.** "Run X. If Y, do Z." — not essays about X.
2. **Ground truth only.** Every command, flag, and path executed before
   publishing. A wrong runbook is worse than none: the zero-context reader
   cannot detect the lie. Anything unverifiable in your environment gets an
   explicit label: "unverified — requires <thing>".
3. **One home per fact.** Check the library inventory (README.md) before
   writing; if a sibling owns a fact, cross-reference by name (one clause max)
   instead of restating it. Duplicated facts drift independently.
4. **Jargon defined once,** at first use.
5. **No oversell.** Unproven ideas stay labeled open/candidate.
6. **Tables and checklists** over prose walls; most important content first.

## Pre-submission checklist

- [ ] Frontmatter: `name` = directory name; description ≤1024 chars, trigger-tested (3 should-load, 2 should-not).
- [ ] Sections in order; "Provenance and maintenance" is last and contains re-verification one-liners.
- [ ] Every command executed in a real environment; unverifiable items labeled.
- [ ] Scripts (if any) run end-to-end; verified invocation documented.
- [ ] No fact duplicated from a sibling (searched the library for key terms).
- [ ] Volatile facts date-stamped.
- [ ] When-NOT-to-use names at least one sibling.

Then route the change through `bbb-change-control` (a new skill is a Class 3
change and gets the three-reviewer workflow).

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library
  (Self-Improvement pillar). This file is the canonical format spec; if the
  spec changes, that is a Class 4 doctrine change (see `bbb-change-control`).
- Volatile facts: the name/description limits (64/1024 chars) and the
  name-equals-directory rule reflect the Agent Skills format as of 2026-07-07;
  re-verify against the current Claude skills documentation when a skill
  mysteriously fails to load despite a correct path.
- Re-verify a skill's frontmatter mechanically:
  `python3 -c "import sys,re; t=open(sys.argv[1]).read(); m=re.match(r'^---\n(.*?)\n---', t, re.S); d=dict(l.split(': ',1) for l in m.group(1).splitlines() if ': ' in l); print(len(d.get('description','')), 'desc chars;', d.get('name'))" .claude/skills/<name>/SKILL.md`
