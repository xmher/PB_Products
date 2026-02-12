/**
 * extract-fields.js — Puppeteer-based field coordinate extraction
 *
 * Opens an HTML file in headless Chrome, waits for Paged.js to finish rendering,
 * then extracts the bounding rect of every element marked with data-field-name.
 *
 * Returns an array of field descriptors with exact page-relative coordinates
 * in PDF points (72 pts/inch).
 *
 * REUSABLE: Works with any HTML file that uses the data-field-* convention.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Ratio to convert CSS px (96 dpi) → PDF points (72 dpi)
const PX_TO_PT = 72 / 96;

/**
 * Set up request interception to serve Paged.js from local node_modules
 * if the CDN is unavailable. Falls through to network if no local copy exists.
 */
async function setupRequestInterception(page) {
  const localPagedJs = path.resolve(__dirname, 'node_modules/pagedjs/dist/paged.polyfill.js');
  if (!fs.existsSync(localPagedJs)) return;

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.url().includes('paged') && request.url().includes('unpkg.com')) {
      // Serve Paged.js from local node_modules as fallback
      console.log('[intercept] Serving local Paged.js (CDN fallback)');
      request.respond({
        status: 200,
        contentType: 'application/javascript',
        body: fs.readFileSync(localPagedJs, 'utf8'),
      });
    } else {
      request.continue();
    }
  });
}

/**
 * Extract field coordinates from a Paged.js-rendered HTML file.
 *
 * @param {string} htmlPath  — Absolute path to the HTML file
 * @param {object} opts
 * @param {string} opts.chromePath — Path to Chrome/Chromium binary
 * @param {number} opts.timeout   — Max ms to wait for Paged.js render (default 120000)
 * @returns {Promise<{ fields: object[], pageCount: number, pageSizePt: {width:number,height:number} }>}
 */
async function extractFields(htmlPath, opts = {}) {
  const {
    chromePath = null,
    timeout = 120000,
  } = opts;

  const launchOpts = {
    headless: true,
    protocolTimeout: timeout * 2,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  };
  if (chromePath) launchOpts.executablePath = chromePath;

  const browser = await puppeteer.launch(launchOpts);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await setupRequestInterception(page);

    const fileUrl = 'file://' + path.resolve(htmlPath);
    console.log('[extract] Loading', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout });

    // Wait for Paged.js to finish rendering
    console.log('[extract] Waiting for Paged.js to complete...');
    await page.waitForFunction(
      () => {
        // Paged.js adds .pagedjs_page when done; check that pages exist
        const pages = document.querySelectorAll('.pagedjs_page');
        return pages.length > 0;
      },
      { timeout }
    );

    // Extra settle time for Paged.js to finalize layout
    await new Promise(r => setTimeout(r, 3000));

    // Extract all field positions from the rendered DOM
    console.log('[extract] Extracting field coordinates...');
    const result = await page.evaluate((pxToPt) => {
      const pages = Array.from(document.querySelectorAll('.pagedjs_page'));
      const pageCount = pages.length;

      // Get page dimensions from the first page
      const firstPage = pages[0];
      const firstRect = firstPage.getBoundingClientRect();
      const pageSizePt = {
        width: firstRect.width * pxToPt,
        height: firstRect.height * pxToPt,
      };

      // Build a map of page element → page index
      const pageMap = new Map();
      pages.forEach((p, i) => pageMap.set(p, i));

      const fields = [];
      const fieldElements = document.querySelectorAll('[data-field-name]');

      fieldElements.forEach(el => {
        // Walk up to find which .pagedjs_page this element lives in
        let pageEl = el.closest('.pagedjs_page');
        if (!pageEl) return;

        const pageIndex = pageMap.get(pageEl);
        if (pageIndex === undefined) return;

        const pageRect = pageEl.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // Calculate position relative to the page, in PDF points
        // PDF coordinate system: origin at bottom-left, Y goes up
        const x = (elRect.left - pageRect.left) * pxToPt;
        const yFromTop = (elRect.top - pageRect.top) * pxToPt;
        const width = elRect.width * pxToPt;
        const height = elRect.height * pxToPt;

        // Convert to PDF bottom-up Y
        const y = pageSizePt.height - yFromTop - height;

        fields.push({
          name: el.dataset.fieldName,
          type: el.dataset.fieldType || 'text',
          group: el.dataset.fieldGroup || null,
          page: pageIndex,
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          width: Math.round(width * 100) / 100,
          height: Math.round(height * 100) / 100,
        });
      });

      return { fields, pageCount, pageSizePt };
    }, PX_TO_PT);

    console.log(`[extract] Found ${result.fields.length} fields across ${result.pageCount} pages`);
    return result;

  } finally {
    await browser.close();
  }
}

/**
 * Generate a flat (non-fillable) PDF from the HTML using Puppeteer's print.
 *
 * @param {string} htmlPath  — Absolute path to the HTML file
 * @param {string} outputPath — Where to write the flat PDF
 * @param {object} opts
 */
async function generateFlatPdf(htmlPath, outputPath, opts = {}) {
  const {
    chromePath = null,
    timeout = 120000,
  } = opts;

  const launchOpts = {
    headless: true,
    protocolTimeout: timeout * 2,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  };
  if (chromePath) launchOpts.executablePath = chromePath;

  const browser = await puppeteer.launch(launchOpts);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await setupRequestInterception(page);

    const fileUrl = 'file://' + path.resolve(htmlPath);
    console.log('[pdf] Loading', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout });

    // Wait for Paged.js
    console.log('[pdf] Waiting for Paged.js to complete...');
    await page.waitForFunction(
      () => document.querySelectorAll('.pagedjs_page').length > 0,
      { timeout }
    );
    await new Promise(r => setTimeout(r, 3000));

    // Hide HTML form inputs that will be replaced by AcroForm fields.
    // This prevents doubled checkboxes/text fields in the flat PDF.
    // visibility:hidden keeps element dimensions (for layout) but hides the visual.
    console.log('[pdf] Hiding HTML inputs (replaced by AcroForm fields)...');
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        /* Hide inputs that have data-field-name directly */
        input[data-field-name],
        /* Hide inputs inside elements that have data-field-name */
        [data-field-name] input[type="checkbox"],
        [data-field-name] input[type="text"],
        [data-field-name] input[type="radio"] {
          visibility: hidden !important;
        }
        /* Hide contenteditable borders/backgrounds — AcroForm fields replace them */
        [data-field-name][contenteditable] {
          border-color: transparent !important;
          background: transparent !important;
        }
      `;
      document.head.appendChild(style);
    });

    console.log('[pdf] Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
    });

    const stats = fs.statSync(outputPath);
    console.log(`[pdf] Flat PDF written: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  } finally {
    await browser.close();
  }
}

module.exports = { extractFields, generateFlatPdf };
