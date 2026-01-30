#!/usr/bin/env node

/**
 * generate.js — Main orchestrator for the fillable PDF pipeline
 *
 * Usage:
 *   node generate.js --input <html-file> --output <fillable-pdf> [options]
 *
 * Options:
 *   --input, -i     Path to the HTML file with data-field-* attributes (required)
 *   --output, -o    Path for the output fillable PDF (required)
 *   --flat-pdf      Path for the intermediate flat PDF (default: auto-generated)
 *   --fields-json   Path to save/load the field coordinates JSON (default: auto-generated)
 *   --chrome        Path to Chrome/Chromium binary (default: auto-detect)
 *   --font-size     Default font size for text fields (default: 10)
 *   --skip-extract  Skip extraction, reuse existing fields JSON
 *   --skip-pdf      Skip flat PDF generation, reuse existing flat PDF
 *   --timeout       Max ms to wait for Paged.js render (default: 120000)
 *
 * REUSABLE: Point this at any HTML file with data-field-name attributes.
 *
 * Pipeline:
 *   1. Open HTML in Puppeteer → Paged.js renders → extract field coordinates
 *   2. Generate flat PDF from the same render
 *   3. Inject AcroForm fields into the flat PDF at extracted coordinates
 *   4. Output optimized fillable PDF
 */

const path = require('path');
const fs = require('fs');
const { extractFields, generateFlatPdf } = require('./extract-fields');
const { addFields } = require('./add-fields');

// ─── Argument parsing ───────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--input': case '-i':
        args.input = argv[++i]; break;
      case '--output': case '-o':
        args.output = argv[++i]; break;
      case '--flat-pdf':
        args.flatPdf = argv[++i]; break;
      case '--fields-json':
        args.fieldsJson = argv[++i]; break;
      case '--chrome':
        args.chrome = argv[++i]; break;
      case '--font-size':
        args.fontSize = parseInt(argv[++i], 10); break;
      case '--skip-extract':
        args.skipExtract = true; break;
      case '--skip-pdf':
        args.skipPdf = true; break;
      case '--timeout':
        args.timeout = parseInt(argv[++i], 10); break;
      case '--help': case '-h':
        printUsage(); process.exit(0);
      default:
        console.error(`Unknown argument: ${arg}`);
        printUsage(); process.exit(1);
    }
  }
  return args;
}

function printUsage() {
  console.log(`
fillable-pdf — Generate optimized fillable PDFs from HTML templates

Usage:
  node generate.js --input <html-file> --output <fillable-pdf>

Options:
  --input, -i     HTML file with data-field-* attributes (required)
  --output, -o    Output fillable PDF path (required)
  --flat-pdf      Intermediate flat PDF path (default: <output-dir>/flat-<name>.pdf)
  --fields-json   Field coordinates JSON path (default: <output-dir>/fields-<name>.json)
  --chrome        Chrome/Chromium binary path (default: auto-detect)
  --font-size     Default font size for text fields (default: 10)
  --skip-extract  Reuse existing fields JSON (skip Puppeteer extraction)
  --skip-pdf      Reuse existing flat PDF (skip Puppeteer PDF generation)
  --timeout       Max ms for Paged.js render (default: 120000)

HTML markup convention:
  <div data-field-name="unique_id" data-field-type="textarea">...</div>
  <span data-field-name="name" data-field-type="text">...</span>
  <li data-field-name="check1" data-field-type="checkbox">...</li>
  <span data-field-name="opt1" data-field-type="radio" data-field-group="group1">...</span>

Field types: text, textarea, checkbox, radio
  `.trim());
}

// ─── Chrome auto-detection ──────────────────────────────────────────

function findChrome() {
  const candidates = [
    // Playwright's bundled Chromium (common in CI/dev environments)
    ...findPlaywrightChrome(),
    // Standard locations
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log(`[chrome] Found: ${p}`);
      return p;
    }
  }
  return null; // Let Puppeteer try its default
}

function findPlaywrightChrome() {
  const cacheDir = path.join(process.env.HOME || '/root', '.cache', 'ms-playwright');
  if (!fs.existsSync(cacheDir)) return [];

  try {
    const entries = fs.readdirSync(cacheDir)
      .filter(e => e.startsWith('chromium'))
      .sort()
      .reverse(); // Latest version first

    return entries.map(e =>
      path.join(cacheDir, e, 'chrome-linux', 'chrome')
    );
  } catch {
    return [];
  }
}

// ─── Main pipeline ──────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  if (!args.input || !args.output) {
    console.error('Error: --input and --output are required');
    printUsage();
    process.exit(1);
  }

  const inputPath = path.resolve(args.input);
  const outputPath = path.resolve(args.output);
  const outputDir = path.dirname(outputPath);
  const baseName = path.basename(outputPath, '.pdf');

  const flatPdfPath = args.flatPdf
    ? path.resolve(args.flatPdf)
    : path.join(outputDir, `flat-${baseName}.pdf`);

  const fieldsJsonPath = args.fieldsJson
    ? path.resolve(args.fieldsJson)
    : path.join(outputDir, `fields-${baseName}.json`);

  const chromePath = args.chrome || findChrome();
  const fontSize = args.fontSize || 10;
  const timeout = args.timeout || 120000;

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║          FILLABLE PDF GENERATION PIPELINE               ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  Input HTML:   ${inputPath}`);
  console.log(`  Flat PDF:     ${flatPdfPath}`);
  console.log(`  Fields JSON:  ${fieldsJsonPath}`);
  console.log(`  Output:       ${outputPath}`);
  console.log(`  Chrome:       ${chromePath || '(puppeteer default)'}`);
  console.log(`  Font size:    ${fontSize}`);
  console.log('');

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // ── Step 1: Extract field coordinates ───────────────────────────
  let fieldData;

  if (args.skipExtract && fs.existsSync(fieldsJsonPath)) {
    console.log('── Step 1: SKIPPED (reusing existing fields JSON) ──');
    fieldData = JSON.parse(fs.readFileSync(fieldsJsonPath, 'utf8'));
    console.log(`  Loaded ${fieldData.fields.length} fields from JSON`);
  } else {
    console.log('── Step 1: Extracting field coordinates ──');
    fieldData = await extractFields(inputPath, { chromePath, timeout });
    fs.writeFileSync(fieldsJsonPath, JSON.stringify(fieldData, null, 2));
    console.log(`  Saved field data to ${fieldsJsonPath}`);
  }

  console.log('');

  // ── Step 2: Generate flat PDF ───────────────────────────────────
  if (args.skipPdf && fs.existsSync(flatPdfPath)) {
    console.log('── Step 2: SKIPPED (reusing existing flat PDF) ──');
  } else {
    console.log('── Step 2: Generating flat PDF ──');
    await generateFlatPdf(inputPath, flatPdfPath, { chromePath, timeout });
  }

  console.log('');

  // ── Step 3: Inject AcroForm fields ──────────────────────────────
  console.log('── Step 3: Injecting AcroForm fields ──');
  await addFields(flatPdfPath, fieldData.fields, outputPath, { fontSize });

  console.log('');

  // ── Summary ─────────────────────────────────────────────────────
  const flatSize = fs.statSync(flatPdfPath).size;
  const fillableSize = fs.statSync(outputPath).size;

  console.log('══════════════════════════════════════════════════════════');
  console.log('  DONE!');
  console.log(`  Flat PDF:     ${(flatSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Fillable PDF: ${(fillableSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Fields added: ${fieldData.fields.length}`);
  console.log(`  Pages:        ${fieldData.pageCount}`);
  console.log('══════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('\n[FATAL]', err);
  process.exit(1);
});
