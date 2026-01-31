# Fillable PDF Pipeline

Automated pipeline that converts HTML workbooks into optimized fillable PDFs with pixel-perfect form field placement.

## How It Works

```
HTML (with data-field-* markers)
  → Puppeteer loads in Chrome
  → Paged.js renders pages
  → JavaScript extracts exact getBoundingClientRect() for every field
  → Exports flat PDF + field coordinates JSON
  → pdf-lib injects AcroForm fields at those exact positions
  → Output: fillable PDF
```

Field positions come from the **actual rendered layout**, not estimates. This eliminates alignment issues.

## Quick Start (Romantasy Guide)

```bash
cd tools/fillable-pdf
npm install
npm run build:romantasy
```

This runs:
1. **Annotate** — Adds `data-field-*` attributes to the HTML (956 fields across chapters, tables, writing spaces, checklists)
2. **Extract** — Opens the annotated HTML in Chrome, waits for Paged.js, extracts field coordinates
3. **Generate** — Creates the flat PDF from the same render
4. **Inject** — Adds AcroForm fields at the extracted coordinates
5. **Output** — `romantasy-analysis-guide/printable/Reading-Romantasy-Analysis-Guide-FILLABLE.pdf`

## Reusing for Other Projects

### Step 1: Mark Up Your HTML

Add `data-field-*` attributes to every element that should become fillable:

```html
<!-- Text field -->
<span class="field-value" data-field-name="title" data-field-type="text"></span>

<!-- Multi-line textarea -->
<div class="write-space" data-field-name="notes" data-field-type="textarea"></div>

<!-- Checkbox -->
<li data-field-name="agree" data-field-type="checkbox">I agree</li>

<!-- Radio button (needs a group) -->
<span data-field-name="opt_a" data-field-type="radio" data-field-group="choice">A</span>
<span data-field-name="opt_b" data-field-type="radio" data-field-group="choice">B</span>
```

Field types: `text`, `textarea`, `checkbox`, `radio`

### Step 2: Run the Pipeline

```bash
node src/generate.js \
  --input path/to/your-workbook.html \
  --output path/to/your-workbook-FILLABLE.pdf
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--input, -i` | HTML file with data-field-* attributes | required |
| `--output, -o` | Output fillable PDF path | required |
| `--flat-pdf` | Intermediate flat PDF path | auto |
| `--fields-json` | Field coordinates JSON path | auto |
| `--chrome` | Chrome/Chromium binary path | auto-detect |
| `--font-size` | Default font size for text fields | 10 |
| `--skip-extract` | Reuse existing fields JSON | false |
| `--skip-pdf` | Reuse existing flat PDF | false |
| `--timeout` | Max ms for Paged.js render | 120000 |

### Iterating Quickly

After the first run, use `--skip-extract --skip-pdf` to skip the slow Puppeteer steps and only re-inject fields (useful for tweaking field properties):

```bash
node src/generate.js \
  --input your-workbook.html \
  --output your-workbook-FILLABLE.pdf \
  --skip-extract --skip-pdf \
  --font-size 9
```

## Writing an Annotation Script

For each project, write a script (like `annotate-romantasy-guide.js`) that reads your HTML and adds `data-field-*` attributes. Common patterns:

- **Writing spaces** (`<div class="write-space">`) → `data-field-type="textarea"`
- **Field-value spans** (`<span class="field-value">`) → `data-field-type="text"`
- **Checklist items** (`<li>` in `.checklist`) → `data-field-type="checkbox"`
- **Rating scales** → `data-field-type="radio"` with `data-field-group`
- **Empty table cells** (`<td></td>`) → `data-field-type="textarea"`
- **Underscore blanks** (`_____`) → replace with a span with `data-field-type="text"`

## Performance Notes

The pipeline produces optimized fillable PDFs by design:

- **Pure AcroForm fields** — no JavaScript in the PDF, zero input latency
- **Standard fonts** (Helvetica) for form fields — minimal embedding overhead
- **No calculation chains** — typing in one field doesn't trigger recalculation of others

For further optimization of the output PDF:
- Use `qpdf --linearize` for Fast Web View (page-at-a-time loading)
- Use `qpdf --optimize-images` for image compression
- Font subsetting with tools like `mutool clean -gggg`

## Architecture

```
src/
├── generate.js                 # Main orchestrator (CLI entry point)
├── extract-fields.js           # Puppeteer: render HTML → extract coordinates + flat PDF
├── add-fields.js               # pdf-lib: inject AcroForm fields into flat PDF
└── annotate-romantasy-guide.js # Project-specific: annotate the romantasy guide HTML
```
