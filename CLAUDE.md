# PB Products — Codebase Guide

## Repository Overview
Romantasy/dark romance writing tools product line. Each product is a printable workbook built with HTML + Paged.js, rendered to PDF via Puppeteer.

### Products
- `morally-grey-workbook/` — Morally Grey Love Interest Workbook
- (Future workbooks follow the same structure)

### Tools
- `tools/fillable-pdf/` — Shared PDF pipeline (Puppeteer + pdf-lib + qpdf)
  - `src/analyze-layout.js` — Page layout analyzer for Paged.js workbooks
  - `src/generate.js` — PDF generation from HTML
  - `src/extract-fields.js` — PDF form field extraction

## Design System

### Fonts
- **Display:** Libre Baskerville (headings, titles)
- **Accent:** Cormorant Garamond (quotes, lead text, hints)
- **Body:** Inter (paragraphs, labels, form fields)

### Write-space CSS sizes
These are the blank answer boxes users write in:
- `write-space-xs`: 45px
- `write-space-sm`: 70px
- `write-space` (default): 120px
- `write-space-md`: 150px
- `write-space-lg`: 220px
- Custom: add `style="min-height: Npx;"` for precise sizing

## Page Layout Workflow (Paged.js Workbooks)

### Running the Analyzer
From `tools/fillable-pdf/`:
```
node src/analyze-layout.js <path-to-html> [--threshold 25] [--json]
```

Example:
```
node src/analyze-layout.js ../../morally-grey-workbook/printable/morally-grey-workbook.html
```

Use `--json` and pipe to a script for programmatic analysis. Use `--threshold N` to change the underfilled % cutoff (default 25).

### The Fix Loop
1. Run the analyzer to identify underfilled pages (pages with gap > ~80px that have expandable elements)
2. For each underfilled page, expand writable elements to fill the gap:
   - **Write-spaces:** increase class size (xs → sm → md → lg) or add inline `style="min-height: Npx;"`
   - **Table cells** containing write-spaces: same approach — but remember the row height equals the tallest cell, so all cells in a row grow together
   - **Two-col / three-col boxes:** expanding a write-space inside one column expands the whole row
   - **Pages with no expandable elements:** add a reflection prompt + write-space to fill the gap
3. Re-run the analyzer after each batch of fixes
4. Repeat until issues are minimized (aim for 90%+ average fill)

### Critical Rules

**Don't overshoot write-space sizes.** If a write-space is too large to fit on the page with its preceding content, `break-inside: avoid` pushes it to the next page — creating TWO underfilled pages instead of fixing one.

**Rule of thumb:** max write-space min-height = page bottom gap minus ~40px (to account for element margins).

**Page content area** is approximately **890px tall** (8.5in × 11in page with 70px/80px/100px/80px margins).

**CSS break properties already set:**
- `break-inside: avoid` on: `.worksheet-body`, all `.write-space` variants, `.field-row`, `.two-col`, `.three-col`
- `break-after: avoid` on: `h2`, `h3`, `h4`, `.hint`

### Puppeteer / Headless Chrome Notes
- Use `puppeteer-core` (not `puppeteer`) to avoid bundled Chromium download
- Use the `headless_shell` binary with `headless: 'shell'` mode — regular Chromium crashes on large Paged.js renders
- Google Fonts are swapped for system fonts during analysis (Georgia, Times New Roman, Arial) to avoid DNS hangs — this doesn't affect real rendering, just layout analysis
- The analyzer serves files via a local HTTP server to avoid `file://` CORS issues
