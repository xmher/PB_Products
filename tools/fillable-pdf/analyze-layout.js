#!/usr/bin/env node

/**
 * analyze-layout.js — Page layout analyzer for Paged.js workbooks
 *
 * Opens an HTML file in headless Chrome, waits for Paged.js to render,
 * then analyzes each page for layout issues:
 *   - Underfilled pages (large gaps of unused space)
 *   - Orphaned headings (heading near bottom with content on next page)
 *   - Near-empty pages (only a small amount of content)
 *   - Write spaces that could be expanded to fill available room
 *
 * Usage:
 *   node analyze-layout.js <html-file> [--threshold 25] [--json] [--timeout 120000]
 *
 * Options:
 *   --threshold   Percentage of empty space to flag as underfilled (default: 25)
 *   --json        Output raw JSON instead of formatted report
 *   --timeout     Max ms to wait for Paged.js render (default: 120000)
 *
 * REUSABLE: Works with any HTML file that uses Paged.js.
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

// ─── Argument parsing ──────────────────────────────────────────────

function parseArgs(argv) {
  const args = { threshold: 25, json: false, timeout: 120000 };
  const positional = [];

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--threshold':
        args.threshold = parseInt(argv[++i], 10); break;
      case '--json':
        args.json = true; break;
      case '--timeout':
        args.timeout = parseInt(argv[++i], 10); break;
      case '--help': case '-h':
        printUsage(); process.exit(0);
      default:
        if (arg.startsWith('--')) {
          console.error(`Unknown argument: ${arg}`);
          process.exit(1);
        }
        positional.push(arg);
    }
  }

  args.input = positional[0];
  return args;
}

function printUsage() {
  console.log(`
analyze-layout — Detect layout issues in Paged.js workbooks

Usage:
  node analyze-layout.js <html-file> [options]

Options:
  --threshold <n>   % of empty space to flag as underfilled (default: 25)
  --json            Output raw JSON data instead of formatted report
  --timeout <ms>    Max ms to wait for Paged.js render (default: 120000)
  -h, --help        Show this help

Examples:
  node analyze-layout.js ../../morally-grey-workbook/printable/morally-grey-workbook.html
  node analyze-layout.js ../../spice-scene-workbook/printable/spice-scene-workbook.html --threshold 30 --json
  `.trim());
}

// ─── Chrome auto-detection (reused from generate.js) ───────────────

function findChrome() {
  const candidates = [
    ...findPlaywrightChrome(),
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function findPlaywrightChrome() {
  const cacheDir = path.join(process.env.HOME || '/root', '.cache', 'ms-playwright');
  if (!fs.existsSync(cacheDir)) return [];
  try {
    const entries = fs.readdirSync(cacheDir);
    const results = [];
    // Prefer headless_shell builds (more stable for large pages)
    entries
      .filter(e => e.startsWith('chromium_headless_shell'))
      .sort().reverse()
      .forEach(e => results.push(path.join(cacheDir, e, 'chrome-linux', 'headless_shell')));
    // Fall back to regular chromium
    entries
      .filter(e => e.startsWith('chromium') && !e.includes('headless_shell'))
      .sort().reverse()
      .forEach(e => results.push(path.join(cacheDir, e, 'chrome-linux', 'chrome')));
    return results;
  } catch { return []; }
}

// ─── Paged.js local fallback (reused from extract-fields.js) ──────

async function setupRequestInterception(page) {
  const localPagedJs = path.resolve(__dirname, '../node_modules/pagedjs/dist/paged.polyfill.js');
  if (!fs.existsSync(localPagedJs)) {
    console.error('[intercept] No local Paged.js found, relying on CDN');
    return;
  }

  await page.setRequestInterception(true);
  const localContent = fs.readFileSync(localPagedJs, 'utf8');
  console.error(`[intercept] Local Paged.js ready (${(localContent.length / 1024).toFixed(0)} KB)`);

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('paged') && (url.includes('unpkg.com') || url.includes('cdn'))) {
      console.error('[intercept] Serving local Paged.js for:', url);
      request.respond({
        status: 200,
        contentType: 'application/javascript',
        body: localContent,
      });
    } else if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
      // Respond with empty CSS/font to avoid DNS hangs, with CORS headers
      console.error('[intercept] Serving empty font response for:', url.substring(0, 60));
      request.respond({
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': url.includes('.woff') ? 'font/woff2' : 'text/css',
        },
        body: '',
      });
    } else if (url.startsWith('file://') || url.startsWith('data:')) {
      request.continue();
    } else {
      console.error('[intercept] Blocking external request:', url);
      request.abort('blockedbyclient');
    }
  });
}

// ─── Core analysis ────────────────────────────────────────────────

async function analyzeLayout(htmlPath, opts = {}) {
  const { timeout = 120000 } = opts;
  const chromePath = findChrome();

  const launchOpts = {
    headless: 'shell',
    protocolTimeout: timeout * 2,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-background-networking',
      '--single-process',
      '--font-render-hinting=none',
      '--js-flags=--max-old-space-size=4096',
    ],
  };
  if (chromePath) launchOpts.executablePath = chromePath;

  const browser = await puppeteer.launch(launchOpts);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Capture ALL browser console output for debugging
    page.on('console', msg => {
      console.error(`[browser:${msg.type()}] ${msg.text()}`);
    });
    page.on('pageerror', err => console.error('[browser:pageerror]', err.message));

    // No document.fonts override needed -- we strip Google Fonts and
    // replace font-families with system fonts in the HTML server below

    // Serve files via a local HTTP server to avoid file:// CORS issues
    const http = require('http');
    const htmlDir = path.dirname(path.resolve(htmlPath));
    const localPagedJsPath = path.resolve(__dirname, '../node_modules/pagedjs/dist/paged.polyfill.js');
    const localPagedJsContent = fs.readFileSync(localPagedJsPath, 'utf8');
    const htmlFileName = path.basename(htmlPath);

    const server = http.createServer((req, res) => {
      const url = req.url;
      console.error(`[server] ${req.method} ${url}`);

      // Serve Paged.js locally
      if (url.includes('paged.polyfill.js')) {
        console.error('[server] Serving local Paged.js');
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(localPagedJsContent);
        return;
      }

      // Serve the HTML file (with font links stripped)
      if (url === '/' || url === `/${htmlFileName}`) {
        let html = fs.readFileSync(path.resolve(htmlPath), 'utf8');
        // Strip Google Fonts (fallback to system fonts)
        html = html.replace(
          /<link\s+href=["'][^"']*fonts\.googleapis\.com[^"']*["'][^>]*>/gi,
          ''
        );
        // Repoint Paged.js to our local server
        html = html.replace(
          /https:\/\/unpkg\.com\/pagedjs\/dist\/paged\.polyfill\.js/g,
          '/paged.polyfill.js'
        );
        // Replace Google Fonts with system fonts so Paged.js doesn't
        // hang waiting for fonts that will never load.
        // Metrics will differ slightly from real fonts but page breaks
        // will be close enough for layout analysis.
        html = html.replace(/'Libre Baskerville'/g, 'Georgia');
        html = html.replace(/'Cormorant Garamond'/g, "'Times New Roman'");
        html = html.replace(/'Inter'/g, 'Arial');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      // Serve any other local files (CSS, images, etc.)
      const filePath = path.join(htmlDir, url);
      if (fs.existsSync(filePath)) {
        res.writeHead(200);
        res.end(fs.readFileSync(filePath));
        return;
      }

      res.writeHead(404);
      res.end('Not found');
    });

    const port = await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve(server.address().port));
    });
    console.error(`[server] Local server on http://127.0.0.1:${port}`);

    try {
      console.error('[analyze] Loading HTML via local server...');
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0', timeout });

      console.error('[analyze] Waiting for Paged.js to complete (polling)...');
      let pageCount = 0;
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        await new Promise(r => setTimeout(r, 2000));
        try {
          pageCount = await page.evaluate(() => {
            const pages = document.querySelectorAll('.pagedjs_page');
            return pages.length;
          });
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          console.error(`[analyze]   ${elapsed}s: ${pageCount} pages rendered`);
          if (pageCount > 0) {
            // Wait a bit more for rendering to fully stabilize
            await new Promise(r => setTimeout(r, 5000));
            pageCount = await page.evaluate(() => document.querySelectorAll('.pagedjs_page').length);
            console.error(`[analyze]   Final: ${pageCount} pages`);
            break;
          }
        } catch(e) {
          console.error(`[analyze]   Error during polling: ${e.message}`);
          break;
        }
      }
      if (pageCount === 0) {
        // Try to get diagnostics
        try {
          const diag = await page.evaluate(() => ({
            bodyLen: document.body.innerHTML.length,
            firstChild: document.body.firstElementChild ? document.body.firstElementChild.tagName + '.' + document.body.firstElementChild.className : 'none',
            pagedGlobals: Object.keys(window).filter(k => k.toLowerCase().includes('paged')).join(', '),
          }));
          console.error('[analyze] Diagnostics:', JSON.stringify(diag));
        } catch(e) {}
        throw new Error('Paged.js did not render any pages within the timeout period');
      }
      console.error('[analyze] Paged.js rendering complete.');

    console.error('[analyze] Extracting page layout data...');
    const layoutData = await page.evaluate(() => {
      const pages = Array.from(document.querySelectorAll('.pagedjs_page'));
      const results = [];

      // Leaf-level content selectors — avoid generic 'div' which matches
      // Paged.js wrapper elements and falsely reports 100% fill.
      const CONTENT_SELECTOR = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'table', 'ul', 'ol', 'hr', 'blockquote',
        '.write-space', '.write-space-xs', '.write-space-sm', '.write-space-md', '.write-space-lg',
        '.field-input', '.field-row',
        '.worksheet-header', '.worksheet-body',
        '.insight-box', '.example-box', '.danger-box', '.shadow-box', '.wound-box',
        '.principle-card', '.quick-ref',
        '.drive-track', '.timeline-track', '.moral-spectrum',
        '.checklist', '.two-col', '.three-col',
        '.section-title-page', '.title-page', '.toc-page',
        '.versus-table', '.beat-marker', '.spectrum-label',
      ].join(', ');

      pages.forEach((pageEl, pageIndex) => {
        const pageRect = pageEl.getBoundingClientRect();

        // Find the content area within the page (inside margins)
        const areaEl = pageEl.querySelector('.pagedjs_page_content')
          || pageEl.querySelector('.pagedjs_area')
          || pageEl;
        const areaRect = areaEl.getBoundingClientRect();
        const contentAreaHeight = areaRect.height;
        const contentAreaTop = areaRect.top;
        const contentAreaBottom = areaRect.bottom;

        // Query only leaf-level content elements
        const allEls = areaEl.querySelectorAll(CONTENT_SELECTOR);
        const elements = [];

        allEls.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.width === 0) return;
          // Clip to this page's content area
          if (r.top >= contentAreaBottom || r.bottom <= contentAreaTop) return;

          const tag = el.tagName.toLowerCase();
          const rawClasses = el.className || '';
          const classes = typeof rawClasses === 'string'
            ? rawClasses.split(/\s+/).filter(c => c && !c.startsWith('pagedjs')).join(' ')
            : '';

          // Skip if this is a Paged.js internal element with no meaningful classes
          if (!classes && tag === 'div') return;

          const isWriteSpace = rawClasses.includes('write-space') || rawClasses.includes('field-input');

          // Clamp element to content area boundaries
          const top = Math.max(r.top, contentAreaTop) - contentAreaTop;
          const bottom = Math.min(r.bottom, contentAreaBottom) - contentAreaTop;

          elements.push({
            tag,
            classes,
            text: el.textContent.trim().substring(0, 80),
            top: Math.round(top),
            bottom: Math.round(bottom),
            height: Math.round(bottom - top),
            isWriteSpace,
          });
        });

        // De-duplicate: remove parent elements that fully contain a child
        // Sort by top position, then largest first so parents come first
        elements.sort((a, b) => a.top - b.top || b.height - a.height);
        const filtered = [];
        for (const el of elements) {
          // Check if a more specific (smaller) element already covers this position
          const isDuplicate = filtered.some(f =>
            f.top >= el.top && f.bottom <= el.bottom && f !== el
            && el.height > f.height * 1.5
          );
          if (isDuplicate) continue;
          filtered.push(el);
        }

        // Measure the bottom gap: distance from the last content element's
        // bottom to the content area bottom.  This is the key metric for
        // detecting underfilled pages.
        let lastBottom = 0;
        for (const el of filtered) {
          if (el.bottom > lastBottom) lastBottom = el.bottom;
        }
        const bottomGap = contentAreaHeight - lastBottom;
        const usedHeight = lastBottom;  // top of content area to last element bottom
        const fillPct = contentAreaHeight > 0
          ? Math.round((usedHeight / contentAreaHeight) * 100)
          : 100;

        // Write spaces that could be expanded
        const writeSpaces = filtered.filter(e => e.isWriteSpace);

        // Headings near the bottom of the page (orphaned).
        // A heading is only truly orphaned if it's one of the last elements
        // on the page with minimal content after it.  If a heading has a
        // substantial following paragraph on the same page, it's acceptable.
        const headings = filtered.filter(e => ['h1', 'h2', 'h3', 'h4'].includes(e.tag));
        const orphanedHeadings = headings.filter(h => {
          if ((contentAreaHeight - h.bottom) >= 80) return false;
          // Check how much content appears after this heading on the page
          const contentAfter = filtered.filter(e =>
            e.top >= h.top + h.height - 5 && !['h1','h2','h3','h4'].includes(e.tag)
          );
          const contentAfterHeight = contentAfter.reduce((sum, e) => sum + e.height, 0);
          // Only flag if less than 40px of content follows the heading
          // (a heading with even a short paragraph is acceptable layout)
          return contentAfterHeight < 40;
        });

        // Full-page intentional layouts (title pages, TOC)
        const isFullPageElement = filtered.some(e =>
          e.classes.includes('section-title-page')
          || e.classes.includes('title-page')
          || e.classes.includes('toc-page')
        );

        results.push({
          pageNumber: pageIndex + 1,
          pageHeight: Math.round(pageRect.height),
          contentAreaHeight: Math.round(contentAreaHeight),
          usedHeight: Math.round(usedHeight),
          bottomGap: Math.round(bottomGap),
          fillPercentage: fillPct,
          isFullPageElement,
          elementCount: filtered.length,
          writeSpaceCount: writeSpaces.length,
          writeSpaces: writeSpaces.map(ws => ({
            classes: ws.classes,
            height: ws.height,
            top: ws.top,
          })),
          orphanedHeadings: orphanedHeadings.map(h => ({
            tag: h.tag,
            text: h.text,
            distanceFromBottom: Math.round(contentAreaHeight - h.bottom),
          })),
          firstContent: filtered.length > 0 ? {
            tag: filtered[0].tag,
            classes: filtered[0].classes,
            text: filtered[0].text,
          } : null,
          lastContent: filtered.length > 0 ? {
            tag: filtered[filtered.length - 1].tag,
            classes: filtered[filtered.length - 1].classes,
            text: filtered[filtered.length - 1].text,
          } : null,
        });
      });

      return {
        totalPages: pages.length,
        pageSize: {
          width: Math.round(pages[0].getBoundingClientRect().width),
          height: Math.round(pages[0].getBoundingClientRect().height),
        },
        pages: results,
      };
    });

    return layoutData;

    } finally {
      // Close the local HTTP server
      server.close();
    }

  } finally {
    await browser.close();
  }
}

// ─── Report formatting ────────────────────────────────────────────

function formatReport(data, threshold) {
  const lines = [];
  const HR = '═'.repeat(62);
  const hr = '─'.repeat(62);

  lines.push('');
  lines.push(`╔${HR}╗`);
  lines.push(`║  PAGE LAYOUT ANALYSIS REPORT${' '.repeat(33)}║`);
  lines.push(`╚${HR}╝`);
  lines.push('');
  lines.push(`  Total pages:     ${data.totalPages}`);
  lines.push(`  Page size:       ${data.pageSize.width} x ${data.pageSize.height} px`);
  lines.push(`  Empty threshold: ${threshold}%`);
  lines.push('');

  // Categorize pages
  const issues = [];
  const ok = [];

  for (const pg of data.pages) {
    const pageIssues = [];

    if (pg.isFullPageElement) {
      // Title/section pages are intentionally full-page, skip analysis
      ok.push(pg);
      continue;
    }

    const emptyPct = 100 - pg.fillPercentage;

    if (emptyPct >= threshold) {
      pageIssues.push({
        type: 'UNDERFILLED',
        detail: `${emptyPct}% empty (${pg.bottomGap}px bottom gap)`,
        severity: emptyPct >= 50 ? 'HIGH' : 'MEDIUM',
      });

      // Check if write spaces could absorb the gap
      if (pg.writeSpaceCount > 0) {
        const extraPerSpace = Math.round(pg.bottomGap / pg.writeSpaceCount);
        pageIssues.push({
          type: 'EXPANDABLE',
          detail: `${pg.writeSpaceCount} write space(s) could each grow ~${extraPerSpace}px to fill the page`,
          severity: 'SUGGESTION',
        });
      }
    }

    if (pg.orphanedHeadings.length > 0) {
      for (const h of pg.orphanedHeadings) {
        pageIssues.push({
          type: 'ORPHANED HEADING',
          detail: `<${h.tag}> "${h.text}" is ${h.distanceFromBottom}px from page bottom`,
          severity: 'MEDIUM',
        });
      }
    }

    if (pg.elementCount <= 2 && !pg.isFullPageElement && pg.fillPercentage < 40) {
      pageIssues.push({
        type: 'NEAR-EMPTY',
        detail: `Only ${pg.elementCount} element(s), ${pg.fillPercentage}% filled`,
        severity: 'HIGH',
      });
    }

    if (pageIssues.length > 0) {
      issues.push({ page: pg, issues: pageIssues });
    } else {
      ok.push(pg);
    }
  }

  // Summary
  lines.push(hr);
  if (issues.length === 0) {
    lines.push('  ✓ No layout issues detected! All pages are well-filled.');
  } else {
    lines.push(`  ISSUES FOUND: ${issues.length} page(s) with potential problems`);
    lines.push(`  OK:           ${ok.length} page(s) look good`);
  }
  lines.push(hr);
  lines.push('');

  // Detailed issue report
  if (issues.length > 0) {
    lines.push('  PAGES WITH ISSUES');
    lines.push('  ' + '─'.repeat(58));

    for (const { page: pg, issues: pgIssues } of issues) {
      lines.push('');
      lines.push(`  PAGE ${pg.pageNumber}  │  ${pg.fillPercentage}% filled  │  ${pg.elementCount} elements  │  ${pg.writeSpaceCount} write spaces`);

      if (pg.firstContent) {
        lines.push(`    Starts with: <${pg.firstContent.tag}> "${pg.firstContent.text.substring(0, 50)}${pg.firstContent.text.length > 50 ? '...' : ''}"`);
      }
      if (pg.lastContent) {
        lines.push(`    Ends with:   <${pg.lastContent.tag}> "${pg.lastContent.text.substring(0, 50)}${pg.lastContent.text.length > 50 ? '...' : ''}"`);
      }

      for (const issue of pgIssues) {
        const icon = issue.severity === 'HIGH' ? '!!'
          : issue.severity === 'SUGGESTION' ? '>>'
          : ' !';
        lines.push(`    ${icon} [${issue.type}] ${issue.detail}`);
      }
    }
  }

  // Page-by-page fill summary (visual bar chart)
  lines.push('');
  lines.push(hr);
  lines.push('  PAGE FILL MAP');
  lines.push('  ' + '─'.repeat(58));
  lines.push('');

  for (const pg of data.pages) {
    const barWidth = 40;
    const filled = Math.round((pg.fillPercentage / 100) * barWidth);
    const empty = barWidth - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    const label = pg.isFullPageElement ? '(title/toc)' :
      pg.fillPercentage < (100 - threshold) ? '' :
      `<< ${100 - pg.fillPercentage}% empty`;

    const flag = (!pg.isFullPageElement && (100 - pg.fillPercentage) >= threshold) ? '*' : ' ';

    lines.push(`  ${flag} p${String(pg.pageNumber).padStart(2, ' ')} │${bar}│ ${String(pg.fillPercentage).padStart(3)}%  ${label}`);
  }

  lines.push('');
  lines.push('  * = flagged for review');
  lines.push('');

  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  if (!args.input) {
    console.error('Error: HTML file path is required');
    printUsage();
    process.exit(1);
  }

  const htmlPath = path.resolve(args.input);
  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: File not found: ${htmlPath}`);
    process.exit(1);
  }

  const data = await analyzeLayout(htmlPath, { timeout: args.timeout });

  if (args.json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(formatReport(data, args.threshold));
  }
}

main().catch(err => {
  console.error('\n[FATAL]', err);
  process.exit(1);
});
