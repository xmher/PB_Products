#!/usr/bin/env python3
"""
make-fillable.py  (v2 – text-based detection)

Scans a Sejda-exported PDF using TEXT ANCHORS to locate chapter logs,
metadata fields, tracking tables, and write spaces, then overlays
interactive PDF form widgets (checkboxes + text areas) so the document
becomes fillable in any PDF reader.

Designed for the Romantasy Analysis Guide PDFs exported through Sejda.

Requirements:
    pip install pymupdf

Usage:
    python make-fillable.py input.pdf
    python make-fillable.py input.pdf -o output.pdf
    python make-fillable.py input.pdf --preview

The --preview flag generates a highlighted version so you can verify
detection before committing (red=checkbox, green=text, blue=multiline).
"""

import sys
import os
import argparse
import re

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Error: PyMuPDF is required.")
    print("Install it with:  pip install pymupdf")
    sys.exit(1)


# ══════════════════════════════════════════════════════════════════════
# TEXT HELPERS
# ══════════════════════════════════════════════════════════════════════

def get_text_items(page):
    """Extract all text spans with position, size, and font info."""
    items = []
    for block in page.get_text("dict")["blocks"]:
        if block["type"] == 0:
            for line in block["lines"]:
                for span in line["spans"]:
                    txt = span["text"].strip()
                    if txt:
                        items.append({
                            "text": txt,
                            "bbox": fitz.Rect(span["bbox"]),
                            "size": span["size"],
                            "font": span["font"],
                        })
    return items


def find_text(items, needle, exact=False, y_range=None, x_range=None,
              size_range=None):
    """Find text items matching *needle* with optional filters."""
    results = []
    for item in items:
        if exact:
            if item["text"] != needle:
                continue
        else:
            if needle not in item["text"]:
                continue
        if y_range and not (y_range[0] <= item["bbox"].y0 <= y_range[1]):
            continue
        if x_range and not (x_range[0] <= item["bbox"].x0 <= x_range[1]):
            continue
        if size_range and not (size_range[0] <= item["size"] <= size_range[1]):
            continue
        results.append(item)
    return results


def text_in_rect(items, rect, min_size=9):
    """True if there is meaningful text inside *rect*."""
    for item in items:
        b = item["bbox"]
        if (b.x0 >= rect.x0 - 2 and b.x1 <= rect.x1 + 2 and
                b.y0 >= rect.y0 - 2 and b.y1 <= rect.y1 + 2 and
                item["size"] >= min_size):
            return True
    return False


# ══════════════════════════════════════════════════════════════════════
# PAGE TYPE IDENTIFICATION
# ══════════════════════════════════════════════════════════════════════

def identify_page(items):
    """Return a short string describing the page type, or None."""
    texts = {it["text"] for it in items}
    blob = " ".join(it["text"] for it in items)

    # Chapter log
    if (any(re.match(r"CHAPTER \d+", t) for t in texts)
            and any("Arc Driver:" in t for t in texts)):
        return "chapter_log"

    # Book Metadata
    if "Book Metadata" in texts and "Title:" in texts:
        return "book_metadata"

    # Expectations & Goals
    if "Expectations & Goals" in texts:
        return "write_questions"

    # Beat tracking tables (romance phases + fantasy acts)
    if ("BEAT" in texts
            and ("CHAPTER/PAGE" in texts or "CH/PAGE" in texts)
            and ("HOW IT'S EXECUTED" in texts or "HOW IT'S" in texts
                 or "EXECUTED" in texts or "WHAT HAPPENS" in texts)):
        return "table"

    # Binding technique table
    if "BINDING TECHNIQUE" in texts and "HOW IT APPEARS IN THIS BOOK" in texts:
        return "table"

    # Dual-Arc Causality Grid
    if "FANTASY BEAT" in texts and "ROMANCE BEAT" in texts:
        return "table"

    # Macro tropes
    if "TROPE" in texts and "PRESENT?" in texts:
        return "table"

    # Micro tropes
    if "MICRO TROPE" in texts and "FOUND?" in texts:
        return "table"

    # Heat level progression
    if "CHAPTER" in texts and "SCENE TYPE" in texts and "WHAT CHANGED AFTER?" in texts:
        return "table"

    # Banter table
    if "THE EXCHANGE" in texts and "TECHNIQUE" in texts:
        return "table"

    # Technique collection table
    if "CATEGORY" in texts and "THE QUOTE/EXAMPLE" in texts:
        return "table"

    # Structural metrics table
    if "ELEMENT" in texts and "RATING" in texts and "NOTES" in texts:
        return "table"

    # Pitfall diagnosis table
    if "PITFALL" in texts and "PRESENT?" in texts:
        return "table"

    # Integration patterns table
    if "PATTERN USED" in texts and "HOW IT APPEARS IN THIS BOOK (NOTES)" in blob:
        return "table"

    # Integration pattern reference (definition table)
    if "PATTERN" in texts and "HOW IT WORKS" in texts:
        return None  # reference only, no fields needed

    # Various write-space / question pages
    write_triggers = [
        "One thing I would have done differently",
        "What binding technique",
        "Swoon-Worthy Lines",
        "Integration Deep Questions",
        "What do I expect from this book",
        "Applying the Through-Thread",
        "How strong is the mirror effect",
        "Specific techniques I will try",
        "What weakness in my own writing",
    ]
    for trigger in write_triggers:
        if trigger in blob:
            return "write_questions"

    return None


