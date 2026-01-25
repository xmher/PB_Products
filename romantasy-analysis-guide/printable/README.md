# Romantasy Analysis Guide - Printable PDF Version

## Overview

This folder contains an HTML file styled with CSS and Paged.js for generating a print-ready PDF of the Romantasy Analysis Guide.

## Files

- `romantasy-analysis-guide.html` - The main HTML file with embedded CSS and Paged.js configuration

## Generating the PDF

### Method 1: Using a Browser (Recommended for Quick Generation)

1. Open `romantasy-analysis-guide.html` in a modern browser (Chrome or Firefox recommended)
2. Wait for Paged.js to finish rendering (you'll see the pages format automatically)
3. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
4. Select "Save as PDF" as the destination
5. Ensure these settings:
   - Paper size: Letter (8.5" x 11")
   - Margins: Default (the CSS handles margins)
   - Background graphics: ON (to preserve colors)
6. Click Save

### Method 2: Using Paged.js CLI (Best for Production)

For higher quality PDF generation, use the Paged.js CLI tool:

```bash
# Install Paged.js CLI globally
npm install -g pagedjs-cli

# Generate PDF from HTML
pagedjs-cli romantasy-analysis-guide.html -o romantasy-analysis-guide.pdf
```

### Method 3: Using Puppeteer (Programmable)

For automated PDF generation:

```bash
# Install dependencies
npm install puppeteer

# Create a generation script (generate-pdf.js):
```

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the HTML file
    const htmlPath = path.join(__dirname, 'romantasy-analysis-guide.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Wait for Paged.js to finish rendering
    await page.waitForSelector('.pagedjs_pages');
    await page.waitForTimeout(2000); // Extra time for complex layouts

    // Generate PDF
    await page.pdf({
        path: 'romantasy-analysis-guide.pdf',
        format: 'Letter',
        printBackground: true,
        preferCSSPageSize: true
    });

    await browser.close();
    console.log('PDF generated successfully!');
}

generatePDF();
```

```bash
# Run the script
node generate-pdf.js
```

## Print Specifications

The guide is designed with these print specifications:

| Property | Value |
|----------|-------|
| Page Size | US Letter (8.5" x 11") |
| Margins | 0.75" sides, 1" bottom |
| Font Size | 11pt body, 10pt tables |
| Color Mode | Full color (works in B&W too) |
| Recommended Paper | 24lb or heavier for writing |

## Booklet Printing

To print as a booklet (folded pages):

1. Generate the PDF using any method above
2. Open in Adobe Acrobat or similar
3. Print → Booklet
4. Select "Both sides" printing
5. Binding: Left
6. Sheets per booklet: Auto

For home printers without duplex:
1. Print odd pages first
2. Flip the stack
3. Print even pages

## Customization

### Changing Colors

Edit the CSS variables at the top of the HTML file:

```css
:root {
    --color-primary: #8B4A6B;    /* Main headings, accents */
    --color-secondary: #D4A5A5;  /* Borders, subtle accents */
    --color-accent: #4A6B8B;     /* Subheadings */
    --color-romance: #E8B4B8;    /* Romance section boxes */
    --color-fantasy: #A8C5DB;    /* Fantasy section boxes */
    --color-craft: #C5B8E8;      /* Craft/why-it-matters boxes */
    --color-world: #B8E8C5;      /* World-building boxes */
}
```

### Adding More Chapter Logs

The HTML includes 5 chapter log templates. To add more, copy this block and paste it after the existing ones:

```html
<div class="chapter-log">
    <div class="chapter-log-header">
        <div><strong>Chapter:</strong> ______<br><strong>Pages:</strong> ______ - ______</div>
        <div><strong>POV Character:</strong><br>_________________________</div>
        <div><strong>Location:</strong><br>_________________________</div>
    </div>
    <h4>One-Line Summary:</h4>
    <div class="write-space-small"></div>
    <!-- ... rest of template ... -->
</div>
```

### Adjusting Writing Space

The guide uses three sizes of lined writing areas:
- `.write-space-small` - 0.5 inches
- `.write-space` - 0.8 inches
- `.write-space-large` - 1.5 inches

Modify the `min-height` property in the CSS to adjust.

## Troubleshooting

**Pages not formatting correctly:**
- Ensure JavaScript is enabled in your browser
- Wait for Paged.js to fully load (watch for the pages to snap into place)
- Try a different browser (Chrome works best)

**PDF is cutting off content:**
- Check that "Fit to page" is disabled in print settings
- Ensure margins are set to "Default"

**Colors not printing:**
- Enable "Background graphics" in print settings
- Check your printer's color settings

**Text too small:**
- The guide is optimized for Letter size; if printing smaller, increase the base font size in CSS

## Digital Annotation

This PDF works well with digital annotation tools:
- iPad + Apple Pencil + GoodNotes/Notability
- Android tablets + stylus + Xodo
- Desktop: Adobe Acrobat, PDF-XChange Editor

For best digital annotation experience, use the PDF without printing.
