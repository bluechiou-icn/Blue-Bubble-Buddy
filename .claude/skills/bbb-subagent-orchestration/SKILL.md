---
name: bbb-subagent-orchestration
description: Teaches when and how to delegate work to subagents (worker agents spawned with their own prompt and zero conversation context) versus doing the work inline. Load this skill when you are about to spawn a subagent or Task/Agent-tool worker; when planning parallel work such as research fan-out, one-agent-per-unit authoring, or adversarial review; when writing a subagent prompt or a shared brief for several agents; when deciding whether tasks can run in parallel or must run sequentially; when a running agent looks stuck or off-track and you must intervene; when relaying a finished agent's results to the user; or when the environment has no subagent capability and you must degrade gracefully. Not for the within-task goal/action/check loop (see bbb-eval-loop).
---

# Subagent Orchestration: When and How to Delegate

## Purpose / when to use

This skill tells you when to hand a sub-task to a subagent and when to do it yourself, and gives you the exact prompt structure, workflow patterns, and supervision rules that make delegation reliable. A "subagent" is a separate agent session you spawn with a written prompt (in Claude Code, via the Agent/Task tool); it starts with zero knowledge of your conversation and returns one final report. Use this skill the moment you are considering spawning one.

## When NOT to use this skill

- The task is small and single-threaded (a few tool calls, one file). Just do it. Delegation overhead exceeds the work.
- You want the iteration discipline *within* a task — decomposing a goal, defining checks before acting, deciding when to stop. That is `bbb-eval-loop`.
- You want the per-session behavior contract (conclusion-first, evidence, scope, turn-ending). That is `b5-mode`.
- You want how changes to THIS skill library are gated and reviewed. That is `bbb-change-control` (it instantiates the reviewer pattern below with specific gates).
- You want what counts as evidence in a report. That is `bbb-verification-and-evidence`.

## 1. The delegation decision

Delegate when work is **independent** and **context-heavy**. Stay inline when it is small, sequential, or depends on what only you know.

| Situation | Decision | Why |
|---|---|---|
| Broad research fan-out (survey many files, docs, or options; only conclusions matter) | Delegate | Raw exploration would flood your context; you need only the summary. |
| Per-unit authoring (one file, one module, one skill per agent, same spec) | Delegate, in parallel | Units are independent; a shared brief keeps them consistent (see §3). |
| Adversarial review of finished work | Delegate | Fresh eyes with zero attachment to the draft find what the author cannot. |
| A task whose working set (files to read) is large but the deliverable is small | Delegate | The subagent burns its own context, not yours. |
| A few tool calls, one obvious change | Inline | Writing the prompt costs more than the work. |
| Each step depends on the previous step's result | Inline (or sequential agents) | Nothing to parallelize; hand-offs add failure points. |
| The task needs your accumulated context: user decisions, facts established this conversation, judgment calls you have already made | Inline | You cannot transfer a conversation; a subagent will re-derive or guess. |
| Anything requiring a mid-task question to the user | Inline | Subagents cannot talk to the user. |

**Cold-start cost warning.** Every subagent starts with ZERO conversation context. It has not seen the user's messages, your findings, or your decisions. Everything it needs must be in its prompt or in files the prompt points to. Rule of thumb: if writing a complete prompt would take longer than doing the task, do the task inline.

## 2. Prompt anatomy — the contract checklist

A subagent prompt is a contract. Anything ambiguous, the agent will fill with guesses — and a confident wrong guess costs more than the delegation saved. Every prompt must contain all six parts:

1. **Role and mission in one sentence.** "You are a factual reviewer for skill X" beats three paragraphs of scene-setting.
2. **Pointers to shared context it must read, as absolute paths, with read order.** Subagents typically get a fresh working directory per command; relative paths break. Say "READ FIRST, in order: /abs/path/brief.md, then /abs/path/spec.md".
3. **Exact deliverable and output path.** What artifact, in what format, written where. "Write findings to /abs/path/review-x.md as a severity-tagged list" — never "review it".
4. **Explicit boundaries.** What it must NOT do or touch: "Write ONLY inside <dir>; the rest of the repo is read-only; do not modify sibling X's files."
5. **Constraints.** The standing safety rules, restated because the agent has not read them anywhere else: no mutating git commands (add/commit/push/checkout) unless committing or pushing IS the agent's deliverable — then name the exact branch; verify every command by running it before publishing it; label anything unverifiable.
6. **The report format expected back.** Tell it exactly what its final message must contain (e.g. "reply with: output path, 1-line summary, commands verified, anything unverified"). Otherwise you get either a novel or "Done."

Before spawning, reread the prompt asking one question: "Could a stranger with no memory of this conversation execute this without asking me anything?" If not, fix the prompt.

## 3. The shared-brief pattern (N parallel agents)

When you spawn N agents doing parallel instances of the same kind of work, do not write N long prompts. Write ONE brief file containing the common contract, and N short per-agent prompts that reference it.