# ══════════════════════════════════════════════════════════════════════
# CHAPTER LOG HANDLER
# ══════════════════════════════════════════════════════════════════════

CB = 9  # standard checkbox side length (pts)


def _find_y(items, needle, y_range=None, bottom=False, **kw):
    """Return the y0 (or y1 if bottom=True) of the first match."""
    matches = find_text(items, needle, y_range=y_range, **kw)
    if matches:
        return matches[0]["bbox"].y1 if bottom else matches[0]["bbox"].y0
    return None


def place_chapter_log(page, items):
    """Return list of (type, name, Rect) for one chapter log page."""
    fields = []
    pw = page.rect.width

    # Chapter number for unique field names
    ch = "0"
    for it in items:
        m = re.match(r"CHAPTER (\d+)", it["text"])
        if m:
            ch = m.group(1)
            break
    p = f"ch{ch}"

    # ── 1. Header text fields: Pages (from–to), POV, Location ──────
    pages_lbl = find_text(items, "Pages:", exact=True, y_range=(80, 120))
    if pages_lbl:
        b = pages_lbl[0]["bbox"]
        fields.append(("text", f"{p}_pages_from",
                        fitz.Rect(b.x1 + 2, b.y0, b.x1 + 55, b.y1)))
        dash = find_text(items, "\u2013", exact=True, y_range=(80, 120))
        if dash:
            d = dash[0]["bbox"]
            fields.append(("text", f"{p}_pages_to",
                            fitz.Rect(d.x1 + 2, d.y0, d.x1 + 40, d.y1)))

    pov_lbl = find_text(items, "POV:", exact=True, y_range=(80, 120))
    if pov_lbl:
        b = pov_lbl[0]["bbox"]
        fields.append(("text", f"{p}_pov",
                        fitz.Rect(b.x1 + 2, b.y0, b.x1 + 140, b.y1)))

    loc_lbl = find_text(items, "Location:", exact=True, y_range=(80, 120))
    if loc_lbl:
        b = loc_lbl[0]["bbox"]
        fields.append(("text", f"{p}_location",
                        fitz.Rect(b.x1 + 2, b.y0, min(b.x1 + 115, pw - 42), b.y1)))

    # ── 2. Arc Driver checkboxes ───────────────────────────────────
    for opt in ["Fantasy", "Romance", "Both Intertwined"]:
        for m in find_text(items, opt, exact=True, y_range=(145, 190)):
            if m["bbox"].x0 < 270:
                b = m["bbox"]
                fields.append(("checkbox",
                               f"{p}_arc_{opt.lower().replace(' ', '_')}",
                               fitz.Rect(b.x0 - CB - 2, b.y0, b.x0 - 2, b.y0 + CB)))

    # ── 3. Tension Source checkboxes ───────────────────────────────
    for opt in ["Danger", "Mystery", "Emotional Intimacy"]:
        for m in find_text(items, opt, exact=True, y_range=(145, 190)):
            if m["bbox"].x0 >= 270:
                b = m["bbox"]
                fields.append(("checkbox",
                               f"{p}_ts_{opt.lower().replace(' ', '_')}",
                               fitz.Rect(b.x0 - CB - 2, b.y0, b.x0 - 2, b.y0 + CB)))
    for m in find_text(items, "Will-They", y_range=(145, 190)):
        b = m["bbox"]
        fields.append(("checkbox", f"{p}_ts_will_they",
                        fitz.Rect(b.x0 - CB - 2, b.y0, b.x0 - 2, b.y0 + CB)))

    # ── 4. Beat Types checkboxes ───────────────────────────────────
    for bt in ["Plot", "Romance", "World", "Character", "Action", "Quiet"]:
        for m in find_text(items, bt, exact=True, y_range=(218, 305),
                           size_range=(10, 13)):
            b = m["bbox"]
            fields.append(("checkbox", f"{p}_beat_{bt.lower()}",
                            fitz.Rect(b.x0 - CB - 2, b.y0, b.x0 - 2, b.y0 + CB)))

    # ── 5. Tension scale checkboxes (1-10 × 2 rows) ───────────────
    for it in items:
        if (it["text"] in [str(n) for n in range(1, 11)]
                and it["size"] < 8 and 345 <= it["bbox"].y0 <= 395):
            b = it["bbox"]
            cx, cy = (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2
            row = "romance" if b.y0 < 370 else "plot"
            fields.append(("checkbox",
                            f"{p}_tension_{row}_{it['text']}",
                            fitz.Rect(cx - 5, cy - 5, cx + 5, cy + 5)))

    # ── 6. Write spaces (multiline text fields) ───────────────────
    LX0, LX1 = 60, 293
    RX0, RX1 = 311, 555
    BOTTOM = 730

    # Find vertical anchor positions
    job_bot = _find_y(items, "This chapter", y_range=(185, 220), bottom=True)
    sum_top = _find_y(items, "One-Sentence Summary", y_range=(280, 310))
    sum_bot = _find_y(items, "[Who] wants", y_range=(310, 340), bottom=True)
    rom_top = _find_y(items, "Romance:", y_range=(395, 420),
                      size_range=(12, 15))
    hook_o = _find_y(items, "Opening Hook:", y_range=(485, 515))
    craft = _find_y(items, "Craft Move to Steal:", y_range=(585, 620))
    plot_top = _find_y(items, "Plot/World:", y_range=(395, 420))
    hook_c = _find_y(items, "Closing Hook:", y_range=(485, 515))

    def ws(name, x0, y0, x1, y1):
        if y0 is not None and y1 is not None and y1 - y0 > 20:
            fields.append(("multitext", f"{p}_{name}",
                            fitz.Rect(x0, y0 + 5, x1, y1 - 3)))

    ws("job",          LX0, job_bot,             LX1, sum_top)
    ws("summary",      LX0, sum_bot,             LX1, rom_top)
    ws("romance",      LX0, rom_top + 18 if rom_top else None,
                       LX1, hook_o)
    ws("opening_hook", LX0, hook_o + 18 if hook_o else None,
                       LX1, craft)
    ws("craft_move",   LX0, craft + 18 if craft else None,
                       LX1, BOTTOM)
    ws("plot_world",   RX0, plot_top + 18 if plot_top else None,
                       RX1, hook_c)
    ws("closing_hook", RX0, hook_c + 18 if hook_c else None,
                       RX1, BOTTOM)

    return fields


# ══════════════════════════════════════════════════════════════════════
# BOOK METADATA HANDLER
# ══════════════════════════════════════════════════════════════════════

def place_book_metadata(page, items):
    fields = []
    pw = page.rect.width

    # Text fields
    for label, name in [
        ("Title:", "meta_title"),
        ("Author:", "meta_author"),
        ("Series & Book #:", "meta_series"),
        ("Publication Year:", "meta_year"),
        ("Page Count:", "meta_pagecount"),
        ("Subgenre:", "meta_subgenre"),
    ]:
        for m in find_text(items, label, exact=True):
            b = m["bbox"]
            fields.append(("text", name,
                            fitz.Rect(b.x1 + 4, b.y0, pw - 60, b.y1)))

    # Heat level checkboxes (0-5)
    for n in range(6):
        for m in find_text(items, str(n), exact=True,
                           y_range=(290, 315), size_range=(8, 11)):
            b = m["bbox"]
            cx = (b.x0 + b.x1) / 2
            cy = (b.y0 + b.y1) / 2
            fields.append(("checkbox", f"heat_{n}",
                            fitz.Rect(cx - 5, cy - 5, cx + 5, cy + 5)))

    # Anticipated Tropes checkboxes
    trope_names = [
        "Enemies to Lovers", "Forced Proximity", "Fated Mates / Soul Bond",
        "Slow Burn", "Forbidden Love", "Grumpy/Sunshine",
        "Morally Grey Hero", "Found Family", "Only One Bed",
        "Fake Relationship", "Arranged Marriage",
        "Hidden Identity / Secret Royalty",
        "Touch Her and Die", "He Falls First / She Falls First",
        "Possessive / Protective Hero", "Villain Gets the Girl",
        "Who Did This to You", "Redemption Arc",
    ]
    for trope in trope_names:
        for m in find_text(items, trope, y_range=(350, 710)):
            b = m["bbox"]
            safe = trope.lower().replace(" ", "_").replace("/", "_")
            fields.append(("checkbox", f"trope_{safe}",
                            fitz.Rect(b.x0 - CB - 2, b.y0 + 1,
                                      b.x0 - 2, b.y0 + CB + 1)))

    return fields


# ══════════════════════════════════════════════════════════════════════
# WRITE-QUESTION PAGES (question text + blank answer area below)
# ══════════════════════════════════════════════════════════════════════

def place_write_questions(page, items):
    """Detect question/prompt text and place write spaces below each."""
    fields = []
    pw = page.rect.width
    pnum = page.number + 1
    BOTTOM = 730

    # Gather question-like lines (large italic or specific keywords)
    questions = []
    for it in items:
        if it["size"] < 12 or it["bbox"].y0 < 50:
            continue
        t = it["text"]
        if any(kw in t for kw in (
            "?", "technique", "lesson", "differently",
            "Swoon-Worthy", "Integration Deep", "Specific techniques",
        )) or t.startswith(("What ", "How ", "Where ", "Does ", "At what ",
                            "One thing", "Could your")):
            questions.append(it)

    questions.sort(key=lambda x: x["bbox"].y0)

    mx = 60
    rx = pw - 42

    for i, q in enumerate(questions):
        y_start = q["bbox"].y1 + 3
        y_end = questions[i + 1]["bbox"].y0 - 5 if i + 1 < len(questions) else BOTTOM
        if y_end - y_start > 30:
            fields.append(("multitext", f"p{pnum}_q{i + 1}",
                            fitz.Rect(mx, y_start, rx, y_end)))

    return fields


# ══════════════════════════════════════════════════════════════════════
# GENERIC TABLE HANDLER
# ══════════════════════════════════════════════════════════════════════

def _find_header_row(items):
    """Find the topmost row of UPPERCASE column headers on the page.

    Searches the full page (not just y < 110) for a horizontal group of
    uppercase spans with small font size that look like table headers.
    Returns the list of header items (sorted by x) or empty list.
    """
    # Collect all uppercase, small-font text as header candidates
    candidates = [it for it in items
                  if it["text"].isupper() and len(it["text"]) > 1
                  and it["size"] < 10 and it["bbox"].y0 > 30]
    if not candidates:
        return []

    # Group candidates by y position (within 15 pts = same row)
    candidates.sort(key=lambda x: x["bbox"].y0)
    rows = []
    current_row = [candidates[0]]
    for c in candidates[1:]:
        if c["bbox"].y0 - current_row[0]["bbox"].y0 < 18:
            current_row.append(c)
        else:
            rows.append(current_row)
            current_row = [c]
    rows.append(current_row)

    # Pick the row with the most items (most likely the header row)
    # If tied, prefer the topmost
    best = max(rows, key=lambda r: (len(r), -r[0]["bbox"].y0))
    if len(best) < 2:
        return []

    best.sort(key=lambda x: x["bbox"].x0)
    return best


def place_table(page, items):
    """Detect column headers and row labels, place fields in empty cells."""
    fields = []
    pw = page.rect.width
    pnum = page.number + 1
    TABLE_BOTTOM = 730

    # ── Find column headers ──
    raw_headers = _find_header_row(items)
    if not raw_headers:
        return fields

    # Merge headers that are on adjacent lines at similar x
    merged = []
    for h in raw_headers:
        if merged and abs(h["bbox"].x0 - merged[-1]["bbox"].x0) < 15:
            prev = merged[-1]
            prev["bbox"] = fitz.Rect(
                min(prev["bbox"].x0, h["bbox"].x0),
                min(prev["bbox"].y0, h["bbox"].y0),
                max(prev["bbox"].x1, h["bbox"].x1),
                max(prev["bbox"].y1, h["bbox"].y1),
            )
            prev["text"] += " " + h["text"]
        else:
            merged.append({
                "text": h["text"],
                "bbox": fitz.Rect(h["bbox"]),
                "size": h["size"],
                "font": h["font"],
            })
    headers = merged
    if len(headers) < 2:
        return fields

    # Column boundaries
    cols = []
    for i, h in enumerate(headers):
        x0 = h["bbox"].x0
        x1 = headers[i + 1]["bbox"].x0 - 4 if i + 1 < len(headers) else pw - 42
        cols.append({"name": h["text"], "x0": x0, "x1": x1})

    # ── Find row start positions (labels in first column) ──
    header_bottom = max(h["bbox"].y1 for h in headers) + 3
    first_col_x1 = cols[0]["x1"] if cols else 200

    row_items = []
    for it in items:
        b = it["bbox"]
        if (b.y0 > header_bottom and b.x0 < first_col_x1
                and b.y0 < TABLE_BOTTOM and it["size"] >= 8):
            row_items.append(it)

    row_items.sort(key=lambda x: x["bbox"].y0)

    # Cluster into rows (items within 15 pts of each other = same row)
    row_tops = []
    for ri in row_items:
        y = ri["bbox"].y0
        if not row_tops or y > row_tops[-1] + 15:
            row_tops.append(y)

    # If no row labels found, create evenly-spaced placeholder rows
    if not row_tops:
        available = TABLE_BOTTOM - header_bottom - 10
        row_height = 75  # reasonable default
        n_rows = max(1, int(available / row_height))
        row_tops = [header_bottom + 5 + i * (available / n_rows)
                    for i in range(n_rows)]

    # ── Place fields ──
    for ri in range(len(row_tops)):
        y0 = row_tops[ri]
        y1 = (row_tops[ri + 1] - 3 if ri + 1 < len(row_tops)
              else min(y0 + 80, TABLE_BOTTOM))
        if y1 - y0 < 15:
            continue

        for ci in range(len(cols)):
            col = cols[ci]
            rect = fitz.Rect(col["x0"] + 2, y0, col["x1"] - 2, y1)
            col_upper = col["name"].upper()

            # PRESENT? / FOUND? columns → checkbox
            if "PRESENT" in col_upper or "FOUND" in col_upper:
                cx = (col["x0"] + col["x1"]) / 2
                cy = (y0 + min(y0 + 30, y1)) / 2
                if not text_in_rect(items, rect, min_size=9):
                    fields.append(("checkbox",
                                    f"p{pnum}_r{ri}_c{ci}",
                                    fitz.Rect(cx - 6, cy - 6, cx + 6, cy + 6)))
            else:
                # Only add text field if cell is empty
                if not text_in_rect(items, rect, min_size=9):
                    fields.append(("multitext",
                                    f"p{pnum}_r{ri}_c{ci}",
                                    rect))

    return fields


# ══════════════════════════════════════════════════════════════════════
# WIDGET CREATION / PREVIEW DRAWING
# ══════════════════════════════════════════════════════════════════════

PREVIEW_COLORS = {
    "checkbox":  (1, 0, 0),       # red
    "text":      (0, 0.6, 0),     # green
    "multitext": (0, 0, 0.85),    # blue
}


def apply_fields(page, fields, preview=False):
    """Add widgets (or draw preview rects) and return counts by type."""
    counts = {}
    for ftype, name, rect in fields:
        counts[ftype] = counts.get(ftype, 0) + 1

        if preview:
            page.draw_rect(rect, color=PREVIEW_COLORS.get(ftype, (0.5, 0.5, 0.5)),
                           width=1.2)
            continue

        w = fitz.Widget()
        w.field_name = name
        w.rect = rect
        w.border_width = 1
        w.border_color = (0.7, 0.7, 0.7)

        if ftype == "checkbox":
            w.field_type = fitz.PDF_WIDGET_TYPE_CHECKBOX
            w.border_width = 0.5
            w.border_color = (0.5, 0.5, 0.5)
        elif ftype == "text":
            w.field_type = fitz.PDF_WIDGET_TYPE_TEXT
            w.text_fontsize = 9
            w.text_color = (0, 0, 0)
            w.fill_color = (1, 1, 1)
        elif ftype == "multitext":
            w.field_type = fitz.PDF_WIDGET_TYPE_TEXT
            w.text_fontsize = 9
            w.text_color = (0, 0, 0)
            w.fill_color = (1, 1, 1)
            w.field_flags = fitz.PDF_TX_FIELD_IS_MULTILINE

        page.add_widget(w)
        w.update()  # generate appearance stream

    return counts


# ══════════════════════════════════════════════════════════════════════
# MAIN PIPELINE
# ══════════════════════════════════════════════════════════════════════

HANDLER = {
    "chapter_log":    place_chapter_log,
    "book_metadata":  place_book_metadata,
    "write_questions": place_write_questions,
    "table":          place_table,
}


def make_fillable(input_path, output_path, preview=False):
    doc = fitz.open(input_path)
    totals = {"checkbox": 0, "text": 0, "multitext": 0}

    for idx in range(len(doc)):
        page = doc[idx]
        items = get_text_items(page)
        ptype = identify_page(items)

        if ptype is None:
            continue

        handler = HANDLER.get(ptype)
        if handler is None:
            continue

        if handler in (place_chapter_log, place_book_metadata):
            fields = handler(page, items)
        elif handler == place_write_questions:
            fields = handler(page, items)
        elif handler == place_table:
            fields = handler(page, items)
        else:
            fields = handler(page, items)

        if not fields:
            continue

        counts = apply_fields(page, fields, preview)
        for k, v in counts.items():
            totals[k] = totals.get(k, 0) + v

        print(f"  Page {idx + 1:>3}: {ptype:<16} → "
              f"{len(fields)} fields  "
              f"({counts.get('checkbox', 0)} cb, "
              f"{counts.get('text', 0)} txt, "
              f"{counts.get('multitext', 0)} area)")

    # Tell PDF viewers to regenerate appearances for form fields
    if not preview:
        cat = doc.pdf_catalog()
        cat_str = doc.xref_object(cat)
        if "/NeedAppearances true" not in cat_str:
            doc.xref_set_key(cat, "AcroForm/NeedAppearances", "true")

    doc.save(output_path, deflate=True, garbage=3)
    doc.close()

    total = sum(totals.values())
    print()
    if preview:
        print(f"Preview saved to: {output_path}")
        print(f"  Red    = checkboxes  ({totals.get('checkbox', 0)})")
        print(f"  Green  = text fields ({totals.get('text', 0)})")
        print(f"  Blue   = write areas ({totals.get('multitext', 0)})")
    else:
        print(f"Fillable PDF saved to: {output_path}")
        print(f"  Checkboxes:   {totals.get('checkbox', 0)}")
        print(f"  Text fields:  {totals.get('text', 0)}")
        print(f"  Write spaces: {totals.get('multitext', 0)}")
    print(f"  Total fields: {total}")


# ══════════════════════════════════════════════════════════════════════
# CLI
# ══════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="Make a Sejda-exported PDF fillable via text-based detection."
    )
    parser.add_argument("input", help="Input PDF file")
    parser.add_argument("-o", "--output",
                        help="Output file path (default: <input>-fillable.pdf "
                             "or <input>-preview.pdf)")
    parser.add_argument("--preview", action="store_true",
                        help="Highlight detected fields instead of adding widgets")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: file not found: {args.input}")
        sys.exit(1)

    if args.output:
        output = args.output
    else:
        base, ext = os.path.splitext(args.input)
        suffix = "-preview" if args.preview else "-fillable"
        output = f"{base}{suffix}{ext}"

    make_fillable(args.input, output, preview=args.preview)


if __name__ == "__main__":
    main()
