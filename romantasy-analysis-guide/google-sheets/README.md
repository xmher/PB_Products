# Romantasy Analysis Guide - Google Sheets Version

A Google Apps Script that creates a complete "Read Like a Writer" analysis workbook in Google Sheets.

## What This Creates

Running the script generates a complete Google Sheets workbook with:

- **Instructions** - How to use the guide and key terms
- **Book Overview** - Metadata, expectations, and learning goals
- **Chapter Log** - Per-chapter observations with tension tracking
- **Romance Beats** - Romancing the Beat framework
- **Fantasy Beats** - Save the Cat! / Three-Act structure
- **Trope Tracker** - Macro and micro trope analysis
- **Spice Tracker** - Heat level and intimacy pacing
- **Banter Collection** - Verbal chemistry examples
- **Craft Moves** - Techniques to steal
- **Character Analysis** - Protagonist deep dives
- **Post-Read Synthesis** - Overall analysis and lessons
- **Tension Visualizer** - Sparkline charts for pacing

## Features

- **Data validation dropdowns** for consistent data entry
- **Conditional formatting** for visual pattern recognition
- **Color-coded sections** for easy navigation
- **Sparkline charts** for tension visualization
- **Pre-populated frameworks** (romance beats, fantasy beats, tropes)
- **Checkbox tracking** for tropes and craft moves used

## Setup Instructions

### Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet

### Step 2: Open Apps Script

1. In your new spreadsheet, go to **Extensions > Apps Script**
2. This opens the Apps Script editor

### Step 3: Add the Script

1. Delete any existing code in the editor (usually `function myFunction() {}`)
2. Copy the entire contents of `RomantasyAnalysisGuide.gs`
3. Paste it into the Apps Script editor
4. Click **Save** (Ctrl+S or Cmd+S)
5. Name the project "Romantasy Analysis Guide" when prompted

### Step 4: Run the Script

1. In the Apps Script editor, select `createRomantasyAnalysisGuide` from the function dropdown (near the top)
2. Click **Run** (the play button)
3. You'll be prompted to authorize the script:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** (bottom left)
   - Click **Go to Romantasy Analysis Guide (unsafe)** - this is safe, it's just not verified by Google
   - Click **Allow**

4. The script will run and create all tabs with formatting

### Step 5: Use the Template

1. Return to your Google Sheet (close the Apps Script tab)
2. You'll see all the new tabs created
3. Start with the **Instructions** tab
4. Fill out **Book Overview** before reading

## Using the Template

### Quick Start Workflow

1. **Before reading**: Complete the Book Overview tab
2. **While reading**: Log chapters (2-3 min each) and track beats
3. **Notable moments**: Capture tropes, spice scenes, banter, craft moves
4. **After finishing**: Complete Post-Read Synthesis within 24 hours

### Tab-by-Tab Guide

| Tab | When to Use | Time |
|-----|-------------|------|
| Book Overview | Before reading | 5 min |
| Chapter Log | After each chapter | 2-3 min |
| Romance Beats | When you spot them | 1 min |
| Fantasy Beats | When you spot them | 1 min |
| Trope Tracker | During/after reading | As needed |
| Spice Tracker | When intimate scenes occur | 2 min |
| Banter Collection | When dialogue sparkles | 1 min |
| Craft Moves | When something's brilliant | 2 min |
| Character Analysis | Mid-read or post-read | 15 min |
| Post-Read Synthesis | Within 24h of finishing | 30-60 min |
| Tension Visualizer | After completing Chapter Log | 5 min |

### Using the Tension Visualizer

1. Complete your Chapter Log with tension ratings
2. Go to Tension Visualizer tab
3. Enter your tension values (1-10) for each chapter
4. Sparkline charts automatically update
5. Review the analysis metrics

## Customization

### Adding More Chapters

The Chapter Log has 50 rows by default. To add more:
1. Select the last row
2. Copy it
3. Insert new rows below
4. Paste to maintain formatting and validation

### Adding Tropes

To add custom tropes:
1. Go to the Trope Tracker tab
2. Add a new row in the appropriate section
3. Type your trope name

### Changing Colors

Colors are defined in the `COLORS` object at the top of the script. Modify and re-run to change the color scheme.

## Troubleshooting

**"Authorization required" error:**
- This is normal on first run. Follow the authorization steps above.

**Script runs but nothing happens:**
- Make sure you're running `createRomantasyAnalysisGuide` (not a different function)
- Check for errors in View > Logs in the Apps Script editor

**Dropdowns not working:**
- Make sure the script completed successfully
- Try refreshing the sheet

**Want to start fresh:**
- Run the script again - it will clear and recreate all tabs

## Re-Running the Script

You can run the script again at any time to reset the template. **Warning:** This will clear all data in the existing tabs.

To preserve your data:
1. Make a copy of the spreadsheet first (File > Make a copy)
2. Run the script on a new blank spreadsheet

## Menu Access

After running the script once, a custom menu appears:

**Romantasy Guide** menu:
- **Create/Reset Template** - Re-run the template generator
- **About** - Information about the guide

## File Structure

```
google-sheets/
├── README.md                    # This file
└── RomantasyAnalysisGuide.gs    # The Apps Script code
```

## Tips for Best Results

1. **Fill out Chapter Log immediately** after reading each chapter while it's fresh
2. **Use the dropdowns** - they ensure consistency and enable filtering
3. **Check tropes as you find them** - the checkbox turns the row green
4. **Copy quotes directly** into Banter Collection and Craft Moves
5. **Update Tension Visualizer** at the end to see pacing patterns
6. **Complete Post-Read Synthesis within 24 hours** while the book is fresh

## Comparison with Other Versions

| Feature | Google Sheets | Notion | Printable |
|---------|--------------|--------|-----------|
| Offline access | Limited | No | Yes |
| Charts/visualization | Yes (sparklines) | Limited | Manual |
| Linked databases | No | Yes | No |
| Filtering/sorting | Yes | Yes | No |
| Mobile friendly | Yes | Yes | Yes |
| Free to use | Yes | Yes | Yes |
