#!/usr/bin/env node

/**
 * annotate-chapter-logs.js
 *
 * Annotation script for the Chapter Logs Supplement (LATEST version).
 * Reads chapter-logs-supplement-LATEST.html and adds data-field-name / data-field-type /
 * data-field-group attributes to every fillable element across 100 chapter logs.
 *
 * Each chapter contains:
 *   - contenteditable chapter-number div
 *   - 2 input[type="text"] for start/end page
 *   - 1 input[type="text"] for POV
 *   - 1 input[type="text"] for Location
 *   - 6 write-space-xs (job, summary, romance, plot_world, opening_hook, closing_hook)
 *   - 6 beat type checkboxes (Plot, Romance, World, Character, Action, Quiet)
 *   - 10 romance tension checkboxes (1-10)
 *   - 10 plot tension checkboxes (1-10)
 *   - 1 write-space-md (craft_move)
 *
 * Run: node annotate-chapter-logs.js
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, 'chapter-logs-supplement-LATEST.html');
const OUTPUT = path.resolve(__dirname, 'chapter-logs-supplement-LATEST-fillable.html');

// ─── Main Processing ──────────────────────────────────────────────

let html = fs.readFileSync(INPUT, 'utf8');
let fieldCount = 0;


// ═══════════════════════════════════════════════════════════════════
// CHAPTER LOGS (100 chapters, identical structure)
// ═══════════════════════════════════════════════════════════════════

for (let ch = 1; ch <= 100; ch++) {
  const chStart = html.indexOf(`id="chapter-${ch}"`);
  if (chStart === -1) continue;

  // Find the end of this chapter block
  let chEnd;
  if (ch < 100) {
    chEnd = html.indexOf(`id="chapter-${ch + 1}"`);
  } else {
    // After chapter 100, find end of file (</body>)
    chEnd = html.indexOf('</body>', chStart);
  }
  if (chEnd === -1) chEnd = html.length;

  const blockStart = html.lastIndexOf('<div class="chapter-log"', chStart);
  const actualStart = blockStart !== -1 ? blockStart : chStart;
  const actualEnd = html.lastIndexOf('<div class="chapter-log"', chEnd);
  const endPos = actualEnd > actualStart ? actualEnd : chEnd;

  let block = html.substring(actualStart, endPos);
  const prefix = `ch${ch}`;

  // 1. Chapter number (contenteditable div)
  block = block.replace(
    /<div class="chapter-number" contenteditable="true">(Chapter \d+)<\/div>/,
    (match, text) => {
      fieldCount++;
      return `<div class="chapter-number" contenteditable="true" data-field-name="${prefix}_title" data-field-type="text">${text}</div>`;
    }
  );

  // 2. Header input fields: Start page, End page, POV, Location
  const headerInputNames = [`${prefix}_pages_start`, `${prefix}_pages_end`, `${prefix}_pov`, `${prefix}_location`];
  let headerIdx = 0;

  const headerStart = block.indexOf('class="chapter-log-header"');
  if (headerStart !== -1) {
    // Find the closing </div> of the chapter-log-header
    // The header has 3 child divs, so we need to find the right closing tag
    const headerOpenEnd = block.indexOf('>', headerStart) + 1;
    // Find the end: after "Location:" input and its parent </div> and the header </div>
    const locationIdx = block.indexOf('Location:', headerStart);
    const headerEndPos = locationIdx !== -1
      ? block.indexOf('</div>', block.indexOf('</div>', locationIdx) + 1) + 6
      : block.indexOf('</div>', headerStart + 200) + 6;

    let headerSection = block.substring(headerStart, headerEndPos);

    headerSection = headerSection.replace(
      /<input type="text">/g,
      (match) => {
        if (headerIdx < headerInputNames.length) {
          fieldCount++;
          return `<input type="text" data-field-name="${headerInputNames[headerIdx++]}" data-field-type="text">`;
        }
        return match;
      }
    );

    block = block.substring(0, headerStart) + headerSection + block.substring(headerEndPos);
  }

  // 3. Beat type checkboxes (Plot, Romance, World, Character, Action, Quiet)
  const beatNames = ['plot', 'romance', 'world', 'character', 'action', 'quiet'];
  let beatIdx = 0;
  const beatChecklistRegex = /<ul class="checklist"[^>]*>([\s\S]*?)<\/ul>/;
  block = block.replace(beatChecklistRegex, (ulMatch) => {
    return ulMatch.replace(
      /<li><label><input type="checkbox"> (\w+)<\/label><\/li>/g,
      (liMatch, text) => {
        if (beatIdx < beatNames.length) {
          fieldCount++;
          return `<li data-field-name="${prefix}_beat_${beatNames[beatIdx++]}" data-field-type="checkbox"><label><input type="checkbox"> ${text}</label></li>`;
        }
        return liMatch;
      }
    );
  });

  // 4. Tension scales — Romance and Plot (1-10 checkboxes)
  // Romance tension
  const romTensionStart = block.indexOf('<span class="tension-label">Romance:</span>');
  if (romTensionStart !== -1) {
    const romTensionEnd = block.indexOf('</div></div>', romTensionStart) + 12;
    let romSection = block.substring(romTensionStart, romTensionEnd);
    romSection = romSection.replace(
      /<label><input type="checkbox"> <span>(\d+)<\/span><\/label>/g,
      (match, digit) => {
        fieldCount++;
        return `<label><input type="checkbox" data-field-name="${prefix}_tension_romance_${digit}" data-field-type="radio" data-field-group="${prefix}_tension_romance"> <span>${digit}</span></label>`;
      }
    );
    block = block.substring(0, romTensionStart) + romSection + block.substring(romTensionEnd);
  }

  // Plot tension
  const plotTensionStart = block.indexOf('<span class="tension-label">Plot:</span>');
  if (plotTensionStart !== -1) {
    const plotTensionEnd = block.indexOf('</div></div>', plotTensionStart) + 12;
    let plotSection = block.substring(plotTensionStart, plotTensionEnd);
    plotSection = plotSection.replace(
      /<label><input type="checkbox"> <span>(\d+)<\/span><\/label>/g,
      (match, digit) => {
        fieldCount++;
        return `<label><input type="checkbox" data-field-name="${prefix}_tension_plot_${digit}" data-field-type="radio" data-field-group="${prefix}_tension_plot"> <span>${digit}</span></label>`;
      }
    );
    block = block.substring(0, plotTensionStart) + plotSection + block.substring(plotTensionEnd);
  }

  // 5. Write-space-xs (job, summary, romance, plot_world, opening_hook, closing_hook)
  const writeSpaceNames = [
    `${prefix}_job`, `${prefix}_summary`,
    `${prefix}_romance_shift`, `${prefix}_plot_world`,
    `${prefix}_opening_hook`, `${prefix}_closing_hook`
  ];
  let wsIdx = 0;
  block = block.replace(
    /<div class="write-space-xs" contenteditable="true"><\/div>/g,
    (match) => {
      if (wsIdx < writeSpaceNames.length) {
        fieldCount++;
        return `<div class="write-space-xs" contenteditable="true" data-field-name="${writeSpaceNames[wsIdx++]}" data-field-type="textarea"></div>`;
      }
      return match;
    }
  );

  // 6. Write-space-md (craft_move)
  block = block.replace(
    /<div class="write-space-md" contenteditable="true"><\/div>/,
    (match) => {
      fieldCount++;
      return `<div class="write-space-md" contenteditable="true" data-field-name="${prefix}_craft_move" data-field-type="textarea"></div>`;
    }
  );

  html = html.substring(0, actualStart) + block + html.substring(endPos);
}


// ─── Write output ─────────────────────────────────────────────────

fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`\nAnnotation complete!`);
console.log(`  Input:  ${INPUT}`);
console.log(`  Output: ${OUTPUT}`);
console.log(`  Fields annotated: ${fieldCount}`);
console.log(`\nNext step: run the pipeline`);
console.log(`  node tools/fillable-pdf/src/generate.js \\`);
console.log(`    --input romantasy-analysis-guide/printable/chapter-logs-supplement-LATEST-fillable.html \\`);
console.log(`    --output romantasy-analysis-guide/printable/Chapter-Logs-Supplement-FILLABLE.pdf`);
