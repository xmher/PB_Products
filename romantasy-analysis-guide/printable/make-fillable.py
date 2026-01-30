#!/usr/bin/env python3
"""
make-fillable.py

Scans a PDF for checkbox squares and text-entry areas (write spaces),
then overlays interactive PDF form fields so the document becomes fillable.

Designed for the Romantasy Analysis Guide PDFs (printed from HTML).

Requirements:
    pip install pymupdf

Usage:
    python make-fillable.py input.pdf
    python make-fillable.py input.pdf -o output.pdf
    python make-fillable.py input.pdf --preview

The --preview flag generates a highlighted version (red = checkbox,
blue = text area) so you can verify detection before committing.
"""

import sys
import os
import argparse

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Error: PyMuPDF is required.")
    print("Install it with:  pip install pymupdf")
    sys.exit(1)


# ── Detection thresholds ─────────────────────────────────────────
# Tweak these if fields are missed or you get false positives.

CHECKBOX_MIN_SIZE = 5       # min side length (pts)
CHECKBOX_MAX_SIZE = 18      # max side length (pts)
CHECKBOX_SQUARENESS = 5     # max difference between width and height (pts)

TEXTAREA_MIN_WIDTH = 80     # min width to count as a text area (pts)
TEXTAREA_MIN_HEIGHT = 35    # min height to count as a text area (pts)

PAGE_EDGE_MARGIN = 40       # ignore rects within this distance of all 4 edges


# ── Helpers ───────────────────────────────────────────────────────

def rects_overlap(r1, r2, threshold=0.5):
    """True if two rects overlap by more than `threshold` of the smaller."""
    inter = r1 & r2
    if inter.is_empty:
        return False
    inter_area = inter.width * inter.height
    min_area = min(r1.width * r1.height, r2.width * r2.height)
    if min_area == 0:
        return False
    return inter_area / min_area > threshold


def deduplicate(rects, threshold=0.5):
    """Remove overlapping rects, keeping the first occurrence."""
    result = []
    for r in rects:
        if not any(rects_overlap(r, existing, threshold) for existing in result):
            result.append(r)
    return result


# ── Detection ─────────────────────────────────────────────────────

def detect_fields(page):
    """Find checkboxes and text areas from drawn rectangles on a page."""
    checkboxes = []
    textareas = []

    pw, ph = page.rect.width, page.rect.height

    for path in page.get_drawings():
        rect = fitz.Rect(path["rect"])
        w, h = rect.width, rect.height

        # Skip degenerate shapes
        if w < 3 or h < 3:
            continue

        # Skip full-page decorative borders
        if (rect.x0 < PAGE_EDGE_MARGIN and
            rect.y0 < PAGE_EDGE_MARGIN and
            rect.x1 > pw - PAGE_EDGE_MARGIN and
            rect.y1 > ph - PAGE_EDGE_MARGIN):
            continue

        # ── Checkbox: small, roughly square ──
        if (CHECKBOX_MIN_SIZE < w < CHECKBOX_MAX_SIZE and
            CHECKBOX_MIN_SIZE < h < CHECKBOX_MAX_SIZE and
            abs(w - h) < CHECKBOX_SQUARENESS):
            checkboxes.append(rect)

        # ── Text area: wide rectangle with some height ──
        elif (w > TEXTAREA_MIN_WIDTH and
              h > TEXTAREA_MIN_HEIGHT and
              h < ph * 0.4):
            textareas.append(rect)

    return deduplicate(checkboxes), deduplicate(textareas)


# ── Main logic ────────────────────────────────────────────────────

def make_fillable(input_path, output_path, preview=False):
    doc = fitz.open(input_path)

    stats = {"checkboxes": 0, "textareas": 0}
    field_id = 0

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        checkboxes, textareas = detect_fields(page)

        if preview:
            for rect in checkboxes:
                page.draw_rect(rect, color=(1, 0, 0), width=1.5)
            for rect in textareas:
                page.draw_rect(rect, color=(0, 0, 1), width=1.5)
            stats["checkboxes"] += len(checkboxes)
            stats["textareas"] += len(textareas)
        else:
            for rect in checkboxes:
                field_id += 1
                widget = fitz.Widget()
                widget.field_type = fitz.PDF_WIDGET_TYPE_CHECKBOX
                widget.field_name = f"check_{field_id}"
                widget.rect = rect
                page.add_widget(widget)
                stats["checkboxes"] += 1

            for rect in textareas:
                field_id += 1
                widget = fitz.Widget()
                widget.field_type = fitz.PDF_WIDGET_TYPE_TEXT
                widget.field_name = f"text_{field_id}"
                widget.rect = rect
                widget.text_fontsize = 9
                widget.text_color = (0, 0, 0)
                widget.field_flags = fitz.PDF_TX_FIELD_IS_MULTILINE
                page.add_widget(widget)
                stats["textareas"] += 1

    doc.save(output_path)
    doc.close()

    total = stats["checkboxes"] + stats["textareas"]

    if preview:
        print(f"\nPreview saved to: {output_path}")
        print(f"  Red outlines  = checkboxes ({stats['checkboxes']})")
        print(f"  Blue outlines = text areas ({stats['textareas']})")
        print(f"  Total detected: {total}")
        print(f"\nOpen the preview to verify, then run again without --preview.")
    else:
        print(f"\nFillable PDF saved to: {output_path}")
        print(f"  Checkboxes:   {stats['checkboxes']}")
        print(f"  Text fields:  {stats['textareas']}")
        print(f"  Total fields: {total}")


# ── CLI ───────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Make a PDF fillable by detecting checkboxes and text areas."
    )
    parser.add_argument("input", help="Input PDF file")
    parser.add_argument(
        "-o", "--output",
        help="Output file path (default: <input>-fillable.pdf or <input>-preview.pdf)"
    )
    parser.add_argument(
        "--preview", action="store_true",
        help="Highlight detected fields instead of adding form widgets"
    )

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
