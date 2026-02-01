/**
 * optimize-pdf.js — Post-process a fillable PDF for better scrolling performance
 *
 * Uses qpdf to linearize and compress the PDF. Linearization reorders the file
 * so PDF viewers can render pages incrementally without loading the entire
 * document upfront — this is the single biggest improvement for scroll performance.
 *
 * Can be used standalone:
 *   node optimize-pdf.js input.pdf output.pdf
 *
 * Or programmatically:
 *   const { optimizePdf } = require('./optimize-pdf');
 *   await optimizePdf('input.pdf', 'output.pdf');
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Optimize a PDF for viewing performance.
 *
 * @param {string} inputPath  — Path to the source PDF
 * @param {string} outputPath — Where to write the optimized PDF (can be same as input)
 */
function optimizePdf(inputPath, outputPath) {
  const resolvedIn = path.resolve(inputPath);
  const resolvedOut = path.resolve(outputPath);
  const sameFile = resolvedIn === resolvedOut;

  // If overwriting in place, write to a temp file first
  const tmpOut = sameFile
    ? resolvedOut + '.tmp'
    : resolvedOut;

  const beforeSize = fs.statSync(resolvedIn).size;

  console.log(`[optimize] Linearizing: ${resolvedIn}`);

  execFileSync('qpdf', [
    '--linearize',              // Reorder for progressive page rendering
    '--compress-streams=y',     // Compress all streams
    '--recompress-flate',       // Re-compress with better deflate settings
    '--object-streams=generate', // Pack objects into compressed object streams
    resolvedIn,
    tmpOut,
  ], { stdio: ['pipe', 'pipe', 'pipe'] });

  if (sameFile) {
    fs.renameSync(tmpOut, resolvedOut);
  }

  const afterSize = fs.statSync(resolvedOut).size;
  const pctChange = (((afterSize - beforeSize) / beforeSize) * 100).toFixed(1);
  const sign = afterSize <= beforeSize ? '' : '+';

  console.log(`[optimize] Done: ${(beforeSize / 1024 / 1024).toFixed(2)} MB → ${(afterSize / 1024 / 1024).toFixed(2)} MB (${sign}${pctChange}%)`);
  console.log(`[optimize] Output: ${resolvedOut}`);
}

// ─── CLI usage ───────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node optimize-pdf.js <input.pdf> [output.pdf]

If output is omitted, the input file is optimized in place.

Linearizes and compresses the PDF for faster scrolling in viewers.
Requires qpdf to be installed (apt install qpdf).
    `.trim());
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  const input = args[0];
  const output = args[1] || input;

  if (!fs.existsSync(input)) {
    console.error(`[optimize] File not found: ${input}`);
    process.exit(1);
  }

  optimizePdf(input, output);
}

module.exports = { optimizePdf };
