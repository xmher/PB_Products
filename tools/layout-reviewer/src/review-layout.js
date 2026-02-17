#!/usr/bin/env node

/**
 * review-layout.js — AI-powered visual layout reviewer for Paged.js HTML workbooks
 *
 * Loop:
 *   1. Render HTML in headless Chrome, wait for Paged.js
 *   2. Screenshot every page
 *   3. Tile pages into 2x2 spreads
 *   4. Send spreads + HTML source to Claude for design review
 *   5. Claude returns JSON edits (search/replace pairs)
 *   6. Apply edits to the HTML file
 *   7. Repeat until Claude says "LGTM" or max rounds reached
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node src/review-layout.js --input <html-file> [options]
 *
 * Options:
 *   --input     <path>   HTML file to review (required)
 *   --rounds    <num>    Max review rounds (default: 5)
 *   --pages     <range>  Only review these pages: "1-10", "5,8,12-15" (default: all)
 *   --spread    <num>    Pages per spread image: 2 or 4 (default: 4)
 *   --model     <id>     Claude model to use (default: claude-sonnet-4-5-20250929)
 *   --out       <dir>    Directory for screenshots/spreads (default: ./.layout-review)
 *   --verbose            Show full Claude responses
 *   --dry-run            Analyze only, don't apply edits
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    input: null,
    rounds: 5,
    pages: null,
    spread: 4,
    model: 'claude-sonnet-4-5-20250929',
    out: './.layout-review',
    verbose: false,
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--input':   args.input   = argv[++i]; break;
      case '--rounds':  args.rounds  = Number(argv[++i]); break;
      case '--pages':   args.pages   = argv[++i]; break;
      case '--spread':  args.spread  = Number(argv[++i]); break;
      case '--model':   args.model   = argv[++i]; break;
      case '--out':     args.out     = argv[++i]; break;
      case '--verbose': args.verbose = true; break;
      case '--dry-run': args.dryRun  = true; break;
      case '--help':
        console.log(`
Usage: ANTHROPIC_API_KEY=sk-... node src/review-layout.js --input <html> [options]

Options:
  --input     <path>   HTML file to review (required)
  --rounds    <num>    Max review rounds (default: 5)
  --pages     <range>  Pages to review: "1-10", "5,8,12-15" (default: all)
  --spread    <num>    Pages per spread: 2 or 4 (default: 4)
  --model     <id>     Claude model (default: claude-sonnet-4-5-20250929)
  --out       <dir>    Working directory for images (default: ./.layout-review)
  --verbose            Show full Claude responses
  --dry-run            Analyze only, don't apply edits
`);
        process.exit(0);
      default:
        console.error(`Unknown option: ${argv[i]}`);
        process.exit(1);
    }
  }

  if (!args.input) {
    console.error('Error: --input is required. Use --help for usage.');
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required.');
    process.exit(1);
  }

  return args;
}

// ---------------------------------------------------------------------------
// Step 1: Render HTML + screenshot each Paged.js page
// ---------------------------------------------------------------------------

async function screenshotPages(htmlPath, outputDir, opts) {
  const puppeteer = require('puppeteer');

  // Find Chrome
  const chromeCandidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);

  let chromePath = null;
  for (const p of chromeCandidates) {
    if (fs.existsSync(p)) { chromePath = p; break; }
  }

  const launchOpts = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  };
  if (chromePath) launchOpts.executablePath = chromePath;

  console.log('  Launching browser...');
  const browser = await puppeteer.launch(launchOpts);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    const fileUrl = 'file://' + path.resolve(htmlPath);
    console.log('  Loading HTML + waiting for Paged.js...');
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for Paged.js to finish rendering
    await page.waitForSelector('.pagedjs_page', { timeout: 30000 });
    // Give it extra time for complex layouts
    await new Promise(r => setTimeout(r, 3000));

    // Get all page elements
    const pageElements = await page.$$('.pagedjs_page');
    const totalPages = pageElements.length;
    console.log(`  Found ${totalPages} pages`);

    // Determine which pages to screenshot
    const wantedPages = opts.pages ? parsePageRange(opts.pages) : null;

    const screenshots = [];
    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      if (wantedPages && !wantedPages.has(pageNum)) continue;

      const screenshotPath = path.join(outputDir, `page-${String(pageNum).padStart(3, '0')}.png`);
      await pageElements[i].screenshot({ path: screenshotPath, type: 'png' });
      screenshots.push({ pageNum, path: screenshotPath });

      process.stdout.write(`\r  Screenshotting page ${pageNum}/${totalPages}`);
    }
    console.log('');

    return { screenshots, totalPages };
  } finally {
    await browser.close();
  }
}

function parsePageRange(rangeStr) {
  const pages = new Set();
  for (const part of rangeStr.split(',')) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [a, b] = trimmed.split('-').map(Number);
      for (let i = a; i <= b; i++) pages.add(i);
    } else {
      pages.add(Number(trimmed));
    }
  }
  return pages;
}

// ---------------------------------------------------------------------------
// Step 2: Tile pages into spread images
// ---------------------------------------------------------------------------

async function tileSpreads(screenshots, outputDir, pagesPerSpread) {
  const sharp = require('sharp');

  if (screenshots.length === 0) return [];

  // Read first image to get dimensions
  const firstMeta = await sharp(screenshots[0].path).metadata();
  const pageW = firstMeta.width;
  const pageH = firstMeta.height;

  const cols = pagesPerSpread === 2 ? 2 : 2;
  const rows = pagesPerSpread === 2 ? 1 : 2;
  const gap = 20;

  const spreadW = cols * pageW + (cols - 1) * gap;
  const spreadH = rows * pageH + (rows - 1) * gap;

  const spreads = [];

  for (let i = 0; i < screenshots.length; i += pagesPerSpread) {
    const batch = screenshots.slice(i, i + pagesPerSpread);
    const spreadNum = Math.floor(i / pagesPerSpread) + 1;
    const spreadPath = path.join(outputDir, `spread-${String(spreadNum).padStart(2, '0')}.png`);

    // Create composite
    const composites = batch.map((shot, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      return {
        input: shot.path,
        left: col * (pageW + gap),
        top: row * (pageH + gap),
      };
    });

    await sharp({
      create: {
        width: spreadW,
        height: spreadH,
        channels: 4,
        background: { r: 240, g: 240, b: 240, alpha: 1 },
      },
    })
      .composite(composites)
      .png({ quality: 85 })
      .toFile(spreadPath);

    const pageRange = batch.map(s => s.pageNum);
    spreads.push({
      path: spreadPath,
      pages: pageRange,
      label: `Pages ${pageRange[0]}-${pageRange[pageRange.length - 1]}`,
    });
  }

  // Downscale spreads if they're too large for the API (max ~20MB per image)
  for (const spread of spreads) {
    const stat = fs.statSync(spread.path);
    if (stat.size > 15 * 1024 * 1024) {
      const resized = spread.path.replace('.png', '-resized.png');
      await sharp(spread.path)
        .resize({ width: Math.round(spreadW * 0.6) })
        .png()
        .toFile(resized);
      fs.renameSync(resized, spread.path);
    }
  }

  console.log(`  Created ${spreads.length} spread images (${pagesPerSpread}-up)`);
  return spreads;
}

// ---------------------------------------------------------------------------
// Step 3: Send to Claude for design review
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an expert book designer and typographer reviewing a print-ready workbook/guide rendered with Paged.js. You're looking at tiled page spreads (multiple pages stitched together).

YOUR JOB: Look at every page carefully and identify visual layout problems. Then provide precise HTML edits to fix them.

## What to look for

**Page break problems:**
- Orphaned headings (heading at bottom of page, content on next page)
- Widows/orphans (single lines stranded at top/bottom of pages)
- Tables, boxes, or lists split awkwardly across pages
- Elements that start near the bottom with most of their content on the next page

**Awkward gaps and dead space:**
- Large blank areas at the bottom of pages (more than ~1.5 inches)
- Pages that are only 30-50% full when the next page starts a new section
- Uneven page density (one page crammed, next page sparse)

**For gaps and dead space, make CONTENT-AWARE decisions:**
- If there's a gap after a section about romance beats → add a relevant tip box, pull quote, or "try this" exercise
- If a page is sparse → consider whether content from the next page could be pulled up, or add a contextual decorative element
- If there's dead space in a workbook section → add an extra write space, reflection prompt, or quick-reference sidebar
- Use the guide's existing design vocabulary: .insight-box, .example-box, .pitfall-box, .romance-box, .fantasy-box, .quick-ref, .flourish-divider, .principle-card, .write-space, .write-space-sm, .write-space-lg, .hint

**Spacing/alignment issues:**
- Elements that feel too cramped or too spread out
- Inconsistent spacing between similar elements
- Content that overflows or gets clipped

## How to respond

First, give a brief analysis of what you see across all the spreads. Note which pages look good and which have issues.

Then provide your edits as a JSON array. Each edit is a search-and-replace pair on the HTML source:

\`\`\`json
[
  {
    "page": 5,
    "issue": "Large gap after beat tracker table — page is only 60% full",
    "fix": "Adding a 'Pro Tip' insight box about tracking beats across multiple reads",
    "old": "<exact HTML string to find>",
    "new": "<replacement HTML string>"
  }
]
\`\`\`

CRITICAL RULES:
- The "old" string must be an EXACT match of text in the HTML source (including whitespace/indentation)
- Keep edits minimal and surgical — don't rewrite large sections
- The "old" string must be unique in the file — include enough context for a unique match
- If a page looks fine, don't touch it
- When adding content boxes, match the existing style and tone of the guide
- If everything looks good, return an empty array: []
- When you see no more issues worth fixing, include "LGTM": true in your response

Return valid JSON only in the code block. Analysis text goes before the code block.`;

async function reviewWithClaude(spreads, htmlSource, model, round, totalRounds) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic();

  // Build message content: images + HTML source
  const content = [];

  content.push({
    type: 'text',
    text: `## Layout Review — Round ${round}/${totalRounds}\n\nBelow are the page spreads from the current render. After the images, you'll find the full HTML source.\n\nReview every spread for layout issues and return your edits.`,
  });

  // Add spread images
  for (const spread of spreads) {
    const imageData = fs.readFileSync(spread.path);
    const base64 = imageData.toString('base64');

    content.push({
      type: 'text',
      text: `\n### ${spread.label}`,
    });

    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: base64,
      },
    });
  }

  // Add HTML source
  content.push({
    type: 'text',
    text: `\n---\n\n## HTML Source (for making edits)\n\n\`\`\`html\n${htmlSource}\n\`\`\``,
  });

  console.log(`  Sending ${spreads.length} spreads + HTML to Claude (${model})...`);

  const response = await client.messages.create({
    model: model,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  });

  const responseText = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  return { responseText, usage: response.usage };
}

// ---------------------------------------------------------------------------
// Step 4: Parse and apply edits
// ---------------------------------------------------------------------------

function parseEdits(responseText) {
  // Extract JSON block from response
  const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) {
    console.log('  No JSON edit block found in response.');
    return { edits: [], lgtm: responseText.toLowerCase().includes('lgtm') };
  }

  try {
    const parsed = JSON.parse(jsonMatch[1]);

    // Check if it's the LGTM signal
    if (Array.isArray(parsed) && parsed.length === 0) {
      return { edits: [], lgtm: true };
    }

    // Could be an object with LGTM flag
    if (!Array.isArray(parsed) && parsed.LGTM) {
      return { edits: parsed.edits || [], lgtm: true };
    }

    return { edits: Array.isArray(parsed) ? parsed : [], lgtm: false };
  } catch (e) {
    console.log(`  Failed to parse edits JSON: ${e.message}`);
    return { edits: [], lgtm: false };
  }
}

function applyEdits(htmlPath, edits) {
  let html = fs.readFileSync(htmlPath, 'utf-8');
  let applied = 0;
  let failed = 0;

  for (const edit of edits) {
    if (!edit.old || !edit.new) {
      console.log(`  Skipping edit (missing old/new): ${edit.issue || 'unknown'}`);
      failed++;
      continue;
    }

    if (!html.includes(edit.old)) {
      console.log(`  MISS — could not find match for: "${edit.old.substring(0, 80)}..."`);
      failed++;
      continue;
    }

    // Check uniqueness
    const occurrences = html.split(edit.old).length - 1;
    if (occurrences > 1) {
      console.log(`  SKIP — "${edit.old.substring(0, 60)}..." matches ${occurrences} locations (ambiguous)`);
      failed++;
      continue;
    }

    html = html.replace(edit.old, edit.new);
    console.log(`  APPLIED — Page ${edit.page || '?'}: ${edit.issue || edit.fix || 'edit applied'}`);
    applied++;
  }

  if (applied > 0) {
    fs.writeFileSync(htmlPath, html, 'utf-8');
  }

  return { applied, failed };
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv);
  const htmlPath = path.resolve(args.input);
  const outputDir = path.resolve(args.out);

  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: file not found: ${htmlPath}`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  console.log('');
  console.log('=== Layout Reviewer ===');
  console.log(`Input:    ${htmlPath}`);
  console.log(`Model:    ${args.model}`);
  console.log(`Rounds:   up to ${args.rounds}`);
  console.log(`Spread:   ${args.spread}-up`);
  console.log(`Dry run:  ${args.dryRun}`);
  console.log('');

  for (let round = 1; round <= args.rounds; round++) {
    console.log(`\n--- Round ${round}/${args.rounds} ---\n`);

    // Clean output dir for this round
    const roundDir = path.join(outputDir, `round-${round}`);
    fs.mkdirSync(roundDir, { recursive: true });

    // 1. Screenshot
    console.log('[1/4] Rendering & screenshotting...');
    const { screenshots, totalPages } = await screenshotPages(htmlPath, roundDir, args);

    if (screenshots.length === 0) {
      console.log('No pages found. Check that the HTML uses Paged.js.');
      break;
    }

    // 2. Tile into spreads
    console.log('[2/4] Creating spread images...');
    const spreads = await tileSpreads(screenshots, roundDir, args.spread);

    // 3. Send to Claude
    console.log('[3/4] Sending to Claude for review...');
    const htmlSource = fs.readFileSync(htmlPath, 'utf-8');
    const { responseText, usage } = await reviewWithClaude(
      spreads, htmlSource, args.model, round, args.rounds
    );

    console.log(`  Tokens: ${usage.input_tokens} in / ${usage.output_tokens} out`);

    if (args.verbose) {
      console.log('\n--- Claude\'s response ---');
      console.log(responseText);
      console.log('--- End response ---\n');
    }

    // Save response for reference
    fs.writeFileSync(
      path.join(roundDir, 'claude-response.md'),
      responseText,
      'utf-8'
    );

    // 4. Parse and apply edits
    console.log('[4/4] Parsing edits...');
    const { edits, lgtm } = parseEdits(responseText);

    if (lgtm && edits.length === 0) {
      console.log('\n  Claude says: LGTM — layout looks good!');
      break;
    }

    console.log(`  Found ${edits.length} edit(s)`);

    if (edits.length === 0) {
      console.log('  No actionable edits. Stopping.');
      break;
    }

    if (args.dryRun) {
      console.log('  [dry-run] Edits NOT applied. See claude-response.md for details.');
      for (const edit of edits) {
        console.log(`    - Page ${edit.page || '?'}: ${edit.issue || edit.fix}`);
      }
      break;
    }

    // Back up before applying
    const backupPath = path.join(roundDir, `backup-round-${round}.html`);
    fs.copyFileSync(htmlPath, backupPath);

    const { applied, failed } = applyEdits(htmlPath, edits);
    console.log(`\n  Result: ${applied} applied, ${failed} failed`);

    if (applied === 0) {
      console.log('  No edits applied. Stopping to avoid infinite loop.');
      break;
    }

    // Brief summary
    const analysisLines = responseText.split('```')[0].trim();
    const summaryLines = analysisLines.split('\n').slice(0, 8).join('\n');
    console.log(`\n  Summary:\n${summaryLines}`);
  }

  console.log('\n=== Done ===');
  console.log(`Review artifacts saved in: ${outputDir}/`);
}

main().catch(err => {
  console.error('\n[layout-reviewer] Fatal error:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
