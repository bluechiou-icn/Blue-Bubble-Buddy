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

## Last run log — 2026-07-07 (founding session)

- **Goal:** build the complete library per the owner's specification
  (discover → author via parallel agents → 3-reviewer pass → fix → push).
- **Authoring:** 16 skills; 8 written by parallel subagents, 8 inline after an
  account session limit (reset 05:10 UTC) terminated 13 of 16 authoring agents
  mid-run (their finished files were recovered from disk where complete).
- **Review:** DOCTRINE and USABILITY reviews completed over the full set
  (1 blocking, 6 important, ~19 minor findings). FACTUAL review was terminated
  by the same session limit — INCOMPLETE; its one reported finding (`xxd` not
  installed) is fixed (`od -c` substituted, verified).
- **Fixer:** all blocking and important findings applied, plus cheap minors:
  doctrine scope note in bbb-change-control; one-mechanism bar canonicalized
  to bbb-debugging-playbook; install-and-use verification wording made honest;
  eval-loop ↔ debugging-playbook tiebreaker added both ways; git-history
  mining consolidated into bbb-failure-archaeology; V1.0-incident retellings
  trimmed to pointers (AR-001); portable re-verify paths; subagent git-command
  constraint scoped to non-deliverable pushes.
- **Owner actions honored:** rename f5-mode → b5-mode (commits `e38d20f`,
  `637f4ef`), README lineage section removal (`1936d23`).

## Open items / escalations

1. **FACTUAL review incomplete** — re-run the factual verification pass over
   all 16 skills (per `bbb-change-control` reviewer table) once session limits
   allow. Commands in skills I authored inline were verified at authoring
   time; the independent re-verification pass never finished. OWNER of next
   session.
2. Deferred minor findings (fix opportunistically, Class 1–2):
   - `bbb-verification-and-evidence`: evidence-hierarchy table cells are dense;
     split nuances into bullets.
   - `b5-mode` always-on trigger and `bbb-state-and-memory` "or should have"
     trigger: precision unmeasured — pending frontier problem F4.
   - `bbb-failure-archaeology`: two-sentence STATE/chronicle division recap
     could compress to one clause.
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