The brief holds everything common: audience, format spec, doctrine/non-negotiables, the ownership map (which agent owns which unit, so no two agents write the same content or touch each other's files), and the required report format. Each per-agent prompt then only needs: read-the-brief-first (absolute path), the agent's assigned unit, and any per-unit specifics.

Why this beats N standalone prompts: one place to fix a spec error before (or even during) the run; guaranteed consistency across outputs; short prompts that are easy to audit for the §2 checklist.

This library is the worked example: it was authored by one subagent per skill, all working from a single shared authoring brief with an ownership map — the skill you are reading was itself produced inside that pattern.

A per-agent prompt skeleton (adapt the bracketed parts; every §2 item is present):

```text
You are one of N parallel <kind> agents for <project>.
READ FIRST, in order: /abs/path/to/brief.md (binding contract), then /abs/path/to/<per-unit-spec>.

Your assignment: exactly ONE unit — <unit name>, output at /abs/path/to/output.

You own: <scope of this unit>. Cover: <required content, as a list>.

Hard constraints: write ONLY inside <assigned dir>; no mutating git commands;
verify every command you publish by running it, or label it "unverified — requires <thing>".

Finish by replying with: the output path, a 1-line summary, commands you verified
by running, and anything you could not verify.
```

## 4. Parallel vs sequential

- **Parallelize only independent work.** Two tasks are independent when neither reads the other's output and they write to disjoint paths. Never point two agents at the same file.
- **Wait when the next task depends on a result.** Author before reviewer; reviewer before fixer. Launching a dependent task early just makes it guess.
- **Keep working while background agents run.** Delegation is not a pause button: continue your own tasks (the next inline item, preparing the next phase's prompts) and handle agent completions as they arrive. Idle-waiting on a background agent wastes the whole point.
- **Spawn all independent agents in one batch,** then process results as they come back. Do not spawn one, wait, spawn the next.

## 5. Workflow pattern: author → parallel reviewers → fixer

The standard quality pipeline for delegated authoring, once ALL authored artifacts exist:

1. **Author(s)** produce the artifacts (often N parallel agents per §3).
2. **Parallel reviewers**, each with a distinct lens so findings do not overlap:
   - *Factual*: re-verify every command, flag, and path against the repo; flag anything invented or stale.
   - *Doctrine*: contradictions with project rules or between artifacts; overstated claims.
   - *Usability*: can the target audience actually follow it; duplication; trigger quality.
   Reviewers must be different agents from the author — a fresh agent has no attachment to the draft, which is the entire value. Have each reviewer tag findings by severity (blocking / important / minor).
3. **One fixer** applies the blocking and important findings across all artifacts. One fixer, not three, so conflicting edits cannot collide.

For how this library gates its own changes through this pipeline, load `bbb-change-control`.

## 6. Intervention: detecting and correcting a derailed agent

You are the supervisor. Watch for these derailment signals in progress output and reports:

| Signal | What it means |
|---|---|
| Writes appearing outside the agent's assigned paths | It ignored or never absorbed its boundaries. |
| Report or output does not match the requested deliverable/format | It substituted its own interpretation of the mission. |
| Runs far longer than sibling agents on equivalent work | Likely stuck in a loop or exploring out of scope. |
| Report asks questions the brief already answers | It skipped the required reading. |

Responses, in order of preference:

1. **Re-prompt**: if the environment lets you send a follow-up message to a running or completed agent, send a corrective message — restate the violated boundary or missing requirement, nothing else.
2. **Replace**: stop the agent and spawn a fresh one with a *tightened* prompt. Always fix the prompt, not just the agent: the ambiguity that derailed agent one will derail agent two identically.
3. **Reclaim**: if the task derails twice, take it inline. It probably depended on context you could not transfer — a §1 misclassification.

After any intervention, check whether the same gap exists in sibling prompts or the shared brief, and fix it there before more agents hit it.

## 7. Result relay — the user never saw the report

A subagent's final message is returned only to you, the orchestrator. The user has not seen it and never will. When you report back:

- Restate what matters in your own words: the outcome, the file paths produced (absolute), and what was verified versus unverified (see `bbb-verification-and-evidence` for the evidence bar).
- Do not paste the agent's whole report; do not say only "the agent finished." Relay exactly the details that change the user's next action.
- You own the claims you relay. If a subagent reports "all tests pass" and it matters, spot-check before repeating it — a fabricated or mistaken subagent report becomes YOUR fabricated report the moment you forward it.

## 8. Graceful degradation: no subagent capability

If the current environment has no subagent capability (no Agent/Task-style tool in your tool list), execute the sub-tasks yourself, sequentially, in the order you would have delegated them — and do not announce the difference to the user. The plan's decomposition (§1–§5) still applies; only the executor changes. The user asked for the outcome, not a tour of your tooling constraints. (This is the behavior contract's delegation rule — `b5-mode` Rule 7; this section owns its mechanics.)

The reviewer pattern (§5) degrades too: review your own work in separate, labeled passes — one factual pass, one doctrine pass, one usability pass — reading the artifact fresh each time, and only then fix.

## Provenance and maintenance

- Authored 2026-07-07, by a subagent of the Blue-Bubble-Buddy library build — one authoring agent per skill working from a shared brief, i.e. an instance of §3.
- This skill is process doctrine and contains no shell commands to drift. Its volatile facts are environmental:
  - The mechanism for spawning subagents varies by harness and version (as of 2026-07-07, Claude Code exposes it as the Agent/Task tool, with optional background execution and follow-up messaging to a spawned agent). Re-verify by checking the tool list available in your current session before promising parallelism — this cannot be verified by a shell command.
  - Sibling skill names referenced here (`bbb-eval-loop`, `b5-mode`, `bbb-change-control`, `bbb-verification-and-evidence`). Re-verify: `ls .claude/skills/` from the repo root.
