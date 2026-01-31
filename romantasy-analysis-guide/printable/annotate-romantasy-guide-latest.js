#!/usr/bin/env node

/**
 * annotate-romantasy-guide-latest.js
 *
 * Project-specific annotation script for the Romantasy Analysis Guide (LATEST version).
 * Reads the LATEST HTML file and adds data-field-name / data-field-type / data-field-group
 * attributes to every element that should become a fillable PDF field.
 *
 * The LATEST HTML differs from the original:
 *   - Uses <input type="text"> for text fields (pages, POV, location, custom tropes)
 *   - Uses <input type="checkbox"> for checkboxes (beats, heat, tropes, arc driver, tension)
 *   - Uses contenteditable="true" on write-spaces, write-lines, and field-values
 *
 * Run: node annotate-romantasy-guide-latest.js
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, 'romantasy-analysis-guide-LATEST.html');
const OUTPUT = path.resolve(__dirname, 'romantasy-analysis-guide-LATEST-fillable.html');

// ─── Main Processing ──────────────────────────────────────────────

let html = fs.readFileSync(INPUT, 'utf8');
let fieldCount = 0;


// ═══════════════════════════════════════════════════════════════════
// SECTION 1: PRE-READ SETUP (Book Metadata, Heat Level, Tropes, Expectations)
// ═══════════════════════════════════════════════════════════════════

// 1a. Book Metadata — contenteditable field-value spans
const preReadLabels = ['title', 'author', 'series', 'pub_year', 'page_count', 'subgenre'];
let preReadIdx = 0;

const bookInfoStart = html.indexOf('id="book-info"');
const craftToolkitStart = html.indexOf('id="craft-toolkit"');

if (bookInfoStart !== -1 && craftToolkitStart !== -1) {
  let preSection = html.substring(bookInfoStart, craftToolkitStart);

  // Field-value spans (Title, Author, Series, etc.)
  preSection = preSection.replace(
    /(<span class="field-value" contenteditable="true">)(<\/span>)/g,
    (match, before, after) => {
      if (preReadIdx < preReadLabels.length) {
        const name = `pre_${preReadLabels[preReadIdx++]}`;
        fieldCount++;
        return `${before.slice(0, -1)} data-field-name="${name}" data-field-type="text">${after}`;
      }
      return match;
    }
  );

  // 1b. Heat Level — checkbox labels with rating-check class
  const heatStart = preSection.indexOf('Expected Heat Level');
  const heatEnd = preSection.indexOf('Anticipated Tropes');
  if (heatStart !== -1 && heatEnd !== -1) {
    let heatSection = preSection.substring(heatStart, heatEnd);
    let heatIdx = 0;
    heatSection = heatSection.replace(
      /<label class="rating-check"><input type="checkbox"> (\d)<\/label>/g,
      (match, digit) => {
        fieldCount++;
        return `<label class="rating-check"><input type="checkbox" data-field-name="pre_heat_${digit}" data-field-type="radio" data-field-group="pre_heat"> ${digit}</label>`;
      }
    );
    preSection = preSection.substring(0, heatStart) + heatSection + preSection.substring(heatEnd);
  }

  // 1c. Anticipated Tropes — named tropes with checkboxes
  const tropeNames = [
    'enemies_to_lovers', 'forced_proximity', 'fated_mates', 'slow_burn',
    'forbidden_love', 'grumpy_sunshine', 'morally_grey', 'found_family',
    'only_one_bed', 'fake_relationship', 'arranged_marriage', 'hidden_identity',
    'touch_her_and_die', 'falls_first', 'possessive_protective', 'villain_gets_girl',
    'who_did_this', 'redemption_arc'
  ];
  let tropeIdx = 0;

  const tropeStart = preSection.indexOf('Anticipated Tropes');
  const expectStart = preSection.indexOf('Expectations &amp; Goals') !== -1
    ? preSection.indexOf('Expectations &amp; Goals')
    : preSection.indexOf('Expectations & Goals');

  if (tropeStart !== -1 && expectStart !== -1) {
    let tropeSection = preSection.substring(tropeStart, expectStart);

    // Named trope checkboxes — li items with a label containing checkbox + text (no input[type=text])
    tropeSection = tropeSection.replace(
      /<li><label><input type="checkbox"> ([^<]+)<\/label><\/li>/g,
      (match, text) => {
        if (tropeIdx < tropeNames.length) {
          const name = `pre_trope_${tropeNames[tropeIdx++]}`;
          fieldCount++;
          return `<li data-field-name="${name}" data-field-type="checkbox"><label><input type="checkbox"> ${text}</label></li>`;
        }
        return match;
      }
    );

    // Custom trope blanks — li items with checkbox + text input
    let customTropeIdx = 1;
    tropeSection = tropeSection.replace(
      /<li><label><input type="checkbox"> (<input type="text"[^>]*>)<\/label><\/li>/g,
      (match, inputTag) => {
        fieldCount += 2;
        const checkName = `pre_trope_custom_check_${customTropeIdx}`;
        const textName = `pre_trope_custom_text_${customTropeIdx}`;
        customTropeIdx++;
        return `<li data-field-name="${checkName}" data-field-type="checkbox"><label><input type="checkbox"> <input type="text" data-field-name="${textName}" data-field-type="text" style="border:none; border-bottom:1px solid #ccc; background:transparent; font-size:0.85rem; outline:none; width:70%;"></label></li>`;
      }
    );

    preSection = preSection.substring(0, tropeStart) + tropeSection + preSection.substring(expectStart);
  }

  // 1d. Expectations & Goals — write-lines
  const expectNames = ['pre_expectations', 'pre_craft_element', 'pre_weakness'];
  let expectIdx = 0;
  const expectSectionStart = preSection.indexOf('Expectations &amp; Goals') !== -1
    ? preSection.indexOf('Expectations &amp; Goals')
    : preSection.indexOf('Expectations & Goals');

  if (expectSectionStart !== -1) {
    let expectSection = preSection.substring(expectSectionStart);

    expectSection = expectSection.replace(
      /<div class="write-lines" contenteditable="true"><\/div>/g,
      (match) => {
        if (expectIdx < expectNames.length) {
          fieldCount++;
          return `<div class="write-lines" contenteditable="true" data-field-name="${expectNames[expectIdx++]}" data-field-type="textarea"></div>`;
        }
        return match;
      }
    );

    preSection = preSection.substring(0, expectSectionStart) + expectSection;
  }

  html = html.substring(0, bookInfoStart) + preSection + html.substring(craftToolkitStart);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 2: CHAPTER LOGS (30 chapters)
// ═══════════════════════════════════════════════════════════════════

for (let ch = 1; ch <= 30; ch++) {
  const chStart = html.indexOf(`id="chapter-${ch}"`);
  if (chStart === -1) continue;

  // Find the end of this chapter block
  let chEnd;
  if (ch < 30) {
    chEnd = html.indexOf(`id="chapter-${ch + 1}"`);
  } else {
    chEnd = html.indexOf('section-title-page', chStart + 50);
  }
  if (chEnd === -1) chEnd = html.length;

  const blockStart = html.lastIndexOf('<div class="chapter-log"', chStart);
  const actualStart = blockStart !== -1 ? blockStart : chStart;
  const actualEnd = html.lastIndexOf('<div class="chapter-log"', chEnd);
  const endPos = actualEnd > actualStart ? actualEnd : chEnd;

  let block = html.substring(actualStart, endPos);
  const prefix = `ch${ch}`;

  // 2a. Header input fields: Start page, End page, POV, Location
  const headerInputNames = [`${prefix}_pages_start`, `${prefix}_pages_end`, `${prefix}_pov`, `${prefix}_location`];
  let headerIdx = 0;

  // Match input fields inside chapter-log-header
  const headerStart = block.indexOf('class="chapter-log-header"');
  const headerEnd = block.indexOf('</div>', block.indexOf('</div>', block.indexOf('</div>', headerStart + 1) + 1) + 1);

  if (headerStart !== -1) {
    const headerEndPos = block.indexOf('</div>', block.indexOf('class="chapter-log-header"') + 200) + 6;
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

  // 2b. Arc Driver checkboxes (Fantasy, Romance, Both Intertwined)
  const arcDriverNames = [`${prefix}_arc_fantasy`, `${prefix}_arc_romance`, `${prefix}_arc_both`];
  let arcIdx = 0;
  const arcStart = block.indexOf('Arc Driver:');
  if (arcStart !== -1) {
    const arcEnd = block.indexOf('</div>', block.indexOf('Tension Source:', arcStart));
    if (arcEnd !== -1) {
      let arcSection = block.substring(arcStart, arcEnd);
      arcSection = arcSection.replace(
        /<label class="inline-check"><input type="checkbox"> (Fantasy|Romance|Both Intertwined)<\/label>/g,
        (match, label) => {
          if (arcIdx < arcDriverNames.length) {
            fieldCount++;
            return `<label class="inline-check"><input type="checkbox" data-field-name="${arcDriverNames[arcIdx++]}" data-field-type="radio" data-field-group="${prefix}_arc_driver"> ${label}</label>`;
          }
          return match;
        }
      );
      block = block.substring(0, arcStart) + arcSection + block.substring(arcEnd);
    }
  }

  // 2c. Tension Source checkboxes (Danger, Will-They/Won't-They, Mystery, Emotional Intimacy)
  const tensionSourceNames = [`${prefix}_tsrc_danger`, `${prefix}_tsrc_will_they`, `${prefix}_tsrc_mystery`, `${prefix}_tsrc_emotional`];
  let tsrcIdx = 0;
  const tsrcStart = block.indexOf('Tension Source:');
  if (tsrcStart !== -1) {
    const tsrcEnd = block.indexOf('</div>', tsrcStart + 10);
    if (tsrcEnd !== -1) {
      let tsrcSection = block.substring(tsrcStart, tsrcEnd);
      tsrcSection = tsrcSection.replace(
        /<label class="inline-check"><input type="checkbox"> (Danger|Will-They\/Won&#x27;t-They|Will-They\/Won't-They|Mystery|Emotional Intimacy)<\/label>/g,
        (match, label) => {
          if (tsrcIdx < tensionSourceNames.length) {
            fieldCount++;
            return `<label class="inline-check"><input type="checkbox" data-field-name="${tensionSourceNames[tsrcIdx++]}" data-field-type="checkbox"> ${label}</label>`;
          }
          return match;
        }
      );
      block = block.substring(0, tsrcStart) + tsrcSection + block.substring(tsrcEnd);
    }
  }

  // 2d. Beat type checkboxes (Plot, Romance, World, Character, Action, Quiet)
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

  // 2e. Tension scales — Romance and Plot (1-10 checkboxes)
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

  // 2f. Write-space-xs (job, summary, romance, plot_world, opening_hook, closing_hook)
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

  // 2g. Write-space-md (craft_move)
  block = block.replace(
    /<div class="write-space-md" contenteditable="true"><\/div>/,
    (match) => {
      fieldCount++;
      return `<div class="write-space-md" contenteditable="true" data-field-name="${prefix}_craft_move" data-field-type="textarea"></div>`;
    }
  );

  html = html.substring(0, actualStart) + block + html.substring(endPos);
}


// ═══════════════════════════════════════════════════════════════════
// SECTION 3: ROMANCE ARC TRACKING (Beat tables)
// ═══════════════════════════════════════════════════════════════════

function annotateBeatTable(htmlStr, sectionId, nextSectionIds, sectionPrefix) {
  const sectionStart = htmlStr.indexOf(`id="${sectionId}"`);
  if (sectionStart === -1) return htmlStr;

  let sectionEnd = htmlStr.length;
  for (const ns of nextSectionIds) {
    const pos = htmlStr.indexOf(`id="${ns}"`, sectionStart + 50);
    if (pos !== -1 && pos < sectionEnd) {
      sectionEnd = pos;
    }
  }

  let section = htmlStr.substring(sectionStart, sectionEnd);
  let cellCounter = 1;

  // Find all beat tables and annotate empty td cells (skip beat-name and example rows)
  section = section.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    return tableMatch.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      // Skip header rows
      if (trContent.includes('<th')) return trMatch;
      // Skip example/italic rows
      if (trMatch.includes('font-style: italic') || trMatch.includes('italic')) return trMatch;

      return trMatch.replace(/<td(?!\s+class="beat-name")([^>]*)>(\s*)<\/td>/g, (tdMatch, tdAttrs, space) => {
        if (tdMatch.includes('data-field')) return tdMatch;
        const name = `${sectionPrefix}_cell_${cellCounter++}`;
        fieldCount++;
        return `<td${tdAttrs} data-field-name="${name}" data-field-type="textarea">${space}</td>`;
      });
    });
  });

  return htmlStr.substring(0, sectionStart) + section + htmlStr.substring(sectionEnd);
}

const allSectionIds = ['romance-beats', 'fantasy-plot', 'dual-arc', 'tropes', 'spice', 'craft-moves', 'synthesis', 'appendix'];

html = annotateBeatTable(html, 'romance-beats', allSectionIds, 's3_romance');
html = annotateBeatTable(html, 'fantasy-plot', allSectionIds, 's4_fantasy');


// ═══════════════════════════════════════════════════════════════════
// SECTION 5: DUAL-ARC INTEGRATION
// ═══════════════════════════════════════════════════════════════════

const dualArcStart = html.indexOf('id="dual-arc"');
const tropesStart = html.indexOf('id="tropes"');

if (dualArcStart !== -1 && tropesStart !== -1) {
  let dualSection = html.substring(dualArcStart, tropesStart);
  let dualWsIdx = 1;

  // Write-space-sm, write-space-xs contenteditable
  dualSection = dualSection.replace(
    /<div class="write-space-(sm|xs)" contenteditable="true"><\/div>/g,
    (match, size) => {
      fieldCount++;
      return match.replace(' contenteditable="true">', ` contenteditable="true" data-field-name="s5_dual_arc_${dualWsIdx++}" data-field-type="textarea">`);
    }
  );

  // Mirror effect rating — rating-check checkboxes
  const mirrorStart = dualSection.indexOf('How strong is the mirror effect');
  if (mirrorStart !== -1) {
    const mirrorEnd = dualSection.indexOf('</div>', dualSection.indexOf('rating-scale', mirrorStart) + 10);
    if (mirrorEnd !== -1) {
      let mirrorSection = dualSection.substring(mirrorStart, mirrorEnd + 6);
      mirrorSection = mirrorSection.replace(
        /<label class="rating-check"><input type="checkbox"> (\d)<\/label>/g,
        (match, digit) => {
          fieldCount++;
          return `<label class="rating-check"><input type="checkbox" data-field-name="s5_mirror_${digit}" data-field-type="radio" data-field-group="s5_mirror"> ${digit}</label>`;
        }
      );
      dualSection = dualSection.substring(0, mirrorStart) + mirrorSection + dualSection.substring(mirrorEnd + 6);
    }
  }

  // Empty td cells in binding techniques worksheet table and causality grid
  // Skip the reference table (which has content like "Symbiotic Magic" + definitions)
  let dualCellIdx = 1;
  dualSection = dualSection.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    // Skip reference tables (those with substantial content in cells)
    if (tableMatch.includes('emotion fuels the magic') || tableMatch.includes('emotion fuels the magic')) {
      return tableMatch;
    }
    if (tableMatch.includes('How It Works') && tableMatch.includes('Symbiotic Magic') && tableMatch.includes('Crucible Quest')) {
      return tableMatch;
    }

    return tableMatch.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      if (trContent.includes('<th')) return trMatch;

      return trMatch.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
        if (tdMatch.includes('data-field')) return tdMatch;
        fieldCount++;
        return `<td${attrs} data-field-name="s5_dual_cell_${dualCellIdx++}" data-field-type="textarea">${space}</td>`;
      });
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
  tropeSection = tropeSection.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    return tableMatch.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      if (trContent.includes('<th')) return trMatch;
      // Skip example rows
      if (trMatch.includes('font-style: italic') || trMatch.includes('italic')) return trMatch;

      return trMatch.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
        if (tdMatch.includes('data-field')) return tdMatch;
        fieldCount++;
        return `<td${attrs} data-field-name="s6_trope_text_${tropeTextIdx++}" data-field-type="text">${space}</td>`;
      });
    });
  });

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

  // Empty td cells in tables
  spiceSection = spiceSection.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    return tableMatch.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      if (trContent.includes('<th')) return trMatch;
      if (trMatch.includes('font-style: italic') || trMatch.includes('italic')) return trMatch;

      return trMatch.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
        if (tdMatch.includes('data-field')) return tdMatch;
        fieldCount++;
        return `<td${attrs} data-field-name="s7_spice_cell_${spiceCellIdx++}" data-field-type="textarea">${space}</td>`;
      });
    });
  });

  // Write-spaces
  spiceSection = spiceSection.replace(
    /<div class="write-space-(sm|xs|md|lg)" contenteditable="true"><\/div>/g,
    (match) => {
      fieldCount++;
      return match.replace(' contenteditable="true">', ` contenteditable="true" data-field-name="s7_spice_ws_${spiceWsIdx++}" data-field-type="textarea">`);
    }
  );

  // Write-lines
  spiceSection = spiceSection.replace(
    /<div class="write-lines"([^>]*) contenteditable="true"><\/div>/g,
    (match, attrs) => {
      fieldCount++;
      return `<div class="write-lines"${attrs} contenteditable="true" data-field-name="s7_spice_wl_${spiceWsIdx++}" data-field-type="textarea"></div>`;
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
  craftSection = craftSection.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    return tableMatch.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      if (trContent.includes('<th')) return trMatch;
      if (trMatch.includes('font-style: italic') || trMatch.includes('italic')) return trMatch;

      return trMatch.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
        if (tdMatch.includes('data-field')) return tdMatch;
        fieldCount++;
        return `<td${attrs} data-field-name="s8_craft_cell_${craftCellIdx++}" data-field-type="textarea">${space}</td>`;
      });
    });
  });

  // Write-lines (including Swoon-Worthy Lines)
  craftSection = craftSection.replace(
    /<div class="write-lines"([^>]*) contenteditable="true"><\/div>/g,
    (match, attrs) => {
      fieldCount++;
      return `<div class="write-lines"${attrs} contenteditable="true" data-field-name="s8_craft_wl_${craftWsIdx++}" data-field-type="textarea"></div>`;
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
    /<span class="field-value" contenteditable="true"><\/span>/g,
    (match) => {
      if (synthFvIdx < synthFieldLabels.length) {
        fieldCount++;
        return `<span class="field-value" contenteditable="true" data-field-name="s9_${synthFieldLabels[synthFvIdx++]}" data-field-type="text"></span>`;
      }
      return match;
    }
  );

  // Overall assessment table + pitfall table — empty td cells
  let synthCellIdx = 1;
  synthSection = synthSection.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    return tableMatch.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      if (trContent.includes('<th')) return trMatch;

      let result = trMatch;
      // Empty td cells
      result = result.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
        if (tdMatch.includes('data-field')) return tdMatch;
        fieldCount++;
        return `<td${attrs} data-field-name="s9_cell_${synthCellIdx++}" data-field-type="textarea">${space}</td>`;
      });
      return result;
    });
  });

  // Y / N cells (pitfall diagnosis)
  synthSection = synthSection.replace(
    /<td([^>]*)>Y \/ N<\/td>/g,
    (match, attrs) => {
      if (match.includes('data-field')) return match;
      fieldCount++;
      return `<td${attrs} data-field-name="s9_yn_${synthCellIdx++}" data-field-type="text">Y / N</td>`;
    }
  );

  // Write-lines
  let synthWlIdx = 1;
  synthSection = synthSection.replace(
    /<div class="write-lines"([^>]*) contenteditable="true"><\/div>/g,
    (match, attrs) => {
      if (match.includes('data-field')) return match;
      fieldCount++;
      return `<div class="write-lines"${attrs} contenteditable="true" data-field-name="s9_write_${synthWlIdx++}" data-field-type="textarea"></div>`;
    }
  );

  // Write-space-sm
  let synthWsIdx = 1;
  synthSection = synthSection.replace(
    /<div class="write-space-sm" contenteditable="true"><\/div>/g,
    (match) => {
      if (match.includes('data-field')) return match;
      fieldCount++;
      return `<div class="write-space-sm" contenteditable="true" data-field-name="s9_ws_${synthWsIdx++}" data-field-type="textarea"></div>`;
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

  // Skip the reference table (the one describing each pattern with "How It Works")
  appendixSection = appendixSection.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (tableMatch) => {
    // Skip reference tables (those with content)
    if (tableMatch.includes('emotion fuels') || tableMatch.includes('Bond, curse') ||
        tableMatch.includes('dangerous journey') || tableMatch.includes('Diagnostic Terms') ||
        (tableMatch.includes('How It Works') && tableMatch.includes('Symbiotic Magic'))) {
      return tableMatch;
    }

    return tableMatch.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (trMatch, trAttrs, trContent) => {
      if (trContent.includes('<th')) return trMatch;

      return trMatch.replace(/<td([^>]*)>(\s*)<\/td>/g, (tdMatch, attrs, space) => {
        if (tdMatch.includes('data-field')) return tdMatch;
        fieldCount++;
        return `<td${attrs} data-field-name="app_cell_${appCellIdx++}" data-field-type="textarea">${space}</td>`;
      });
    });
  });

  html = html.substring(0, appendixBegin) + appendixSection;
}


// ═══════════════════════════════════════════════════════════════════
// FINAL: Catch any remaining unannotated fillable elements
// ═══════════════════════════════════════════════════════════════════

// Remaining write-space or write-lines that weren't caught
let remainingIdx = 1;
html = html.replace(
  /<div class="(write-space-(?:xs|sm|md|lg)|write-lines)"([^>]*) contenteditable="true"([^>]*)><\/div>/g,
  (match, cls, before, after) => {
    if (match.includes('data-field-name')) return match;
    fieldCount++;
    return `<div class="${cls}"${before} contenteditable="true"${after} data-field-name="misc_field_${remainingIdx++}" data-field-type="textarea"></div>`;
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
console.log(`    --input romantasy-analysis-guide/printable/romantasy-analysis-guide-LATEST-fillable.html \\`);
console.log(`    --output romantasy-analysis-guide/printable/Reading-Romantasy-Analysis-Guide-LATEST-FILLABLE.pdf`);
