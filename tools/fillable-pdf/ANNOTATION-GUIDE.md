# Annotation Script Reference — How to Write annotation scripts for PlotBrew HTML workbooks

This file contains everything Claude Code needs to write annotation scripts for the fillable PDF pipeline.

## What the annotation script does

It reads an HTML file and adds `data-field-name` and `data-field-type` (and optionally `data-field-group`) attributes to every element that should become a fillable form field in the PDF. It outputs a new `-fillable.html` file.

## The data-field-* convention

```html
<!-- Text field (single line) -->
<span data-field-name="pre_title" data-field-type="text"></span>

<!-- Textarea (multi-line) -->
<div data-field-name="ch1_summary" data-field-type="textarea"></div>

<!-- Checkbox -->
<li data-field-name="ch1_beat_plot" data-field-type="checkbox">...</li>

<!-- Radio (pick one from group) -->
<span data-field-name="pre_heat_0" data-field-type="radio" data-field-group="pre_heat">0</span>
```

Field types: `text`, `textarea`, `checkbox`, `radio`

## Naming convention

Use a prefix per section, then a descriptive name:
- `pre_` = pre-read section
- `ch1_` through `ch100_` = chapter logs
- `s3_`, `s4_`, `s5_` etc = numbered sections
- `app_` = appendix

Examples: `pre_title`, `ch1_pages_start`, `ch1_beat_plot`, `s5_dual_arc_1`, `s9_cell_1`

Every `data-field-name` must be unique across the entire document.

## Element types to look for

These are the common fillable element patterns in PlotBrew HTML workbooks:

### 1. Contenteditable write-spaces
```html
<div class="write-space-xs" contenteditable="true"></div>
<div class="write-space-sm" contenteditable="true"></div>
<div class="write-space-md" contenteditable="true"></div>
<div class="write-space-lg" contenteditable="true"></div>
```
→ Add `data-field-type="textarea"` to each one

### 2. Contenteditable write-lines
```html
<div class="write-lines" contenteditable="true"></div>
```
→ Add `data-field-type="textarea"`

### 3. Contenteditable field-value spans
```html
<span class="field-value" contenteditable="true"></span>
```
→ Add `data-field-type="text"`

### 4. Input text fields
```html
<input type="text">
```
These already exist as HTML form inputs. They still need `data-field-name` and `data-field-type="text"` added for the PDF pipeline to find them.

### 5. Input checkboxes
```html
<input type="checkbox">
```
Need `data-field-name` and `data-field-type="checkbox"`.

### 6. Rating scale checkboxes (should be radio in PDF)
```html
<div class="rating-scale">
    <label class="rating-check"><input type="checkbox"> 0</label>
    <label class="rating-check"><input type="checkbox"> 1</label>
    ...
</div>
```
These are "check one" scales — use `data-field-type="radio"` with `data-field-group` so only one can be selected.

### 7. Tension scale checkboxes (should be radio in PDF)
```html
<div class="tension-scale">
    <label><input type="checkbox"> <span>1</span></label>
    ...
    <label><input type="checkbox"> <span>10</span></label>
</div>
```
Same as rating scales — use `data-field-type="radio"` with a group per row (e.g., `ch1_tension_romance`, `ch1_tension_plot`).

### 8. Checklist checkboxes (stay as checkboxes in PDF)
```html
<ul class="checklist">
    <li><label><input type="checkbox"> Plot</label></li>
    <li><label><input type="checkbox"> Romance</label></li>
</ul>
```
Use `data-field-type="checkbox"` — these are multi-select.

### 9. Custom trope entries (checkbox + text input combo)
```html
<li><label><input type="checkbox"> <input type="text" style="..."></label></li>
```
Both the checkbox AND the text input need separate `data-field-name` attributes.

### 10. Empty table cells
```html
<td style="height: 0.95in; vertical-align: top;"></td>
```
→ Add `data-field-type="textarea"` (skip cells that already have content — those are reference/label cells)

### 11. Inline check elements
```html
<label class="inline-check"><input type="checkbox"> Fantasy</label>
```
Used for "circle one" style selections. Consider whether these should be `checkbox` or `radio` with a group.

### 12. Y / N cells
```html
<td>Y / N</td>
```
→ Add `data-field-type="text"` (user types Y or N)

### 13. Contenteditable chapter numbers
```html
<div class="chapter-number" contenteditable="true">Chapter 1</div>
```
→ Add `data-field-type="text"` if you want users to be able to rename chapters in the PDF

## Script structure

```javascript
const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, 'your-workbook.html');
const OUTPUT = path.resolve(__dirname, 'your-workbook-fillable.html');

let html = fs.readFileSync(INPUT, 'utf8');
let fieldCount = 0;

// Process section by section using html.indexOf() to find section boundaries
// Use regex replacements scoped to each section to add data-field-* attributes
// Increment fieldCount for each field added

fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`Annotation complete! Fields annotated: ${fieldCount}`);
```

## CRITICAL: Put data-field-* on the INPUT element, not the wrapper

When the HTML has `<input type="checkbox">` or `<input type="text">`, the `data-field-*` attributes MUST go directly on the `<input>` element — NOT on the parent `<li>`, `<label>`, or `<div>`.

The pipeline uses `getBoundingClientRect()` on the element with `data-field-name` to determine the size and position of the PDF form field. If you put it on the `<li>`, the PDF checkbox will be the size of the entire list item (too big). If you put it on the `<input>`, the PDF checkbox will match the small checkbox square (correct).

**WRONG — checkbox covers entire list item:**
```html
<li data-field-name="ch1_beat_plot" data-field-type="checkbox"><label><input type="checkbox"> Plot</label></li>
```

**RIGHT — checkbox matches the input size:**
```html
<li><label><input type="checkbox" data-field-name="ch1_beat_plot" data-field-type="checkbox"> Plot</label></li>
```

**WRONG — text field covers entire label:**
```html
<label data-field-name="ch1_pov" data-field-type="text"><strong>POV:</strong> <input type="text"></label>
```

**RIGHT — text field matches the input:**
```html
<label><strong>POV:</strong> <input type="text" data-field-name="ch1_pov" data-field-type="text"></label>
```

The pipeline automatically hides HTML inputs that have `data-field-name` when generating the flat PDF, so the AcroForm field replaces the HTML input cleanly with no doubling.

## Important rules

1. Every `data-field-name` must be UNIQUE across the entire document
2. ALWAYS put `data-field-*` on the `<input>` element itself, not on wrapper elements like `<li>`, `<label>`, or `<div>`
3. Use section prefixes to avoid name collisions (especially in repeated structures like chapter logs)
4. Skip reference/example content — only annotate elements the user should fill in
5. Skip cells/elements that already have text content (those are labels, not fillable fields)
6. For chapter logs, loop through all chapters (could be 30 or 100) using the `id="chapter-N"` pattern
7. Process sections by finding start/end boundaries with `html.indexOf()` to avoid accidental matches across sections
8. The script reads from `__dirname` (same folder) and writes to the same folder

## Reference implementation

See `annotate-romantasy-guide.js` for a complete working example that handles all of these element types.
