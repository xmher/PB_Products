# Fillable PDF Pipeline

Converts HTML workbooks into optimized fillable PDFs with pixel-perfect form field placement.

## How It Works

1. You put your HTML file in a folder with these tool files
2. An annotation script marks which elements should be fillable
3. Puppeteer opens the HTML in Chrome, extracts exact positions of every field
4. pdf-lib injects AcroForm form fields at those exact positions
5. You get a fillable PDF

## Setup (One Time)

1. Install [Node.js](https://nodejs.org/) (LTS version)
2. Make sure you have Google Chrome installed

## Folder Structure

Copy these files into the same folder as your HTML:

```
your-project-folder/
├── your-workbook.html              ← your HTML file
├── annotate-your-workbook.js       ← annotation script (ask Claude Code to write this)
├── generate.js                     ← pipeline engine
├── extract-fields.js               ← field extractor
├── add-fields.js                   ← field injector
├── package.json                    ← dependencies
```

## Running It (Romantasy Guide Example)

1. Put `romantasy-analysis-guide.html` in the same folder as the tool files
2. Open a terminal in that folder
3. Run:

```bash
npm install
npm run build:romantasy
```

The fillable PDF appears in the same folder.

## Running It (Any Other Project)

1. Put your HTML file in the folder with the tool files
2. Ask Claude Code to write an annotation script for your HTML (use `annotate-romantasy-guide.js` as a reference)
3. Run the annotation script: `node annotate-your-workbook.js`
4. Run the pipeline:

```bash
node generate.js --input your-workbook-fillable.html --output Your-Workbook-FILLABLE.pdf
```

## Options

| Flag | What it does | Default |
|------|-------------|---------|
| `--input, -i` | Your annotated HTML file | required |
| `--output, -o` | Output fillable PDF name | required |
| `--font-size` | Font size in text fields | 10 |
| `--timeout` | Max wait time in ms | 120000 |
| `--skip-extract` | Reuse saved field positions | false |
| `--skip-pdf` | Reuse saved flat PDF | false |

## Field Types

When marking up HTML (or when Claude Code writes the annotation script), these are the field types:

```html
<!-- Text field (single line) -->
<span data-field-name="title" data-field-type="text"></span>

<!-- Textarea (multi-line writing space) -->
<div data-field-name="notes" data-field-type="textarea"></div>

<!-- Checkbox -->
<li data-field-name="agree" data-field-type="checkbox">I agree</li>

<!-- Radio button (pick one from a group) -->
<span data-field-name="opt_a" data-field-type="radio" data-field-group="choice">A</span>
<span data-field-name="opt_b" data-field-type="radio" data-field-group="choice">B</span>
```
