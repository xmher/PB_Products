#!/usr/bin/env node

/**
 * screenshot-pages.js — Screenshot every page of an HTML workbook as PNG/JPEG
 *
 * Cross-platform (Windows, macOS, Linux).
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
 * Mockup mode (for Etsy/marketplace listings):
 *   --mockup            Add padding + drop shadow for product mockup images
 *   --mockup-bg <hex>   Background color for mockup (default: #ede8e1)
 *   --mockup-padding <N> Padding in pixels (default: 80)
 *   --no-shadow         Disable drop shadow in mockup mode
 *
 * Prerequisites:
 *   Windows:  choco install wkhtmltopdf poppler imagemagick
 *   macOS:    brew install wkhtmltopdf poppler imagemagick
 *   Linux:    sudo apt install wkhtmltopdf poppler-utils imagemagick
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const IS_WIN = process.platform === 'win32';

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
    mockup: false,
    mockupBg: '#ede8e1',
    mockupPadding: 80,
    mockupShadow: true,
  };

  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--input':          args.input         = argv[++i]; break;
      case '--output':         args.output        = argv[++i]; break;
      case '--pages':          args.pages         = argv[++i]; break;
      case '--dpi':            args.dpi           = Number(argv[++i]); break;
      case '--format':         args.format        = argv[++i]; break;
      case '--timeout':        args.timeout       = Number(argv[++i]); break;
      case '--renderer':       args.renderer      = argv[++i]; break;
      case '--keep-pdf':       args.keepPdf       = true; break;
      case '--mockup':         args.mockup        = true; break;
      case '--mockup-bg':      args.mockupBg      = argv[++i]; break;
      case '--mockup-padding': args.mockupPadding = Number(argv[++i]); break;
      case '--no-shadow':      args.mockupShadow  = false; break;
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

Mockup mode (for Etsy/marketplace listings):
  --mockup            Shrink page + add padding & drop shadow for product mockups
  --mockup-bg <hex>   Background color (default: #ede8e1, warm neutral)
  --mockup-padding <N> Padding in pixels (default: 80)
  --no-shadow         Disable the drop shadow

Prerequisites (install any you don't have):
  Windows:  choco install wkhtmltopdf poppler imagemagick
  macOS:    brew install wkhtmltopdf poppler imagemagick
  Linux:    sudo apt install wkhtmltopdf poppler-utils imagemagick
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
// Cross-platform utilities
// ---------------------------------------------------------------------------

/**
 * Check if a binary is available on PATH.
 * Uses "where" on Windows, "which" on Unix.
 */
