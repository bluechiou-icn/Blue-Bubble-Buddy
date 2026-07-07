---
name: bbb-visual-self-check
description: Verify visual output by actually rendering and screenshotting it, never by reading source code and assuming it looks right. Load this skill whenever a session has produced or changed anything a human will look at — a web page, UI component, chart, dashboard, HTML artifact, CSS/layout change, or rendered document — and is about to claim it works or looks correct; when the user says "screenshot it", "check how it looks", "verify the layout", "does dark mode work", or reports that something "looks wrong"; or when a UI bug fix needs before/after proof. Ships a verified Playwright screenshot script (scripts/screenshot.mjs) for URLs and local HTML files, a criteria-first visual QA workflow, and a fallback hierarchy for environments without a browser. Not for non-visual changes (logic, data, config) — use bbb-verification-and-evidence.
---

# Visual Self-Check

## Purpose

An agent that produced visual output must LOOK at it before claiming it works:
render the page, capture a screenshot, read the image back, and compare it
against acceptance criteria that were written down BEFORE rendering. "The code
looks correct" is static reasoning — near the bottom of the evidence hierarchy
in `bbb-verification-and-evidence`. A screenshot you have actually examined is
observed runtime behavior — the top of that hierarchy.

## When NOT to use this skill

- The change has no visual surface (logic, data, config, CLI text): use the
  per-change-type recipes in `bbb-verification-and-evidence`.
- You need the overall goal→action→check loop, not the visual check itself:
  see `bbb-eval-loop`; this skill supplies the "Check" step for visual work.

## The workflow

1. **Write acceptance criteria first.** Before rendering anything, list what
   must be true of the image. Concrete and checkable, one line each:

   | # | Criterion (example) | Pass = |
   |---|---|---|
   | 1 | Header renders with the page title text | Title text visible at top |
   | 2 | Chart appears below the header, not overlapping | Distinct vertical bands |
   | 3 | Dark mode: background dark, text readable | Re-shoot with `--dark` |
   | 4 | No horizontal scrollbar at 1280px width | Content fits viewport |

   Deciding criteria after looking at the image is how "looks fine to me"
   defects ship — you will rationalize what you see. This is the same
   pre-commitment rule as the acceptance-threshold discipline in
   `bbb-verification-and-evidence`.

2. **Render and capture.** Use the bundled script (details below):

   ```bash
   node .claude/skills/bbb-visual-self-check/scripts/screenshot.mjs page.html shot.png
   ```

3. **Read the image back.** Open/read the PNG with your image-capable file
   reader. Do not skip this: a script that exits 0 proves a file was written,
   not that the page rendered correctly (a blank white 12 KB PNG also exits 0).

4. **Compare per criterion, explicitly.** Walk the criteria table row by row
   and mark pass/fail against what is actually visible. Quote what you see
   ("header text 'Dashboard' visible; chart overlaps footer by ~40px — fail #2").

5. **Iterate or report.** Failures feed back into the loop (`bbb-eval-loop`):
   change one thing, re-shoot, re-compare. When all criteria pass, the
   screenshot plus the filled table IS the evidence for your report.

## The screenshot script

`scripts/screenshot.mjs` renders a URL or a local HTML file in headless
Chromium via Playwright and writes a PNG.

```bash
node scripts/screenshot.mjs <url-or-html-file> <output.png> [--full-page] [--viewport=WxH] [--dark]
```

- Local HTML paths are converted to `file://` URLs automatically.
- `--dark` renders with `prefers-color-scheme: dark` — shoot BOTH modes for
  anything theme-aware.
- `--viewport=WxH` (default 1280x800) — re-shoot at a narrow width (e.g.
  `--viewport=390x844`) when responsive layout is a criterion.
- `--full-page` captures beyond the viewport for long pages.

Verified invocation (run 2026-07-07 in this library's development environment):

```
$ node .claude/skills/bbb-visual-self-check/scripts/screenshot.mjs vtest.html vtest.png
WROTE /.../vtest.png (viewport 1280x800)
```

The resulting PNG was read back and visually confirmed (heading and body text
rendered on the expected background).

Requirements, checked in this order by the script itself:
1. The `playwright` (or `playwright-core`) npm package, resolvable from the
   target project's `node_modules` or from the global npm root.
2. A Chromium binary Playwright can find. In managed environments a browser is
   often preinstalled and exposed via the `PLAYWRIGHT_BROWSERS_PATH`
   environment variable; the script never downloads a browser and never runs
   `playwright install`. In your own environment, `npm i -D playwright` plus
   one manual `npx playwright install chromium` is the standard setup
   (unverified here — this environment had Chromium preinstalled).

Exit codes: `0` success, `1` bad arguments, `2` playwright package not found,
`3` browser launch failed, `4` page failed to render. Codes 2–4 print a
one-line fix hint.

## For apps that need a server

A `file://` URL only works for self-contained pages. For an app that must be
served: start the dev server in the background, wait for it to listen, then
screenshot the `http://localhost:<port>` URL. Kill the server afterwards.
Consult the target project's own run instructions (or its `run`-type skill)
for the correct start command — do not guess ports.

## Fallback hierarchy (no browser available)

Each step down is weaker evidence — say so in your report, in these words:

1. **Served-HTML inspection:** `curl -s http://localhost:<port>/ | grep -c "<selector-or-text>"`
   proves the server emits the expected markup, not that it renders correctly.
2. **Static-source inspection:** reading the HTML/CSS/JSX. This is reasoning,
   not observation. Label the visual claim "unverified — no browser in this
   environment".
3. **Never** silently substitute 1–2 for a screenshot when a browser exists.
   If the screenshot fails, report the failure and its exit code instead.

## Provenance and maintenance

- Authored 2026-07-07 for the Blue-Bubble-Buddy skill library (Orchestration
  pillar). The script was verified end-to-end that day: Node v22.22.2,
  Playwright 1.56.1 resolved from the global npm root, Chromium preinstalled
  under `PLAYWRIGHT_BROWSERS_PATH`; output PNG read back and confirmed.
- Volatile facts: Playwright's API (`chromium.launch`, `page.screenshot`) is
  stable across recent majors, but the resolution strategy and preinstalled
  browser paths are environment-specific.
- Re-verify in any environment with one line (expect `WROTE ...` and a nonzero
  PNG):
  `printf '<h1>t</h1>' > /tmp/t.html && node .claude/skills/bbb-visual-self-check/scripts/screenshot.mjs /tmp/t.html /tmp/t.png && ls -la /tmp/t.png`
- Re-verify playwright resolvability: `node -e "console.log(require.resolve('playwright'))"`
  from the target project root (exit 1 means install it or use the global root).
