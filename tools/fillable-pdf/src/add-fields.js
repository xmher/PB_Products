/**
 * add-fields.js — pdf-lib based AcroForm field injection
 *
 * Reads a flat PDF and a field descriptor array, then adds native AcroForm
 * fields (text, textarea, checkbox, radio) at the exact coordinates.
 *
 * REUSABLE: Works with any flat PDF + field JSON from extract-fields.js.
 *
 * Design principles from the optimization research:
 * - Pure AcroForm fields only, ZERO JavaScript in the PDF
 * - No calculation chains → no input latency
 * - Minimal font embedding → smaller file size
 * - Fields use standard PDF appearances → maximum viewer compatibility
 */

const { PDFDocument, PDFName, PDFString, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs');

// Consistent styling
const FIELD_COLORS = {
  text: { bg: rgb(0.98, 0.98, 0.97), border: rgb(0.8, 0.8, 0.78) },
  textarea: { bg: rgb(0.98, 0.98, 0.97), border: rgb(0.8, 0.8, 0.78) },
  checkbox: { bg: rgb(1, 1, 1), border: rgb(0.65, 0.65, 0.63) },
  radio: { bg: rgb(1, 1, 1), border: rgb(0.65, 0.65, 0.63) },
};

// Small padding inset so the field doesn't cover the visual border of the box
const INSET = 2;

/**
 * Add AcroForm fields to a flat PDF.
 *
 * @param {string} pdfPath   — Path to the flat (non-fillable) PDF
 * @param {object[]} fields  — Array of field descriptors from extractFields()
 * @param {string} outputPath — Where to write the fillable PDF
 * @param {object} opts
 * @param {number} opts.fontSize — Default font size for text fields (default: 10)
 */
async function addFields(pdfPath, fields, outputPath, opts = {}) {
  const { fontSize = 10 } = opts;

  console.log(`[fields] Loading flat PDF: ${pdfPath}`);
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const form = pdfDoc.getForm();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  console.log(`[fields] PDF has ${pages.length} pages, injecting ${fields.length} fields...`);

  // Track radio groups so we create them once
  const radioGroups = new Map();

  let textCount = 0;
  let textareaCount = 0;
  let checkboxCount = 0;
  let radioCount = 0;
  let skippedCount = 0;

  for (const field of fields) {
    const { name, type, group, page: pageIdx, x, y, width, height } = field;

    if (pageIdx < 0 || pageIdx >= pages.length) {
      console.warn(`[fields] Skipping "${name}": page ${pageIdx} out of range`);
      skippedCount++;
      continue;
    }

    const page = pages[pageIdx];

    // Apply small inset so field sits inside the visual box
    const fx = x + INSET;
    const fy = y + INSET;
    const fw = Math.max(width - INSET * 2, 10);
    const fh = Math.max(height - INSET * 2, 10);

    try {
      switch (type) {
        case 'text': {
          const textField = form.createTextField(name);
          textField.addToPage(page, { x: fx, y: fy, width: fw, height: fh });
          textField.setFontSize(fontSize);
          textField.defaultUpdateAppearances(font);
          textCount++;
          break;
        }

        case 'textarea': {
          const textArea = form.createTextField(name);
          textArea.enableMultiline();
          textArea.addToPage(page, { x: fx, y: fy, width: fw, height: fh });
          // Smaller font for multi-line areas so more text fits
          const taFontSize = Math.min(fontSize, Math.max(8, Math.floor(fh / 8)));
          textArea.setFontSize(taFontSize);
          textArea.defaultUpdateAppearances(font);
          textareaCount++;
          break;
        }

        case 'checkbox': {
          const checkbox = form.createCheckBox(name);
          // Center the checkbox in its allocated space
          const cbSize = Math.min(fw, fh, 14);
          const cbX = fx + (fw - cbSize) / 2;
          const cbY = fy + (fh - cbSize) / 2;
          checkbox.addToPage(page, { x: cbX, y: cbY, width: cbSize, height: cbSize });
          checkboxCount++;
          break;
        }

        case 'radio': {
          if (!group) {
            console.warn(`[fields] Radio "${name}" has no group, treating as checkbox`);
            const cb = form.createCheckBox(name);
            const cbSize = Math.min(fw, fh, 14);
            cb.addToPage(page, { x: fx, y: fy, width: cbSize, height: cbSize });
            checkboxCount++;
            break;
          }

          let radioGroup;
          if (radioGroups.has(group)) {
            radioGroup = radioGroups.get(group);
          } else {
            radioGroup = form.createRadioGroup(group);
            radioGroups.set(group, radioGroup);
          }

          const rbSize = Math.min(fw, fh, 14);
          const rbX = fx + (fw - rbSize) / 2;
          const rbY = fy + (fh - rbSize) / 2;
          radioGroup.addOptionToPage(name, page, { x: rbX, y: rbY, width: rbSize, height: rbSize });
          radioCount++;
          break;
        }

        default:
          console.warn(`[fields] Unknown field type "${type}" for "${name}", defaulting to text`);
          const fallback = form.createTextField(name);
          fallback.addToPage(page, { x: fx, y: fy, width: fw, height: fh });
          fallback.setFontSize(fontSize);
          fallback.defaultUpdateAppearances(font);
          textCount++;
      }
    } catch (err) {
      console.warn(`[fields] Error adding "${name}": ${err.message}`);
      skippedCount++;
    }
  }

  // Flatten form appearance so fields render correctly in all viewers
  form.updateFieldAppearances(font);

  console.log(`[fields] Added: ${textCount} text, ${textareaCount} textarea, ${checkboxCount} checkbox, ${radioCount} radio`);
  if (skippedCount > 0) console.log(`[fields] Skipped: ${skippedCount}`);

  console.log('[fields] Saving fillable PDF...');
  const fillableBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, fillableBytes);

  const stats = fs.statSync(outputPath);
  console.log(`[fields] Fillable PDF written: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

module.exports = { addFields };
