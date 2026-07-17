# STATE.md — Blue-Bubble-Buddy

Read this before doing anything in this repo; update it before you stop.
Format and rules: `.claude/skills/bbb-state-and-memory/SKILL.md`.

## Current snapshot (verified 2026-07-17)

- The library: 16 skills at `.claude/skills/<name>/SKILL.md`, all frontmatter
  validated (name = directory, description ≤1024 chars). One helper script:
  `bbb-visual-self-check/scripts/screenshot.mjs` (re-verified end-to-end
  2026-07-17 — see Last run).
- The behavior contract is named **`b5-mode`** (owner's rename from `f5-mode`,
  2026-07-07). Remaining `f5-mode` mentions are historical facts only.
- Root docs: README.md (inventory + quick start), CLAUDE.md (session rules),
  this file. PR #1 (initial library) merged 2026-07-07.
- **FACTUAL review debt is PAID** (2026-07-17): every published command in all
  16 skills re-executed in a real Linux environment; one factual defect found
  and fixed (see Last run), everything else passed as documented.
- Re-verify the snapshot: `ls .claude/skills/ | wc -l` (expect 16) and
  `grep -rn "f5-mode" .claude/skills/ README.md | grep -v b5-mode`
  (expect 4 historical lines: 1 in bbb-install-and-use, 3 in bbb-failure-archaeology).

## Last run log — 2026-07-17 (FACTUAL review pass, remote Linux session)

- **Goal:** resolve open item 1 (the incomplete FACTUAL review from the
  founding session): re-execute every published command in all 16 skills.
- **Results (all commands run in this session, outputs in the PR/commit):**
  - STATE re-verify pair: 16 dirs ✓; f5-mode grep → exactly 4 historical lines ✓
  - `bbb-failure-archaeology` git-mining set (grep-revert / diff-filter=D /
    show sha:path / for-each-ref) ✓; AR-001 evidence re-run:
    `git show 9e292eb:Blue_Bubble.skill | unzip -l` → `f5-mode/SKILL.md 4012` ✓
  - `bbb-project-discovery` five command blocks ✓ (TODO count here: 5)
  - `bbb-state-and-memory`: porcelain / `date +%F` / last-touch one-liners ✓
  - `bbb-install-and-use`: cp round-trip ✓; zip packaging → ZIP lists
    `b5-mode/` + `b5-mode/SKILL.md` (not root) ✓; `zip`/`unzip` present ✓
  - `bbb-visual-self-check/scripts/screenshot.mjs` end-to-end: rendered a
    local HTML → `WROTE .../vtest.png (viewport 1280x800)`, PNG 1280×800 ✓.
    Environment note: global-npm-root playwright resolution (script Strategy 2)
    works; a NEWER locally-installed `playwright-core` shadows it and fails on
    browser-version mismatch (expects chromium build the env doesn't have).
    The script's docs already cover this; no change needed.
  - **Defect found & fixed (Class 2):** `bbb-rule-distillation` audit commands
    used a bullet-only pattern `^- ` that silently returns 0 on numbered-style
    CLAUDE.md files (including this repo's own). Fixed to
    `^(- |[0-9]+\. )` in both occurrences; verified count 5 here.
- **Deferred minors adjudicated:**
  - `bbb-verification-and-evidence` table density: cells re-read, factually
    accurate; split into bullets NOT applied (style churn, no factual gain).
  - `bbb-failure-archaeology` two-sentence recap: NOT compressed (same reason).
  - Both removed from open items; reopen only if a reader actually stumbles.

## Open items / escalations

1. `b5-mode` always-on trigger and `bbb-state-and-memory` "or should have"
   trigger: precision unmeasured — pending frontier problem F4. OWNER: research
   track, no action until F4 is picked up.
2. Five skills below the 120-line body target (95–119 lines) — accepted; the
   floor is a target, not a gate. Do not pad.

## Decisions (one line each; stories in the archaeology chronicle / git)

- 2026-07-17: FACTUAL review debt paid; audit-command pattern widened to
  numbered rules (only defect of the pass).
- 2026-07-17: style-only deferred minors closed as won't-fix (churn > gain).
- 2026-07-07 (owner): behavior contract is `b5-mode`; English-only triggers.
- 2026-07-07 (owner): b5-mode keeps full Rule 3 / Rule 7 text; mechanics owned
  by `bbb-verification-and-evidence` / `bbb-subagent-orchestration`.
- 2026-07-07: non-negotiables split — content rules in `bbb-change-control`,
  behavior rules in `b5-mode`.
- 2026-07-07: `.skill` ZIPs are never committed to the repo (AR-001).

## Exact next action for a successor session

No debt outstanding. Next scheduled work is feature-level (owner's roadmap
item: agent-skill ↔ BBB integration, e.g. per-agent skills referencing
b5-mode). Before any change to `.claude/skills/`, classify it per
`bbb-change-control` and re-verify the snapshot above (two one-liners).
