#!/usr/bin/env node

/**
 * screenshot-pages.js — Screenshot every page of an HTML workbook as PNG/JPEG
 *
 * Pipeline:
 *   1. Render the HTML workbook to a multi-page PDF
 *      - Primary: wkhtmltopdf (reliable, handles @page CSS natively)
 *      - Fallback: Puppeteer + Chrome (if wkhtmltopdf not installed)
 *   2. Convert each PDF page to a high-res image via pdftoppm
 *
 * Usage:
 *   node screenshot-pages.js --input <html-file> --output <dir> [options]
 *
 * Options:
 *   --input    <path>   Path to the HTML workbook (required)
 *   --output   <dir>    Output directory for images (default: ./screenshots)
 *   --pages    <range>  Pages to capture: "1-5", "3", "1,4,7-10" (default: all)
 *   --dpi      <num>    Image resolution in DPI (default: 200)
 *   --format   <fmt>    Image format: png or jpeg (default: png)
 *   --timeout  <ms>     Max wait for rendering in ms (default: 120000)
 *   --renderer <name>   Force renderer: "wkhtmltopdf" or "puppeteer" (default: auto)
 *   --keep-pdf          Keep the intermediate PDF file
 *
 * Prerequisites:
 *   - pdftoppm (from poppler-utils): sudo apt install poppler-utils / brew install poppler
 *   - wkhtmltopdf (recommended): sudo apt install wkhtmltopdf / brew install wkhtmltopdf
 *   - OR puppeteer + Chrome (fallback): npm install puppeteer
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    input: null,
    output: './screenshots',
    pages: null,
    dpi: 200,
    format: 'png',
    timeout: 120000,
    renderer: 'auto',
    keepPdf: false,
  };

  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--input':    args.input    = argv[++i]; break;
      case '--output':   args.output   = argv[++i]; break;
      case '--pages':    args.pages    = argv[++i]; break;
      case '--dpi':      args.dpi      = Number(argv[++i]); break;
      case '--format':   args.format   = argv[++i]; break;
      case '--timeout':  args.timeout  = Number(argv[++i]); break;
      case '--renderer': args.renderer = argv[++i]; break;
      case '--keep-pdf': args.keepPdf  = true; break;
      case '--help':
        console.log(`
Usage: node screenshot-pages.js --input <html> --output <dir> [options]

Screenshots every page of a Paged.js / @page CSS workbook as individual images.

Options:
  --input    <path>   Path to the HTML workbook (required)
  --output   <dir>    Output directory for images (default: ./screenshots)
  --pages    <range>  Pages to capture: "1-5", "3", "1,4,7-10" (default: all)
  --dpi      <num>    Image resolution in DPI (default: 200)
  --format   <fmt>    png or jpeg (default: png)
  --timeout  <ms>     Max ms for rendering (default: 120000)
  --renderer <name>   Force: "wkhtmltopdf" or "puppeteer" (default: auto-detect)
  --keep-pdf          Keep the intermediate PDF file

Prerequisites:
  pdftoppm  — sudo apt install poppler-utils  /  brew install poppler
  wkhtmltopdf (recommended) — sudo apt install wkhtmltopdf  /  brew install wkhtmltopdf
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

  return args;
}

// ---------------------------------------------------------------------------
// Utility: check if a binary is available
// ---------------------------------------------------------------------------

function hasBinary(name) {
  try {
    execSync(`which ${name}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Step 1a: HTML → PDF via wkhtmltopdf (preferred)
// ---------------------------------------------------------------------------

function htmlToPdfWkhtml(htmlPath, pdfPath) {
  console.log(`[1/2] Rendering with wkhtmltopdf...`);

  const args = [
    'wkhtmltopdf',
    '--page-size', 'Letter',
    '--enable-local-file-access',
    '--no-stop-slow-scripts',
    '--javascript-delay', '2000',
    '--load-error-handling', 'ignore',
    '--load-media-error-handling', 'ignore',
    '--quiet',
    htmlPath,
    pdfPath,
  ];

  // wkhtmltopdf exits 1 on network errors (fonts) even when it produces valid output
  const result = spawnSync(args[0], args.slice(1), {
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 300000,
  });

  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size === 0) {
    const stderr = result.stderr ? result.stderr.toString() : '';
    throw new Error(`wkhtmltopdf failed to produce PDF.\n${stderr}`);
  }

  const sizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2);
  console.log(`[1/2] PDF created (${sizeMB} MB)`);
}

// ---------------------------------------------------------------------------
// Step 1b: HTML → PDF via Puppeteer (fallback)
// ---------------------------------------------------------------------------

async function htmlToPdfPuppeteer(htmlPath, pdfPath, opts) {
  console.log(`[1/2] Rendering with Puppeteer...`);

  const puppeteer = require('puppeteer');

  // Auto-detect Chrome binary
  const chromeCandidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);

  let chromePath = null;
  for (const p of chromeCandidates) {
    if (fs.existsSync(p)) { chromePath = p; break; }
  }

  const launchOpts = {
    headless: true,
    protocolTimeout: opts.timeout * 3,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  };
  if (chromePath) launchOpts.executablePath = chromePath;

  const browser = await puppeteer.launch(launchOpts);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Block Paged.js (Chrome's native @page CSS handles print pagination)
    // and stub failed font requests to prevent hangs.
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('paged') && url.includes('unpkg.com')) {
        request.respond({
          status: 200,
          contentType: 'application/javascript',
          body: '/* Paged.js skipped — Chrome native print used */',
        });
      } else if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        request.respond({ status: 200, contentType: 'text/css', body: '/* offline */' });
      } else {
        request.continue();
      }
    });

    const fileUrl = 'file://' + htmlPath;
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: opts.timeout });

    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
    });

    const sizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2);
    console.log(`[1/2] PDF created (${sizeMB} MB)`);
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// Step 2: PDF → per-page images via pdftoppm
// ---------------------------------------------------------------------------

