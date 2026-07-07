---
name: bbb-install-and-use
description: How to install and consume the Blue-Bubble-Buddy skill library on each surface — copying skills into a target repo's .claude/skills/ for Claude Code, installing user-level skills in ~/.claude/skills/, and packaging a single skill as a .skill ZIP for claude.ai upload. Load this skill when the user asks to "install", "set up", "add", "package", "export", or "use" Blue-Bubble-Buddy skills in a project or account; when deciding project-level vs user-level placement; when choosing which subset of the library a new project should adopt; or when a skill that was copied somewhere is not loading. Contains the verified copy and zip commands and the what-loads-when table. Not for authoring or changing skills — use bbb-skill-authoring and bbb-change-control.
---

# Installing and Using the Library

## Purpose

The library's skills do nothing while they sit in this repo — they act only
when placed where a Claude surface discovers them. This skill gives the
verified commands for each placement and the rules for choosing among them.

## When NOT to use this skill

- Writing or modifying a skill: `bbb-skill-authoring` (format and house style)
  and `bbb-change-control` (gating and review).
- Deciding whether something should become a skill at all: `bbb-rule-distillation`.

## What loads when

| Placement | Who sees it | Best for |
|---|---|---|
| `<target-repo>/.claude/skills/<name>/` | Every Claude Code session in that repo | Team consistency; versioned with the repo |
| `~/.claude/skills/<name>/` | Every Claude Code session for that user, all repos | Personal workflow skills that follow you |
| `.skill` ZIP uploaded to claude.ai | That user's claude.ai chats | Using a skill outside Claude Code |

In all cases the skill's body loads only when its frontmatter `description`
matches the task at hand — installation makes a skill *available*, not *active*.

## Claude Code, project-level (the default)

Copy the wanted skill directories into the target repo:

```bash
# from the Blue-Bubble-Buddy repo root; TARGET is the consuming repo's root
mkdir -p "$TARGET/.claude/skills"
cp -r .claude/skills/b5-mode "$TARGET/.claude/skills/"
```

(Copy verified 2026-07-07: the copied directory contains SKILL.md. Discovery
was observed in this library's own repo — skills became loadable as soon as
their directories existed; pickup by a fresh session in a *target* repo uses
the same mechanism but was not separately observed — re-verify per the
Provenance section.) Repeat per skill, or copy
several at once: `cp -r .claude/skills/b5-mode .claude/skills/bbb-eval-loop "$TARGET/.claude/skills/"`.
Commit them in the target repo so the whole team's sessions get them. To track
upstream updates instead of snapshotting, `git subtree` or a submodule works,
at the cost of tying the target repo to this one (unverified here — plain copy
is the recommended default).

**Start small.** A new project should adopt the starter set — `b5-mode`,
`bbb-eval-loop`, `bbb-verification-and-evidence`, `bbb-state-and-memory` — and
add others when a real need appears (first hard bug → `bbb-debugging-playbook`;
first UI work → `bbb-visual-self-check`). Installing all 16 into a small
project is scope inflation and risks diluting trigger precision (unmeasured —
see `bbb-research-frontier` F4).

## Claude Code, user-level

```bash
mkdir -p ~/.claude/skills
cp -r .claude/skills/b5-mode ~/.claude/skills/
```

Prefer project-level when a team shares the repo (everyone gets the same
discipline, versioned and reviewable); user-level for personal behavior skills
like `b5-mode` that you want in every repo without touching each one.

## claude.ai upload (.skill packaging)

A `.skill` file is a ZIP whose top-level entry is the skill folder itself:

```bash
cd .claude/skills && zip -r /path/out/Blue_Bubble.skill b5-mode/
```

Verify the internal layout before shipping — this exact check:

```bash
unzip -l /path/out/Blue_Bubble.skill
# expect:  b5-mode/  and  b5-mode/SKILL.md   (NOT SKILL.md at the ZIP root)
```

(Both commands verified 2026-07-07; the layout matches the original V1.0
artifact, which contained `f5-mode/SKILL.md` — the behavior contract's name
before the owner renamed it `b5-mode`.) Then upload in claude.ai under
Settings → Capabilities (unverified — requires a claude.ai account session;
menu names may drift).

> **The V1.0 trap.** Committing the `.skill` ZIP to a repo does nothing —
> Claude Code never looks inside ZIPs. This project's first release made
> exactly that mistake (commits `9e292eb`/`964db20`); the full story is
> chronicle entry #1 in `bbb-failure-archaeology`. ZIPs are for claude.ai
> upload only; repos get the unpacked `.claude/skills/<name>/` directories.

## Troubleshooting a skill that won't load

1. Path exact? Must be `.claude/skills/<name>/SKILL.md` — check with
   `ls .claude/skills/*/SKILL.md` from the target repo root.
2. Frontmatter valid? `name:` must equal the directory name; malformed YAML
   blocks discovery.
3. Available but not firing? Installation ≠ activation — the description must
   match the task. Weak descriptions are an authoring defect: see
   `bbb-skill-authoring`.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library. Copy and zip
  commands verified that day on Linux (zip 3.0, git-managed source tree).
- Volatile facts: Claude Code's discovery paths (`.claude/skills/`,
  `~/.claude/skills/`) and the claude.ai upload flow are product behavior as of
  2026-07-07 and can change with releases; the claude.ai upload steps are
  unverified (no account session in the authoring environment).
- Re-verify discovery paths: create a dummy skill dir with a minimal SKILL.md
  in a scratch repo and confirm a new Claude Code session there lists it.
- Re-verify packaging in one line:
  `cd .claude/skills && zip -qr /tmp/t.skill b5-mode/ && unzip -l /tmp/t.skill | grep b5-mode/SKILL.md`
