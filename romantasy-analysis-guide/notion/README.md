# Romantasy Analysis Guide - Notion Template

A programmatic Notion template generator for the "Read Like a Writer" Romantasy Analysis Guide.

## What This Creates

Running this script generates a complete Notion workspace with:

- **Book Analysis Library** - Master database to track all books you analyze
- **Chapter Logs** - Quick per-chapter observations and tension tracking
- **Romance Beat Tracker** - Romancing the Beat (Gwen Hayes) framework
- **Fantasy Beat Tracker** - Save the Cat! / Three-Act structure
- **Trope Tracker** - Macro and micro trope setup/payoff analysis
- **Spice & Intimacy Tracker** - Heat level progression and purpose
- **Banter Collection** - Verbal chemistry examples and techniques
- **Craft Moves to Steal** - Your personal library of techniques
- **World-Building Notes** - Magic systems, lore delivery analysis
- **Character Analysis** - Wounds, lies, arcs, and voice

All databases are linked to the Book Analysis Library for easy filtering and cross-referencing.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **A Notion account**
3. **A Notion integration** with access to your workspace

## Setup Instructions

### Step 1: Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**
3. Name it "Romantasy Guide Generator" (or whatever you prefer)
4. Select your workspace
5. Click **Submit**
6. Copy the **Internal Integration Token** (starts with `secret_`)

### Step 2: Create a Parent Page

1. In Notion, create a new page where you want the template to live
2. Open the page and click the **...** menu (top right)
3. Scroll down and click **Add connections**
4. Select your integration from the list
5. Copy the page ID from the URL:
   - URL format: `https://notion.so/Your-Page-Title-abc123def456`
   - The page ID is the part after the title: `abc123def456`
   - Or: `https://notion.so/abc123def456` → ID is `abc123def456`

### Step 3: Configure Environment

1. Navigate to the notion folder:
   ```bash
   cd romantasy-analysis-guide/notion
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your values:
   ```
   NOTION_API_KEY=secret_your_integration_token_here
   NOTION_PAGE_ID=your_page_id_here
   ```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Generate the Template

```bash
npm start
```

The script will:
1. Create the main template page
2. Add all databases with proper relations
3. Populate sample data to help you get started
4. Output a link to your new template

## Using the Template

### Quick Start Workflow

1. **Before reading**: Add a new book to the Book Analysis Library
2. **Pre-read**: Fill in expectations and learning goals
3. **While reading**: Log chapters (2-3 min each) and track beats as you find them
4. **Notable moments**: Capture tropes, spice scenes, banter, and craft moves
5. **After finishing**: Complete synthesis within 24 hours

### Database Views to Create

The script creates databases with default views. Consider adding these custom views:

**Book Analysis Library:**
- "Currently Reading" - Filter by Status = Reading
- "By Trope" - Group by Primary Trope
- "Heat Level" - Group by Heat Level

**Chapter Logs:**
- "By Book" - Filter/Group by Book relation
- "High Tension" - Filter Romantic Tension >= 7

**Trope Tracker:**
- "Macro Tropes" - Filter Type = Macro Trope
- "Viral Moments" - Filter Viral Potential = High

### Linking Entries

When creating new entries in any database, always link them to the book you're analyzing using the "Book" relation field. This enables:
- Filtering all data by book
- Seeing related entries on each book's page
- Cross-referencing patterns across books

## Customization

### Adding New Trope Options

Edit `src/utils/constants.js` to add tropes:

```javascript
export const MACRO_TROPES = [
  // ... existing tropes
  { name: 'Your New Trope', color: 'purple' },
];
```

Then regenerate the template (this will create a new workspace, not update existing).

### Modifying Database Properties

Edit the corresponding file in `src/databases/`:
- `books.js` - Book Analysis Library
- `chapters.js` - Chapter Logs
- `beats.js` - Romance & Fantasy Beat Trackers
- `tropes.js` - Trope Tracker
- `spice.js` - Spice Tracker & Banter Collection
- `craft.js` - Craft Moves, World-Building, Characters

## File Structure

```
notion/
├── .env.example          # Environment template
├── package.json          # Dependencies
├── README.md             # This file
└── src/
    ├── index.js          # Main entry point
    ├── databases/        # Database creation modules
    │   ├── books.js
    │   ├── chapters.js
    │   ├── beats.js
    │   ├── tropes.js
    │   ├── spice.js
    │   └── craft.js
    ├── pages/
    │   └── welcome.js    # Welcome page content
    └── utils/
        ├── constants.js  # Dropdown options
        └── notionClient.js
```

## Troubleshooting

**"unauthorized" error:**
- Make sure your integration has access to the parent page
- Go to the page → ... menu → Add connections → Select your integration

**"object_not_found" error:**
- Check that your NOTION_PAGE_ID is correct
- Make sure you're using the page ID, not the full URL

**Rate limiting:**
- The Notion API has rate limits. If you hit them, wait a minute and try again.

**Missing databases:**
- If the script fails partway through, you may have partial data. Delete the created page and run again.

## Sample Data

The script adds sample entries to help you understand how to use each database:

- A sample book (A Court of Thorns and Roses placeholder)
- 3 sample chapter logs
- 3 sample romance beats
- 3 sample fantasy beats
- 3 sample tropes (1 macro, 2 micro)
- 2 sample spice scenes
- 2 sample banter exchanges
- 3 sample craft moves

Delete or modify these as you start your own analysis.