function pdfToImages(pdfPath, outputDir, opts) {
  if (!hasBinary('pdftoppm')) {
    console.error(
      'Error: pdftoppm not found. Install it with:\n' +
      '  Ubuntu/Debian: sudo apt-get install poppler-utils\n' +
      '  macOS:         brew install poppler'
    );
    process.exit(1);
  }

  const prefix = path.join(outputDir, 'page');
  const formatFlag = opts.format === 'jpeg' ? '-jpeg' : '-png';

  const cmdParts = ['pdftoppm', `-r ${opts.dpi}`, formatFlag];

  if (opts.pages) {
    const { first, last } = getPageBounds(opts.pages);
    if (first) cmdParts.push(`-f ${first}`);
    if (last) cmdParts.push(`-l ${last}`);
  }

  cmdParts.push(`"${pdfPath}"`, `"${prefix}"`);

  console.log(`[2/2] Converting PDF pages to ${opts.format.toUpperCase()} at ${opts.dpi} DPI...`);
  execSync(cmdParts.join(' '), { stdio: 'inherit', timeout: 300000 });

  // Remove unwanted pages for non-contiguous selections like "1,3,7"
  if (opts.pages && opts.pages.includes(',')) {
    pruneUnwantedPages(outputDir, opts);
  }

  // Count and report results
  const ext = opts.format === 'jpeg' ? 'jpg' : 'png';
  const files = fs.readdirSync(outputDir)
    .filter(f => f.startsWith('page-') && f.endsWith(`.${ext}`))
    .sort();

  console.log(`[2/2] Done! ${files.length} screenshots saved to ${outputDir}/`);
  if (files.length > 0) {
    console.log(`      ${files[0]} ... ${files[files.length - 1]}`);
  }
}

function getPageBounds(rangeStr) {
  const numbers = [];
  for (const part of rangeStr.split(',')) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [a, b] = trimmed.split('-').map(Number);
      numbers.push(a, b);
    } else {
      numbers.push(Number(trimmed));
    }
  }
  return { first: Math.min(...numbers), last: Math.max(...numbers) };
}

function pruneUnwantedPages(outputDir, opts) {
  const wanted = new Set();
  for (const part of opts.pages.split(',')) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [a, b] = trimmed.split('-').map(Number);
      for (let i = a; i <= b; i++) wanted.add(i);
    } else {
      wanted.add(Number(trimmed));
    }
  }

  const ext = opts.format === 'jpeg' ? 'jpg' : 'png';
  const files = fs.readdirSync(outputDir).filter(f => f.startsWith('page-') && f.endsWith(`.${ext}`));

  for (const file of files) {
    const match = file.match(/page-(\d+)/);
    if (match) {
      const pageNum = parseInt(match[1], 10);
      if (!wanted.has(pageNum)) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv);
  const htmlPath = path.resolve(args.input);
  const outputDir = path.resolve(args.output);

  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: HTML file not found: ${htmlPath}`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Input:  ${htmlPath}`);
  console.log(`Output: ${outputDir}/`);
  console.log(`DPI:    ${args.dpi}  |  Format: ${args.format}${args.pages ? '  |  Pages: ' + args.pages : ''}`);
  console.log('');

  // Determine renderer
  let renderer = args.renderer;
  if (renderer === 'auto') {
    renderer = hasBinary('wkhtmltopdf') ? 'wkhtmltopdf' : 'puppeteer';
  }

  // Step 1: HTML → PDF
  const tmpPdf = path.join(os.tmpdir(), `workbook-${Date.now()}.pdf`);
  if (renderer === 'wkhtmltopdf') {
    htmlToPdfWkhtml(htmlPath, tmpPdf);
  } else {
    await htmlToPdfPuppeteer(htmlPath, tmpPdf, args);
  }

  console.log('');

  // Step 2: PDF → images
  pdfToImages(tmpPdf, outputDir, args);

  // Cleanup
  if (!args.keepPdf) {
    fs.unlinkSync(tmpPdf);
  } else {
    console.log(`\nIntermediate PDF kept at: ${tmpPdf}`);
  }
}

main().catch(err => {
  console.error('\n[screenshot] Fatal error:', err.message);
  process.exit(1);
});