function hasBinary(name) {
  try {
    const cmd = IS_WIN ? 'where' : 'which';
    execSync(`${cmd} ${name}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Find the ImageMagick binary.
 * - IM7 (Windows default): "magick"
 * - IM6 (Linux default):   "convert"
 * On Windows, "convert" collides with a system utility, so always prefer "magick".
 */
function findMagickBinary() {
  if (hasBinary('magick')) return 'magick';
  if (!IS_WIN && hasBinary('convert')) return 'convert';
  return null;
}

/**
 * Run a command with array args via spawnSync. Cross-platform, no shell escaping needed.
 */
function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    stdio: opts.stdio || 'pipe',
    timeout: opts.timeout || 300000,
  });

  if (opts.allowFailure) return result;

  if (result.error) {
    throw new Error(`Failed to run ${cmd}: ${result.error.message}`);
  }
  if (result.status !== 0 && !opts.ignoreExit) {
    const stderr = result.stderr ? result.stderr.toString().trim() : '';
    throw new Error(`${cmd} exited with code ${result.status}${stderr ? ': ' + stderr : ''}`);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Step 1a: HTML → PDF via wkhtmltopdf (preferred)
// ---------------------------------------------------------------------------

function htmlToPdfWkhtml(htmlPath, pdfPath) {
  console.log(`[1/2] Rendering with wkhtmltopdf...`);

  const args = [
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
  spawnSync('wkhtmltopdf', args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 300000,
  });

  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size === 0) {
    throw new Error('wkhtmltopdf failed to produce a PDF. Check that the HTML file is valid.');
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

  // Auto-detect Chrome binary across platforms
  const chromeCandidates = [
    process.env.CHROME_PATH,
    // Windows
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe'),
    process.env['PROGRAMFILES(X86)'] && path.join(process.env['PROGRAMFILES(X86)'], 'Google/Chrome/Application/chrome.exe'),
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Linux
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
      'Error: pdftoppm not found. Install it:\n' +
      '  Windows:       choco install poppler\n' +
      '  macOS:         brew install poppler\n' +
      '  Ubuntu/Debian: sudo apt install poppler-utils'
    );
    process.exit(1);
  }

  const prefix = path.join(outputDir, 'page');
  const formatFlag = opts.format === 'jpeg' ? '-jpeg' : '-png';

  // Build args array (no shell escaping needed)
  const args = ['-r', String(opts.dpi), formatFlag];

  if (opts.pages) {
    const { first, last } = getPageBounds(opts.pages);
    if (first) args.push('-f', String(first));
    if (last) args.push('-l', String(last));
  }

  args.push(pdfPath, prefix);

  console.log(`[2/2] Converting PDF pages to ${opts.format.toUpperCase()} at ${opts.dpi} DPI...`);
  run('pdftoppm', args, { stdio: 'inherit' });

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
// Step 3 (optional): Mockup post-processing via ImageMagick
// ---------------------------------------------------------------------------

function applyMockup(outputDir, opts) {
  const magick = findMagickBinary();
  if (!magick) {
    console.error(
      'Error: ImageMagick not found. Install it:\n' +
      '  Windows:       choco install imagemagick\n' +
      '  macOS:         brew install imagemagick\n' +
      '  Ubuntu/Debian: sudo apt install imagemagick'
    );
    process.exit(1);
  }

  const ext = opts.format === 'jpeg' ? 'jpg' : 'png';
  const files = fs.readdirSync(outputDir)
    .filter(f => f.startsWith('page-') && f.endsWith(`.${ext}`))
    .sort();

  if (files.length === 0) return;

  const bg = opts.mockupBg;
  const pad = opts.mockupPadding;

  console.log(`[3/3] Applying mockup treatment (bg: ${bg}, padding: ${pad}px, shadow: ${opts.mockupShadow ? 'on' : 'off'})...`);

  let processed = 0;
  for (const file of files) {
    const filepath = path.join(outputDir, file);

    // Build ImageMagick args as an array — cross-platform, no shell escaping
    const args = [filepath];

    if (opts.mockupShadow) {
      // Clone the image, create a black shadow, then merge with background
      args.push(
        '(', '+clone', '-background', 'black', '-shadow', '40x12+0+6', ')',
        '+swap',
        '-background', bg,
        '-layers', 'merge', '+repage',
      );
    }

    // Add padding border around the result
    args.push(
      '-bordercolor', bg,
      '-border', String(pad),
      filepath,
    );

    // "magick" (IM7) is used directly; "convert" (IM6) is used directly too.
    // spawnSync with arg arrays avoids all shell escaping issues.
    const result = spawnSync(magick, args, { stdio: 'pipe', timeout: 30000 });
    if (result.status !== 0) {
      const stderr = result.stderr ? result.stderr.toString().trim() : '';
      console.error(`\nWarning: mockup failed for ${file}${stderr ? ': ' + stderr : ''}`);
      continue;
    }

    processed++;
    process.stdout.write(`\r[3/3] ${processed}/${files.length} — ${file}`);
  }

  console.log(`\n[3/3] Mockup applied to ${processed} images`);
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
  console.log(`DPI:    ${args.dpi}  |  Format: ${args.format}${args.pages ? '  |  Pages: ' + args.pages : ''}${args.mockup ? '  |  Mockup: on' : ''}`);
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

  // Step 3 (optional): Mockup post-processing
  if (args.mockup) {
    console.log('');
    applyMockup(outputDir, args);
  }

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
