#!/usr/bin/env node
// screenshot.mjs — render a URL or a local HTML file in headless Chromium and save a PNG.
//
// Usage:
//   node screenshot.mjs <url-or-html-file> <output.png> [--full-page] [--viewport=WxH] [--dark]
//
// Examples:
//   node screenshot.mjs page.html shot.png
//   node screenshot.mjs http://localhost:3000 shot.png --full-page
//   node screenshot.mjs dashboard.html dark.png --dark --viewport=1440x900
//
// Requirements: the `playwright` (or `playwright-core`) npm package resolvable either
// from the current project's node_modules or from the global npm root, plus a
// Chromium binary Playwright can find (e.g. via PLAYWRIGHT_BROWSERS_PATH).
// This script NEVER downloads a browser and NEVER runs `playwright install`.

import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function usage() {
  console.error('Usage: node screenshot.mjs <url-or-html-file> <output.png> [--full-page] [--viewport=WxH] [--dark]');
}

async function loadChromium() {
  // Strategy 1: resolve from the current working directory (target project's
  // node_modules) or from next to this script. Strategy 2: the global npm root
  // (covers environments where playwright is installed with `npm i -g`).
  const anchors = [
    path.join(process.cwd(), 'noop.js'),
    new URL('noop.js', import.meta.url).pathname,
  ];
  try {
    const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
    anchors.push(path.join(globalRoot, 'noop.js'));
  } catch {
    // npm not available; local resolution may still succeed.
  }
  for (const anchor of anchors) {
    const req = createRequire(anchor);
    for (const pkg of ['playwright', 'playwright-core']) {
      try {
        return req(pkg).chromium;
      } catch {
        // try next candidate
      }
    }
  }
  console.error('ERROR: cannot resolve the "playwright" package (tried local node_modules and the global npm root).');
  console.error('Fix: run from a project that has playwright installed, or install it globally (npm i -g playwright).');
  process.exit(2);
}

// ---- parse arguments ----
const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flags = args.filter((a) => a.startsWith('--'));
if (positional.length !== 2) {
  usage();
  process.exit(1);
}
const [target, outPath] = positional;
let viewport = { width: 1280, height: 800 };
let fullPage = false;
let dark = false;
for (const f of flags) {
  if (f === '--full-page') fullPage = true;
  else if (f === '--dark') dark = true;
  else if (f.startsWith('--viewport=')) {
    const m = f.slice('--viewport='.length).match(/^(\d+)x(\d+)$/);
    if (!m) {
      console.error(`ERROR: bad viewport "${f}", expected --viewport=WxH (e.g. --viewport=1280x800)`);
      process.exit(1);
    }
    viewport = { width: Number(m[1]), height: Number(m[2]) };
  } else {
    console.error(`ERROR: unknown flag ${f}`);
    usage();
    process.exit(1);
  }
}

// ---- resolve target to a URL (plain HTML files become file:// URLs) ----
let url;
if (/^(https?|file):\/\//i.test(target)) {
  url = target;
} else {
  const abs = path.resolve(target);
  if (!existsSync(abs)) {
    console.error(`ERROR: local file not found: ${abs}`);
    process.exit(1);
  }
  url = pathToFileURL(abs).href;
}

// ---- render and screenshot ----
const chromium = await loadChromium();
let browser;
try {
  browser = await chromium.launch(); // headless by default; no download is ever attempted at launch
} catch (err) {
  console.error('ERROR: could not launch Chromium.');
  console.error(String(err.message || err).split('\n')[0]);
  console.error('If the browser binary is missing, point PLAYWRIGHT_BROWSERS_PATH at a preinstalled browsers directory.');
  process.exit(3);
}
try {
  const context = await browser.newContext({ viewport, colorScheme: dark ? 'dark' : 'light' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(250); // let fonts and immediate post-load JS paint settle
  await page.screenshot({ path: outPath, fullPage });
  console.log(`WROTE ${path.resolve(outPath)} (viewport ${viewport.width}x${viewport.height}${fullPage ? ', full-page' : ''}${dark ? ', dark' : ''})`);
} catch (err) {
  console.error(`ERROR: failed to render ${url}`);
  console.error(String(err.message || err).split('\n')[0]);
  process.exit(4);
} finally {
  await browser.close();
}
