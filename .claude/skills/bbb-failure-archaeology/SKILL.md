---
name: bbb-failure-archaeology
description: Maintains the project's permanent failure chronicle (ARCHAEOLOGY.md) so no settled battle is refought. Load this skill when finishing any investigation that took more than ~30 minutes, when rejecting an approach or reverting a change, when a bug feels familiar ("didn't we hit this before?"), when joining an unfamiliar project and needing to reconstruct its past failures from git history, or when deciding whether a proposed fix was already tried and rejected. Covers the entry format (symptom, root cause, evidence, status), the append-only rules, and verified git commands for mining reverts, deleted files, and dead branches.
---

# Failure Archaeology — the permanent chronicle

## Purpose

This skill defines the chronicle discipline: every major investigation, dead end, rejected fix, and revert gets a permanent written record — symptom, root cause, evidence, status — in an append-only file called `ARCHAEOLOGY.md`. The payoff is that no engineer or model session ever re-fights a settled battle: before attempting a fix, you check the chronicle; after finishing an investigation, you write the entry. Load this skill when you finish a significant investigation, when you revert or reject something, or when you join a project and need to reconstruct its failure history from git.

## When NOT to use this skill

- **Tracking current state and open tasks** — what is in progress, what was fixed this run, what is escalated. That is `bbb-state-and-memory` (STATE.md). Rule of thumb: STATE.md is *current and mutable*; the chronicle is *permanent and append-only*. A finished investigation moves from STATE.md's "open" list into an ARCHAEOLOGY.md entry.
- **Turning an incident into a standing behavior rule** ("never do X again"). That is `bbb-rule-distillation`. The chronicle records *what happened and why*; distillation extracts the *rule* from it. An entry here often becomes the cited evidence for a distilled rule.
- **Running the investigation itself.** That is `bbb-debugging-playbook`. This skill only governs how you record the result.

## The trigger rule — when an entry MUST be written

Write an entry, at the moment of finishing and by the person or session that did the work (context evaporates within hours):

1. **Any investigation that took more than ~30 minutes**, whether or not it produced a fix. The 30-minute bar is a floor, not a target — a 5-minute finding that will recur is also worth an entry.
2. **Every rejected approach** — a fix that was designed or attempted and then abandoned. Record *why* it was rejected; this is the highest-value entry type.
3. **Every revert.** If a commit gets backed out, the chronicle explains what the commit tried to do and why it had to go. The revert commit message should reference the entry ID.

This is the final step of the debugging exit protocol in `bbb-debugging-playbook`: an investigation is not finished until its entry exists. If the same class of incident produces a second entry, that is the signal to load `bbb-rule-distillation` and turn it into a standing rule.

## The entry format

Every entry answers four questions: what did we see, what actually caused it, how do we know, and is it closed. One entry per incident. Template:

```markdown
## AR-<NNN>: <one-line title naming the symptom> (<YYYY-MM-DD>)

- **Status:** settled | open | superseded by AR-<NNN>
- **Symptom:** What was observed, stated concretely enough that a future
  reader with the same symptom will recognize it (error text, wrong output,
  missing behavior — not "it was broken").
- **Root cause:** The one mechanism that explains ALL observations,
  including the negative ones (things that surprisingly did NOT fail).
- **Evidence:** How the root cause was confirmed — commit SHAs, test output,
  logs, or a command a reader can re-run today to see it themselves.
- **Fix / resolution:** What was done. If a fix was REJECTED, say which fix
  and exactly why it was rejected — rejected approaches are the entries that
  save the most future time.
- **Dead ends:** (optional) Approaches tried that did not work, one line each,
  so nobody retries them.
```

Field rules:

| Field | Rule |
|---|---|
| ID | Sequential `AR-001`, `AR-002`, … Never reuse a number, even for superseded entries. |
| Date | Date the entry was written, not when the incident started. |
| Status `settled` | Root cause confirmed and resolution applied. The default end state. |
| Status `open` | Investigation stopped without a confirmed root cause. Say what was ruled out and where you stopped, so the next person resumes instead of restarting. |
| Status `superseded` | A later entry revised this conclusion. Point to it by ID. Never edit the old entry's body beyond the status line. |
| Evidence | Must be checkable by a stranger. "I'm pretty sure" is not evidence — see `bbb-verification-and-evidence` for the evidence hierarchy. |

## Where the chronicle lives

- **File:** `ARCHAEOLOGY.md` at the target project's repo root. If the project keeps documentation under `docs/`, use `docs/archaeology.md` instead — pick one location and never split across both.
- **Append-only.** New entries go at the END of the file (chronological order; newest last). Entries are never deleted and never rewritten. If a conclusion turns out to be wrong, write a NEW entry with the corrected finding and mark the old one `superseded by AR-<NNN>`. History of being wrong is itself evidence.
- **Committed to the repo**, same as code. It must survive every session, machine, and team change — that is the whole point.
- **Division of labor with STATE.md** (owned by `bbb-state-and-memory`): when an investigation closes, summarize the conclusion into an ARCHAEOLOGY.md entry and remove the working notes from STATE.md.

## Mining git history when joining a project

When you inherit a project with no chronicle, reconstruct one from git. Run these from the repo root. All commands below were verified against a real repository on 2026-07-07; they are read-only and safe to run anywhere.

**1. Find reverts and deletions by commit message:**

```bash
git log -i --grep="revert\|rollback\|back out\|delete" --oneline
```

