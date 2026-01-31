#!/usr/bin/env node

/**
 * annotate-romantasy-guide.js
 *
 * Project-specific annotation script for the Romantasy Analysis Guide.
 * Reads the HTML file and adds data-field-name / data-field-type / data-field-group
 * attributes to every element that should become a fillable PDF field.
 *
 * This is the project-specific part of the pipeline.
 * For other projects, write a similar script tailored to your HTML structure.
 *
 * Run: node annotate-romantasy-guide.js
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, 'romantasy-analysis-guide.html');
const OUTPUT = path.resolve(__dirname, 'romantasy-analysis-guide-fillable.html');

// ─── Utility ──────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 40);
}

// Add data-field attributes to an opening tag
function addFieldAttrs(tag, name, type, group) {
  const attrs = `data-field-name="${name}" data-field-type="${type}"`;
  const groupAttr = group ? ` data-field-group="${group}"` : '';
  // Insert before the closing > of the opening tag
  // Handle self-closing tags and tags with existing attributes
  if (tag.endsWith('/>')) {
    return tag.slice(0, -2) + ` ${attrs}${groupAttr} />`;
  }
  return tag.replace(/>/, ` ${attrs}${groupAttr}>`);
}

// ─── Main Processing ──────────────────────────────────────────────

let html = fs.readFileSync(INPUT, 'utf8');
let fieldCount = 0;

// ═══════════════════════════════════════════════════════════════════
// SECTION 1: PRE-READ SETUP (Book Metadata, Tropes, Expectations)
// ═══════════════════════════════════════════════════════════════════

// Book Metadata field-value spans (between "Book Metadata" and "Expected Heat Level")
const preReadLabels = ['title', 'author', 'series', 'pub_year', 'page_count', 'subgenre'];
let preReadIdx = 0;
// Find field-value spans in the pre-read section (lines ~1204-1227)
html = html.replace(
  /(<div class="field-row">\s*<span class="field-label">(?:Title|Author|Series & Book #|Publication Year|Page Count|Subgenre):<\/span>\s*<span class="field-value")(\s*><\/span>)/g,
  (match, before, after) => {
    const name = `pre_${preReadLabels[preReadIdx++]}`;
    fieldCount++;
    return `${before} data-field-name="${name}" data-field-type="text"${after}`;
  }
);

// Heat Level rating circles → radio buttons (scoped to pre-read section only)
// There are multiple rating-scale sections; handle each with unique names
{
  const heatStart = html.indexOf('Expected Heat Level');
  const heatEnd = html.indexOf('Anticipated Tropes');
  if (heatStart !== -1 && heatEnd !== -1) {
    let heatSection = html.substring(heatStart, heatEnd);
    heatSection = heatSection.replace(
      /<span class="rating-circle">(\d)<\/span>/g,
      (match, digit) => {
        fieldCount++;
        return `<span class="rating-circle" data-field-name="pre_heat_${digit}" data-field-type="radio" data-field-group="pre_heat">${digit}</span>`;
      }
    );
    html = html.substring(0, heatStart) + heatSection + html.substring(heatEnd);
  }

  // Mirror effect rating in dual-arc section
  const mirrorStart = html.indexOf('How strong is the mirror effect');
  if (mirrorStart !== -1) {
    const mirrorEnd = html.indexOf('</div>', html.indexOf('rating-scale', mirrorStart) + 10);
    if (mirrorEnd !== -1) {
      let mirrorSection = html.substring(mirrorStart, mirrorEnd + 6);
      mirrorSection = mirrorSection.replace(
        /<span class="rating-circle">(\d)<\/span>/g,
        (match, digit) => {
          fieldCount++;
          return `<span class="rating-circle" data-field-name="s5_mirror_${digit}" data-field-type="radio" data-field-group="s5_mirror">${digit}</span>`;
        }
      );
      html = html.substring(0, mirrorStart) + mirrorSection + html.substring(mirrorEnd + 6);
    }
  }
}

// Anticipated Tropes checklist items (named tropes)
const tropeNames = [
  'enemies_to_lovers', 'forced_proximity', 'fated_mates', 'slow_burn',
  'forbidden_love', 'grumpy_sunshine', 'morally_grey', 'found_family',
  'only_one_bed', 'fake_relationship', 'arranged_marriage', 'hidden_identity',
  'touch_her_and_die', 'falls_first', 'possessive_protective', 'villain_gets_girl',
  'who_did_this', 'redemption_arc'
];
let tropeIdx = 0;

// Match checklist items in the pre-read tropes section
// These are between "Anticipated Tropes" and "Expectations & Goals"
const tropeSectionStart = html.indexOf('Anticipated Tropes');
const tropeSectionEnd = html.indexOf('Expectations &amp; Goals') !== -1
  ? html.indexOf('Expectations &amp; Goals')
  : html.indexOf('Expectations & Goals');

if (tropeSectionStart !== -1 && tropeSectionEnd !== -1) {
  let tropeSection = html.substring(tropeSectionStart, tropeSectionEnd);

  // Named trope checklist items
  tropeSection = tropeSection.replace(
    /<li>([^_<][^<]*?)<\/li>/g,
    (match, text) => {
      if (tropeIdx < tropeNames.length) {
        const name = `pre_trope_${tropeNames[tropeIdx++]}`;
        fieldCount++;
        return `<li data-field-name="${name}" data-field-type="checkbox">${text}</li>`;
      }
      return match;
    }
  );

  // Custom trope blanks (underscore lines)
  let customTropeIdx = 1;
  tropeSection = tropeSection.replace(
    /<li>_{3,}<\/li>/g,
    (match) => {
      fieldCount++;
      return `<li data-field-name="pre_trope_custom_${customTropeIdx++}" data-field-type="text">___</li>`;
    }
  );

  html = html.substring(0, tropeSectionStart) + tropeSection + html.substring(tropeSectionEnd);
}

// Pre-read write-lines (expectations section) — 3 write-lines between "Expectations & Goals" and "Craft Toolkit"
const expectationNames = ['pre_expectations', 'pre_craft_element', 'pre_weakness'];
let expectIdx = 0;
const expectStart = html.indexOf('Expectations &amp; Goals') !== -1
  ? html.indexOf('Expectations &amp; Goals')
  : html.indexOf('Expectations & Goals');
const craftToolkitStart = html.indexOf('id="craft-toolkit"');

if (expectStart !== -1 && craftToolkitStart !== -1) {
  let expectSection = html.substring(expectStart, craftToolkitStart);

  expectSection = expectSection.replace(
    /<div class="write-lines"><\/div>/g,
    (match) => {
      if (expectIdx < expectationNames.length) {
        fieldCount++;
        return `<div class="write-lines" data-field-name="${expectationNames[expectIdx++]}" data-field-type="textarea"></div>`;
      }
      return match;
    }
  );

  html = html.substring(0, expectStart) + expectSection + html.substring(craftToolkitStart);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 2: CHAPTER LOGS (30 chapters, identical structure)
// ═══════════════════════════════════════════════════════════════════

for (let ch = 1; ch <= 30; ch++) {
  const chStart = html.indexOf(`id="chapter-${ch}"`);
  if (chStart === -1) continue;

  // Find the end of this chapter block (next chapter-log or next section-title-page)
  let chEnd;
  if (ch < 30) {
    chEnd = html.indexOf(`id="chapter-${ch + 1}"`);
  } else {
    // After chapter 30, find the next section
    chEnd = html.indexOf('section-title-page', chStart + 50);
  }
  if (chEnd === -1) chEnd = html.length;

  // Back up to include the opening div
  const blockStart = html.lastIndexOf('<div class="chapter-log"', chStart);
  const actualStart = blockStart !== -1 ? blockStart : chStart;
  const actualEnd = html.lastIndexOf('<div class="chapter-log"', chEnd);
  const endPos = actualEnd > actualStart ? actualEnd : chEnd;

  let block = html.substring(actualStart, endPos);
  const prefix = `ch${ch}`;

  // 1. Replace underscore blanks in header
  // Pages: _____ – _____
  let pagesReplaced = false;
  block = block.replace(
    /(<div><strong>Pages:<\/strong>)\s*_{3,}\s*[–-]\s*_{3,}(<\/div>)/,
    (m, before, after) => {
      pagesReplaced = true;
      fieldCount += 2;
      return `${before} <span data-field-name="${prefix}_pages_start" data-field-type="text" class="field-value" style="min-width:0.6in;display:inline-block;border-bottom:1px solid #ccc"></span> – <span data-field-name="${prefix}_pages_end" data-field-type="text" class="field-value" style="min-width:0.6in;display:inline-block;border-bottom:1px solid #ccc"></span>${after}`;
    }
  );

  // POV: ______________
  block = block.replace(
    /(<div><strong>POV:<\/strong>)\s*_{3,}(<\/div>)/,
    (m, before, after) => {
      fieldCount++;
      return `${before} <span data-field-name="${prefix}_pov" data-field-type="text" class="field-value" style="min-width:1.3in;display:inline-block;border-bottom:1px solid #ccc"></span>${after}`;
    }
  );

  // Location: ______________
  block = block.replace(
    /(<div><strong>Location:<\/strong>)\s*_{3,}(<\/div>)/,
    (m, before, after) => {
      fieldCount++;
      return `${before} <span data-field-name="${prefix}_location" data-field-type="text" class="field-value" style="min-width:1.3in;display:inline-block;border-bottom:1px solid #ccc"></span>${after}`;
    }
  );

  // 2. Arc Driver line → text field overlaying the circle choices
  block = block.replace(
    /(<div><strong>Arc Driver:<\/strong>)([^<]*(?:<[^>]+>[^<]*)*?)(Fantasy\s*&nbsp;\|\s*&nbsp;Romance\s*&nbsp;\|\s*&nbsp;Both Intertwined)(<\/div>)/,
    (m, before, mid, choices, after) => {
      fieldCount++;
      return `${before}${mid}${choices} <span data-field-name="${prefix}_arc_driver" data-field-type="text" class="field-value" style="min-width:0.3in;display:inline-block;border-bottom:1px solid #ccc;margin-left:0.2rem"></span>${after}`;
    }
  );

  // 3. Tension Source line → text field
  block = block.replace(
    /(<div><strong>Tension Source:<\/strong>)([^<]*(?:<[^>]+>[^<]*)*?)(Danger\s*&nbsp;\|[^<]*Emotional Intimacy)(<\/div>)/,
    (m, before, mid, choices, after) => {
      fieldCount++;
      return `${before}${mid}${choices} <span data-field-name="${prefix}_tension_source" data-field-type="text" class="field-value" style="min-width:0.3in;display:inline-block;border-bottom:1px solid #ccc;margin-left:0.2rem"></span>${after}`;
    }
  );

  // 4. Write-space-xs divs (7 per chapter in order: job, summary, romance, plot_world, open_hook, close_hook)
  const writeSpaceNames = [
    `${prefix}_job`, `${prefix}_summary`,
    `${prefix}_romance_shift`, `${prefix}_plot_world`,
    `${prefix}_opening_hook`, `${prefix}_closing_hook`
  ];
  let wsIdx = 0;
  block = block.replace(
    /<div class="write-space-xs"><\/div>/g,
    (match) => {
      if (wsIdx < writeSpaceNames.length) {
        fieldCount++;
        return `<div class="write-space-xs" data-field-name="${writeSpaceNames[wsIdx++]}" data-field-type="textarea"></div>`;
      }
      return match;
    }
  );

  // 5. Write-space-md div (craft_move)
  block = block.replace(
    /<div class="write-space-md"><\/div>/,
    (match) => {
      fieldCount++;
      return `<div class="write-space-md" data-field-name="${prefix}_craft_move" data-field-type="textarea"></div>`;
    }
  );

  // 6. Checklist items (beat types: Plot, Romance, World, Character, Action, Quiet)
  const beatNames = ['plot', 'romance', 'world', 'character', 'action', 'quiet'];
  let beatIdx = 0;
  // Only match checklist items inside this chapter's Beat Types section
  const beatChecklistRegex = /<ul class="checklist"[^>]*>([\s\S]*?)<\/ul>/;
  block = block.replace(beatChecklistRegex, (ulMatch) => {
    return ulMatch.replace(/<li>(\w+)<\/li>/g, (liMatch, text) => {
      if (beatIdx < beatNames.length) {
        fieldCount++;
        return `<li data-field-name="${prefix}_beat_${beatNames[beatIdx++]}" data-field-type="checkbox">${text}</li>`;
      }
      return liMatch;
    });
  });

  // 7. Tension scales → replace each tension-row with a text field for the number
  block = block.replace(
    /<div class="tension-row"><span class="tension-label">Romance:<\/span><div class="tension-scale">[\s\S]*?<\/div><\/div>/,
    (match) => {
      fieldCount++;
      return `<div class="tension-row"><span class="tension-label">Romance:</span><div class="tension-scale"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span></div> <span data-field-name="${prefix}_tension_romance" data-field-type="text" style="min-width:0.3in;display:inline-block;border-bottom:1px solid #ccc;margin-left:0.3rem"></span></div>`;
    }
  );

  block = block.replace(
    /<div class="tension-row"><span class="tension-label">Plot:<\/span><div class="tension-scale">[\s\S]*?<\/div><\/div>/,
    (match) => {
      fieldCount++;
      return `<div class="tension-row"><span class="tension-label">Plot:</span><div class="tension-scale"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span></div> <span data-field-name="${prefix}_tension_plot" data-field-type="text" style="min-width:0.3in;display:inline-block;border-bottom:1px solid #ccc;margin-left:0.3rem"></span></div>`;
    }
  );

  html = html.substring(0, actualStart) + block + html.substring(endPos);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 3: ROMANCE ARC TRACKING (Beat tables)
// ═══════════════════════════════════════════════════════════════════

// Process beat tables - find empty td cells that aren't beat-name cells
// These tables have structure: beat-name | ch/page | execution | fantasy connection

function annotateBeatTable(htmlStr, sectionId, tableIdx, sectionPrefix) {
  const sectionStart = htmlStr.indexOf(`id="${sectionId}"`);
  if (sectionStart === -1) return htmlStr;

  // Find the next section
  const nextSections = ['id="romance-beats"', 'id="fantasy-plot"', 'id="dual-arc"',
    'id="tropes"', 'id="spice"', 'id="craft-moves"', 'id="synthesis"', 'id="appendix"'];
  let sectionEnd = htmlStr.length;
  for (const ns of nextSections) {
    const pos = htmlStr.indexOf(ns, sectionStart + 50);
    if (pos !== -1 && pos < sectionEnd) {
      sectionEnd = pos;
    }
  }

  let section = htmlStr.substring(sectionStart, sectionEnd);
  let cellCounter = 1;

  // Find all tables in this section
  section = section.replace(/<table[^>]*class="beat-table[^"]*"[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    // Skip the example row (italic style)
    return tableMatch.replace(/<tr(?![^>]*italic)([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      // Skip header rows
      if (trContent.includes('<th')) return trMatch;
      // Skip example rows
      if (trMatch.includes('font-style: italic') || trMatch.includes('italic')) return trMatch;

      return trMatch.replace(/<td(?!\s+class="beat-name")([^>]*)>(\s*)<\/td>/g, (tdMatch, tdAttrs, space) => {
        const name = `${sectionPrefix}_cell_${cellCounter++}`;
        fieldCount++;
        return `<td${tdAttrs} data-field-name="${name}" data-field-type="textarea">${space}</td>`;
      });
    });
  });

  return htmlStr.substring(0, sectionStart) + section + htmlStr.substring(sectionEnd);
}

html = annotateBeatTable(html, 'romance-beats', 0, 's3_romance');
html = annotateBeatTable(html, 'fantasy-plot', 0, 's4_fantasy');


// ═══════════════════════════════════════════════════════════════════
// SECTION 5: DUAL-ARC INTEGRATION
// ═══════════════════════════════════════════════════════════════════

// Write-spaces in the dual-arc section
const dualArcStart = html.indexOf('id="dual-arc"');
const tropesStart = html.indexOf('id="tropes"');

if (dualArcStart !== -1 && tropesStart !== -1) {
  let dualSection = html.substring(dualArcStart, tropesStart);
  let dualWsIdx = 1;

  // Write-space-sm and write-space-xs
  dualSection = dualSection.replace(
    /<div class="write-space-(sm|xs)"[^>]*><\/div>/g,
    (match, size) => {
      fieldCount++;
      return match.replace('>', ` data-field-name="s5_dual_arc_${dualWsIdx++}" data-field-type="textarea">`);
    }
  );

  // Empty td cells in binding techniques worksheet tables
  let dualCellIdx = 1;
  dualSection = dualSection.replace(/<table>([\s\S]*?)<\/table>/g, (tableMatch) => {
    // Skip reference tables (those with content in cells)
    if (tableMatch.includes('Symbiotic Magic') && tableMatch.includes('emotion fuels the magic')) {
      return tableMatch; // This is the reference table, skip
    }

    return tableMatch.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
      // Skip if td already has content
      if (tdMatch.includes('vertical-align') && !tdMatch.includes('data-field')) {
        fieldCount++;
        return `<td${attrs} data-field-name="s5_binding_cell_${dualCellIdx++}" data-field-type="textarea">${space}</td>`;
      }
      return tdMatch;
    });
  });

  html = html.substring(0, dualArcStart) + dualSection + html.substring(tropesStart);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 6: TROPES
// ═══════════════════════════════════════════════════════════════════

const tropeSectionBegin = html.indexOf('id="tropes"');
const spiceSectionStart = html.indexOf('id="spice"');

if (tropeSectionBegin !== -1 && spiceSectionStart !== -1) {
  let tropeSection = html.substring(tropeSectionBegin, spiceSectionStart);
  let tropeCellIdx = 1;

  // Checkbox cells (☐ character = &#9744;)
  tropeSection = tropeSection.replace(
    /<td([^>]*)>&#9744;<\/td>/g,
    (match, attrs) => {
      fieldCount++;
      return `<td${attrs} data-field-name="s6_trope_check_${tropeCellIdx++}" data-field-type="checkbox">&#9744;</td>`;
    }
  );

  // Empty td cells (for setup/payoff/notes columns)
  let tropeTextIdx = 1;
  tropeSection = tropeSection.replace(
    /<td([^>]*)>(\s*)<\/td>/g,
    (match, attrs, space) => {
      // Skip cells that already have data-field or have text content
      if (match.includes('data-field')) return match;
      // Skip cells with named tropes (first column)
      if (match.includes('Enemies to Lovers') || match.includes('Forced Proximity') ||
          match.includes('Fated Mates') || match.includes('Slow Burn') ||
          match.includes('Forbidden Love') || match.includes('Morally Grey') ||
          match.includes('Who Did This') || match.includes('Wound Tending') ||
          match.includes('Only One Bed') || match.includes('Training Scene') ||
          match.includes('Jealousy') || match.includes('Protective') ||
          match.includes('Dance Scene') || match.includes('Almost Kiss')) {
        return match;
      }
      fieldCount++;
      return `<td${attrs} data-field-name="s6_trope_text_${tropeTextIdx++}" data-field-type="text">${space}</td>`;
    }
  );

  html = html.substring(0, tropeSectionBegin) + tropeSection + html.substring(spiceSectionStart);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 7: SPICE & INTIMACY
// ═══════════════════════════════════════════════════════════════════

const spiceBegin = html.indexOf('id="spice"');
const craftMovesStart = html.indexOf('id="craft-moves"');

if (spiceBegin !== -1 && craftMovesStart !== -1) {
  let spiceSection = html.substring(spiceBegin, craftMovesStart);
  let spiceCellIdx = 1;
  let spiceWsIdx = 1;

  // Empty td cells
  spiceSection = spiceSection.replace(
    /<td([^>]*)>(\s*)<\/td>/g,
    (match, attrs, space) => {
      if (match.includes('data-field')) return match;
      // Skip label cells that have text
      fieldCount++;
      return `<td${attrs} data-field-name="s7_spice_cell_${spiceCellIdx++}" data-field-type="textarea">${space}</td>`;
    }
  );

  // Write-spaces
  spiceSection = spiceSection.replace(
    /<div class="write-space-(sm|xs|md|lg)"[^>]*><\/div>/g,
    (match) => {
      fieldCount++;
      return match.replace('>', ` data-field-name="s7_spice_ws_${spiceWsIdx++}" data-field-type="textarea">`);
    }
  );

  spiceSection = spiceSection.replace(
    /<div class="write-lines"[^>]*><\/div>/g,
    (match) => {
      fieldCount++;
      return match.replace('>', ` data-field-name="s7_spice_wl_${spiceWsIdx++}" data-field-type="textarea">`);
    }
  );

  html = html.substring(0, spiceBegin) + spiceSection + html.substring(craftMovesStart);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 8: CRAFT MOVES
// ═══════════════════════════════════════════════════════════════════

const craftBegin = html.indexOf('id="craft-moves"');
const synthesisStart = html.indexOf('id="synthesis"');

if (craftBegin !== -1 && synthesisStart !== -1) {
  let craftSection = html.substring(craftBegin, synthesisStart);
  let craftCellIdx = 1;
  let craftWsIdx = 1;

  // Empty td cells
  craftSection = craftSection.replace(
    /<td([^>]*)>(\s*)<\/td>/g,
    (match, attrs, space) => {
      if (match.includes('data-field')) return match;
      fieldCount++;
      return `<td${attrs} data-field-name="s8_craft_cell_${craftCellIdx++}" data-field-type="textarea">${space}</td>`;
    }
  );

  // Write-lines (including Swoon-Worthy Lines)
  craftSection = craftSection.replace(
    /<div class="write-lines"([^>]*)><\/div>/g,
    (match, attrs) => {
      fieldCount++;
      return `<div class="write-lines"${attrs} data-field-name="s8_craft_wl_${craftWsIdx++}" data-field-type="textarea"></div>`;
    }
  );

  html = html.substring(0, craftBegin) + craftSection + html.substring(synthesisStart);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 9: POST-READ SYNTHESIS
// ═══════════════════════════════════════════════════════════════════

const synthBegin = html.indexOf('id="synthesis"');
const appendixStart = html.indexOf('id="appendix"');

if (synthBegin !== -1 && appendixStart !== -1) {
  let synthSection = html.substring(synthBegin, appendixStart);

  // Field-value spans (structural metrics)
  const synthFieldLabels = [
    'chapters_to_inciting', 'first_kiss_page', 'midpoint_page',
    'all_is_lost_page', 'total_chapters', 'heat_level'
  ];
  let synthFvIdx = 0;
  synthSection = synthSection.replace(
    /<span class="field-value"><\/span>/g,
    (match) => {
      if (synthFvIdx < synthFieldLabels.length) {
        fieldCount++;
        return `<span class="field-value" data-field-name="s9_${synthFieldLabels[synthFvIdx++]}" data-field-type="text"></span>`;
      }
      return match;
    }
  );

  // Overall assessment table + pitfall table cells
  let synthCellIdx = 1;
  synthSection = synthSection.replace(
    /<td([^>]*)>(\s*)<\/td>/g,
    (match, attrs, space) => {
      if (match.includes('data-field')) return match;
      fieldCount++;
      return `<td${attrs} data-field-name="s9_cell_${synthCellIdx++}" data-field-type="textarea">${space}</td>`;
    }
  );

  // Y / N cells (pitfall diagnosis)
  synthSection = synthSection.replace(
    /<td([^>]*)>Y \/ N<\/td>/g,
    (match, attrs) => {
      fieldCount++;
      return `<td${attrs} data-field-name="s9_yn_${synthCellIdx++}" data-field-type="text">Y / N</td>`;
    }
  );

  // Write-lines
  let synthWlIdx = 1;
  synthSection = synthSection.replace(
    /<div class="write-lines"[^>]*><\/div>/g,
    (match) => {
      fieldCount++;
      return match.replace(/<div /, `<div data-field-name="s9_write_${synthWlIdx++}" data-field-type="textarea" `);
    }
  );

  // Write-space-sm
  let synthWsIdx = 1;
  synthSection = synthSection.replace(
    /<div class="write-space-sm"[^>]*><\/div>/g,
    (match) => {
      fieldCount++;
      return match.replace('>', ` data-field-name="s9_ws_${synthWsIdx++}" data-field-type="textarea">`);
    }
  );

  html = html.substring(0, synthBegin) + synthSection + html.substring(appendixStart);
}


// ═══════════════════════════════════════════════════════════════════
// APPENDIX: Integration Patterns Worksheet
// ═══════════════════════════════════════════════════════════════════

const appendixBegin = html.indexOf('id="appendix"');
if (appendixBegin !== -1) {
  let appendixSection = html.substring(appendixBegin);
  let appCellIdx = 1;

  // Empty td cells in the patterns worksheet table (skip the reference table)
  // The reference table has content; the worksheet table has empty cells
  appendixSection = appendixSection.replace(/<table>([\s\S]*?)<\/table>/g, (tableMatch) => {
    // Skip tables where cells have substantial content (reference tables)
    if (tableMatch.includes('emotion fuels') || tableMatch.includes('Bond, curse') ||
        tableMatch.includes('dangerous journey') || tableMatch.includes('Diagnostic Terms') ||
        tableMatch.includes('How It Works') && tableMatch.includes('A bond, curse')) {
      return tableMatch;
    }

    return tableMatch.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
      if (tdMatch.includes('data-field')) return tdMatch;
      fieldCount++;
      return `<td${attrs} data-field-name="app_cell_${appCellIdx++}" data-field-type="textarea">${space}</td>`;
    });
  });

  html = html.substring(0, appendixBegin) + appendixSection;
}


// ═══════════════════════════════════════════════════════════════════
// FINAL: Catch any remaining unannotated fillable elements
// ═══════════════════════════════════════════════════════════════════

// Any remaining write-space or write-lines that weren't caught by section processing
let remainingIdx = 1;
html = html.replace(
  /<div class="(write-space-(?:xs|sm|md|lg)|write-lines)"([^>]*)(?<!data-field-name[^>]*)><\/div>/g,
  (match, cls, attrs) => {
    if (match.includes('data-field-name')) return match;
    fieldCount++;
    return `<div class="${cls}"${attrs} data-field-name="misc_field_${remainingIdx++}" data-field-type="textarea"></div>`;
  }
);


// ─── Write output ─────────────────────────────────────────────────

fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`\nAnnotation complete!`);
console.log(`  Input:  ${INPUT}`);
console.log(`  Output: ${OUTPUT}`);
console.log(`  Fields annotated: ${fieldCount}`);
console.log(`\nNext step: run the pipeline`);
console.log(`  node tools/fillable-pdf/src/generate.js \\`);
console.log(`    --input romantasy-analysis-guide/printable/romantasy-analysis-guide-fillable.html \\`);
console.log(`    --output romantasy-analysis-guide/printable/Reading-Romantasy-Analysis-Guide-FILLABLE.pdf`);
