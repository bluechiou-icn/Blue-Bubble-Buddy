# Instructions for sessions working in this repository

This repo IS the Blue-Bubble-Buddy skill library — the product is the
`.claude/skills/` tree. Treat skill files as production code.

1. **Read `STATE.md` before doing anything.** Update it before you stop
   (`bbb-state-and-memory` has the format). A session that skips this
   destroys its successor's context.
2. **Every change to `.claude/skills/` goes through change control.**
   Classify it (Class 1–4) and follow the gate in `bbb-change-control`.
   New or restructured skills additionally follow the `bbb-skill-authoring`
   checklist. Doctrine changes (Class 4) require the owner's explicit sign-off.
3. **Ground truth only.** Never publish a command, flag, or path you did not
   execute in a real environment. Label anything unverifiable:
   "unverified — requires <thing>".
4. **One home per fact.** Before adding content, check which skill owns the
   topic (inventory in README.md) and cross-reference instead of duplicating.
5. **Record investigations.** Anything that took real time to figure out gets
   a chronicle entry per `bbb-failure-archaeology`; repeated corrections get
   distilled per `bbb-rule-distillation`.