Each hit is a candidate entry: something was tried and undone. (`git log --grep` uses basic regex, so alternation is `\|`; `-i` makes it case-insensitive.)

**2. Find every file ever deleted:**

```bash
git log --diff-filter=D --summary
```

Prints, per commit, `delete mode ... <path>` lines. Deleted files are fossilized dead ends — each one had a reason to exist and a reason to die.

**3. See what a suspicious commit actually changed:**

```bash
git show <sha> --stat
```

Shows the commit message, author, date, and the file-level change summary without dumping full diffs. Drop `--stat` for the full diff once you know it is the commit you care about.

**4. Recover the content of a deleted file:**

```bash
git show <sha>:<path> > recovered-file
```

`<sha>` is the last commit where the file still existed (i.e., the parent of the deleting commit, or the commit that added it). Works for binary files too — redirect to a file rather than the terminal.

**5. Trace one file's full history, including through its deletion:**

```bash
git log --oneline --all -- <path>
```

Also useful: `git log -S "<string>" --oneline --all` (the "pickaxe") finds every commit that added or removed a given string — good for tracking when a workaround appeared or vanished.

**6. Find dead or stalled branches:**

```bash
git for-each-ref --sort=-committerdate \
  --format='%(committerdate:short) %(refname:short) %(subject)' \
  refs/heads refs/remotes
```

Branches whose last commit is old and never merged are abandoned campaigns. Diff them against the mainline (`git log main..<branch> --oneline`) to see what was attempted, then write an `open` or `settled` entry for each abandoned effort you can explain.

Turn each finding into a normal entry. If you cannot determine the root cause from history alone, file it as `open` with what the history shows — an honest `open` entry beats an invented `settled` one (doctrine: ground truth only).

## SEED ENTRY #1 — this repository's founding incident

The following is a real entry, verified against this repository's git history on 2026-07-07. Copy it as the first entry when creating `ARCHAEOLOGY.md` for the Blue-Bubble-Buddy project itself; for other projects it serves as the worked example of the format.

```markdown
## AR-001: V1.0 skill shipped as a ZIP at repo root and was never loadable (2026-07-07)

- **Status:** settled
- **Symptom:** Blue-Bubble-Buddy V1.0 published its only skill as
  `Blue_Bubble.skill` — a 2,393-byte ZIP file at the repository root,
  containing `f5-mode/SKILL.md` (the Fable-5 behavior contract, written in
  Traditional Chinese). Claude Code sessions in the repo never picked up the
  skill.
- **Root cause:** A `.skill` ZIP at repo root is not discoverable by Claude
  Code, which loads project skills only from `.claude/skills/<name>/SKILL.md`.
  The `.skill` ZIP format exists solely for manual upload to claude.ai
  (Settings > Capabilities). The file was in the wrong format at the wrong
  path for the intended consumer.
- **Evidence:** Commit `9e292eb` ("Blue-Bubble-Buddy-V1.0") added
  `Blue_Bubble.skill` (binary, 2,393 bytes); commit `964db20`
  ("Delete Blue_Bubble.skill") removed it. Recover and inspect the original:
  `git show 9e292eb:Blue_Bubble.skill > recovered.skill && unzip -l recovered.skill`
  (lists one file: `f5-mode/SKILL.md`, 4,012 bytes).
- **Fix / resolution:** The library was rebuilt under `.claude/skills/`,
  where Claude Code discovers skills automatically; `f5-mode` was re-authored
  as a proper skill directory (later renamed `b5-mode` by the owner). For the packaging rules per surface
  (project skills vs user skills vs claude.ai upload), see
  `bbb-install-and-use`. This incident is also the rationale behind the
  library doctrine "skills live only at `.claude/skills/<name>/SKILL.md`".
```

Note what the entry does: SHAs a stranger can check, a recovery command they can run today, a resolution that points to the sibling skill owning the details instead of duplicating them.

## Checklist — closing out an investigation

1. Root cause confirmed (one mechanism explains all observations) or explicitly not confirmed.
2. Entry drafted from the template: ID, date, status, symptom, root cause, evidence, fix or rejection reason, dead ends.
3. Evidence is re-checkable by a stranger (commands, SHAs, test names — not memory).
4. Entry APPENDED to `ARCHAEOLOGY.md`; no existing entry edited (except adding a `superseded by` status line).
5. Working notes for this investigation removed from STATE.md (see `bbb-state-and-memory`).
6. If this is the second entry of the same class, load `bbb-rule-distillation`.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Memory pillar).
- All git commands above were verified by running them against this repository's real history on 2026-07-07. They use only stable, decades-old git plumbing/porcelain and are unlikely to drift.
- Volatile facts: the seed entry's SHAs (`9e292eb`, `964db20`) are permanent unless the repository history is rewritten; the claim that Claude Code loads skills only from `.claude/skills/<name>/SKILL.md` is product behavior (as of 2026-07-07) and is owned, with its re-verification procedure, by `bbb-install-and-use`.
- Re-verify the seed entry in one line: `git log --oneline --all -- Blue_Bubble.skill` (expect `964db20` delete and `9e292eb` add), then `git show 9e292eb:Blue_Bubble.skill | head -c 4 | od -c` (expect `P   K 003 004` — the ZIP signature; `od` used because `xxd` is not installed in every environment; verified 2026-07-07).
- Re-verify the mining commands against any repo with history: each is read-only; if one errors, check `git --version` first (verified here against git in this environment on 2026-07-07).
