# Read Like a Writer: The Romantasy Analysis Guide

A comprehensive read-along companion that helps aspiring romantasy writers analyze books in their genre while reading. Extract craft lessons, track story structure, and understand the techniques that make romantasy novels work.

## Product Overview

This guide transforms you from a passive reader into an active analyst of craft. The goal is to make the invisible architecture of storytelling visible—to understand WHY a book works, not just whether you enjoyed it.

### What You'll Learn to Analyze

- **Story Structure** - Three-act structure, romance beats, fantasy beats
- **Dual-Arc Integration** - How romance and fantasy plots weave together
- **Trope Execution** - Setup and payoff of macro and micro tropes
- **Pacing & Tension** - The rhythm of emotional intensity
- **Spice & Intimacy** - Purpose and placement of intimate scenes
- **Character Craft** - Wounds, lies, arcs, and voice differentiation
- **World-Building** - Lore delivery without info-dumping
- **Prose Techniques** - Craft moves worth stealing

## Available Formats

### 1. Master Specification (Markdown)

**File:** `MASTER_SPECIFICATION.md`

The complete blueprint for the guide including:
- All sections and their purposes
- Every prompt/question organized by category
- Tracking elements and what they measure
- Suggested workflow (per-chapter, post-book)
- How sections build on each other

### 2. Printable PDF (HTML + Paged.js)

**Folder:** `printable/`

An HTML file styled with CSS and Paged.js for print-ready PDF generation:
- Clean, readable layout with writing space
- Organized sections with visual hierarchy
- Proper page breaks and margins
- Color-coded sections
- Works as a printed booklet or digital annotation

**[Setup Instructions →](printable/README.md)**

### 3. Notion Template (JavaScript API Script)

**Folder:** `notion/`

A Node.js script that programmatically creates a complete Notion workspace:
- 10 linked databases
- Toggles for chapter-by-chapter notes
- Progress tracking with relations
- Pre-populated frameworks and sample data
- Custom properties with dropdown validation

**[Setup Instructions →](notion/README.md)**

### 4. Google Sheets (Apps Script)

**Folder:** `google-sheets/`

A Google Apps Script that creates a complete workbook:
- 12 organized tabs
- Data validation dropdowns
- Conditional formatting for visual patterns
- Sparkline tension charts
- Pre-populated beat sheets and trope lists

**[Setup Instructions →](google-sheets/README.md)**

## Quick Start

### Choose Your Format

| Format | Best For | Setup Time |
|--------|----------|------------|
| **Printable** | Physical reading, distraction-free | 5 min |
| **Notion** | Database tracking, multiple books | 15 min |
| **Google Sheets** | Quick setup, charts, filtering | 10 min |

### Workflow Overview

```
BEFORE READING (5-10 min)
├── Fill out book metadata
├── Set expectations
└── Define learning goals
        │
WHILE READING (2-3 min/chapter)
├── Log chapter summaries
├── Track tension levels
├── Note beats as you find them
└── Capture craft moves
        │
AFTER FINISHING (30-60 min)
├── Complete reverse outline
├── Analyze structure metrics
├── Extract lessons
└── Update multi-book patterns
```

## Frameworks Used

### Romance: Romancing the Beat (Gwen Hayes)

| Phase | Beats |
|-------|-------|
| Setup (0-25%) | Meet Cute/Ugly → No Way → Adhesion |
| Falling (25-50%) | Inkling → Deepening → Midpoint Intimacy |
| Retreating (50-75%) | Shields Up → Retreat → Break Up |
| Fighting (75-100%) | Dark Night → Grand Gesture → HEA/HFN |

### Fantasy: Save the Cat! (Blake Snyder)

| Act | Beats |
|-----|-------|
| Act 1 (0-25%) | Opening → Setup → Catalyst → Debate → Break Into Two |
| Act 2A (25-50%) | B Story → Fun & Games → Midpoint |
| Act 2B (50-75%) | Bad Guys Close In → All Is Lost → Dark Night |
| Act 3 (75-100%) | Break Into Three → Finale → Final Image |

## Key Concepts

**Adhesion** - The external force that prevents characters from separating (forced proximity, shared quest, magical bond). In romantasy, this is often fantasy-based.

**The Ghost/Wound** - Past trauma that shapes the character's behavior and beliefs about love or the world. This creates the internal conflict.

**The Lie** - A false belief the character holds that must be overcome for growth. Often manifests as "Love is weakness" or "I'm unworthy of love."

**Slow Burn** - A pacing strategy (not just duration) that builds tension through delayed gratification, "almost" moments, and incremental intimacy.

**Dual-Arc Integration** - The best romantasy ensures every chapter advances BOTH the quest and the relationship. Neither arc should pause while the other progresses.

## Color-Coding System

For physical reading with highlighters:

| Color | Category | What to Mark |
|-------|----------|--------------|
| Pink/Red | Romance | Tension, kisses, declarations, yearning |
| Blue | Fantasy/Plot | Quest progress, magic, battles, external conflict |
| Green | World-Building | Lore, settings, magic system rules |
| Yellow | Character | Wounds, ghosts, backstory, motivations |
| Purple | Craft Moves | Exceptional techniques to emulate |

## File Structure

```
romantasy-analysis-guide/
├── README.md                          # This file
├── MASTER_SPECIFICATION.md            # Complete guide blueprint
├── printable/
│   ├── README.md                      # PDF generation instructions
│   └── romantasy-analysis-guide.html  # Print-ready HTML
├── notion/
│   ├── README.md                      # Notion setup guide
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js                   # Main generator
│       ├── databases/                 # Database modules
│       ├── pages/                     # Page content
│       └── utils/                     # Helpers & constants
└── google-sheets/
    ├── README.md                      # Google Sheets setup guide
    └── RomantasyAnalysisGuide.gs      # Apps Script code
```

## Research Foundation

This guide is built on established craft pedagogy:

- **Francine Prose** - *Reading Like a Writer* (cellular analysis methodology)
- **Gwen Hayes** - *Romancing the Beat* (romance structure)
- **Blake Snyder** - *Save the Cat!* (plot structure)
- **John Gardner** - The "fictive dream" concept
- **Traditional literary analysis** - Narrative distance, psychic proximity, show-don't-tell

## Contributing

Suggestions for improvement are welcome! Areas of interest:

- Additional tropes to track
- Alternative beat sheet frameworks
- Subgenre-specific prompts
- Accessibility improvements

## License

This product is part of PB_Products. See repository license for details.

---

*Transform how you read. Extract craft lessons. Understand why books work.*
