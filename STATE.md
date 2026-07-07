# STATE.md — Blue-Bubble-Buddy

Read this before doing anything in this repo; update it before you stop.
Format and rules: `.claude/skills/bbb-state-and-memory/SKILL.md`.

## Current snapshot (verified 2026-07-07)

- The library: 16 skills at `.claude/skills/<name>/SKILL.md`, all frontmatter
  validated (name = directory, description ≤1024 chars). One helper script:
  `bbb-visual-self-check/scripts/screenshot.mjs` (verified end-to-end).
- The behavior contract is named **`b5-mode`** (owner's rename from `f5-mode`,
  2026-07-07 — see Decisions). All cross-references updated; remaining
  `f5-mode` mentions are historical facts about the V1.0 artifact only.
- Root docs: README.md (inventory + quick start), CLAUDE.md (session rules),
  this file. PR #1 (initial library) was merged into `main` on 2026-07-07.
- Re-verify the snapshot: `ls .claude/skills/` (expect 16 dirs) and
  `grep -rn "f5-mode" .claude/skills/ README.md | grep -v b5-mode`
  (expect 4 historical lines: 1 in bbb-install-and-use, 3 in bbb-failure-archaeology).

## Last run log — 2026-07-07 (readability pass; founding-session log in git history)

- **Goal:** owner-requested documentation pass — refine wording, normalize
  headings, and reorder sections for AI-agent readability, without changing
  any skill's meaning, commands, or frontmatter descriptions.
- **Changes (Class 1–2, single-session self-review — no second session
  available; deviation recorded here per bbb-change-control):**
  - All 16 skills now conform to the spec's section headings: first section is
    `## Purpose` everywhere (was `Purpose / when to use` in 5 files, missing
    in b5-mode); H1 titles normalized to "Title — subtitle" style (name-prefix
    H1s removed from bbb-eval-loop, bbb-state-and-memory).
  - Deferred minors applied: bbb-verification-and-evidence evidence-hierarchy
    table split into per-level bullet blocks; bbb-failure-archaeology
    STATE/chronicle division recap compressed to one clause.
  - bbb-failure-archaeology: trigger-rule section moved before entry format
    (when-to-write before what-to-write); no text changed.
  - README: skill inventory moved before Quick start (cross-references now
    resolve in reading order); intro verb tightened. CLAUDE.md unchanged
    (already in canonical rule form). Two sentence-level refinements
    (bbb-eval-loop, bbb-skill-authoring heading).
- **Evidence:** full diff re-read (Class 1 gate); frontmatter validated for
  all 16 (name = dir, desc ≤1024); `ls .claude/skills/ | wc -l` → 16;
  f5-mode grep → 4 historical lines; routing-around grep → exactly 1 match
  (the check line itself). No published command text was altered.
- **Owner actions honored (founding session):** rename f5-mode → b5-mode
  (commits `e38d20f`, `637f4ef`), README lineage section removal (`1936d23`).

## Open items / escalations

1. **FACTUAL review incomplete** — re-run the factual verification pass over
   all 16 skills (per `bbb-change-control` reviewer table) once session limits
   allow. Commands in skills I authored inline were verified at authoring
   time; the independent re-verification pass never finished. OWNER of next
   session.
2. Deferred minor findings (fix opportunistically, Class 1–2):
   - `b5-mode` always-on trigger and `bbb-state-and-memory` "or should have"
     trigger: precision unmeasured — pending frontier problem F4.
   - (Done 2026-07-07, readability pass: verification-and-evidence table
     split into bullets; failure-archaeology division recap compressed.)
3. Five skills are below the 120-line body target (95–119 lines) — accepted;
   the floor is a target, not a gate. Do not pad.

## Decisions (one line each; stories in the archaeology chronicle / git)

- 2026-07-07 (owner): the behavior contract is `b5-mode` ("B5 mode" /
  "Bubble mode"), English-only triggers; Fable-lineage story removed from
  README and the skill body. Rename completed library-wide by the session.
- 2026-07-07 (owner, implicit by edit): b5-mode keeps its full Rule 3 / Rule 7
  text — the overlap with `bbb-verification-and-evidence` /
  `bbb-subagent-orchestration` is accepted; those skills own the mechanics.
- 2026-07-07: non-negotiables split — seven content rules in
  `bbb-change-control`, behavior rules owned by `b5-mode` (scope note added).
- 2026-07-07: `.skill` ZIPs are never committed to the repo (AR-001).

## Exact next action for a successor session

Run the FACTUAL review pass (open item 1): re-execute every published command
in all 16 skills, severity-rank anything stale, fix as Class 2 with outputs
pasted into the commit message.
