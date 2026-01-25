/**
 * Romantasy Analysis Guide - Google Sheets Template Generator
 *
 * This Google Apps Script creates a complete "Read Like a Writer"
 * analysis workbook for romantasy novels.
 *
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Save the project (Ctrl+S)
 * 5. Run the createRomantasyAnalysisGuide() function
 * 6. Grant necessary permissions when prompted
 *
 * The script will create all tabs, formatting, and sample data.
 */

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const COLORS = {
  primary: '#8B4A6B',
  secondary: '#D4A5A5',
  accent: '#4A6B8B',
  romance: '#E8B4B8',
  fantasy: '#A8C5DB',
  craft: '#C5B8E8',
  world: '#B8E8C5',
  header: '#2C3E50',
  light: '#F8F6F4',
  white: '#FFFFFF',
  warning: '#FFF3CD',
  success: '#D4EDDA',
};

const HEAT_LEVELS = [
  '0 - Clean',
  '1 - Sweet',
  '2 - Mild',
  '3 - Moderate',
  '4 - Steamy',
  '5 - Explicit',
];

const TENSION_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const BEAT_TYPES = [
  'Fantasy Plot',
  'Romance Beat',
  'World-Building',
  'Character Reveal',
  'Action/Battle',
  'Quiet Moment',
  'Midpoint',
  'All Is Lost',
  'Resolution',
];

const MACRO_TROPES = [
  'Enemies to Lovers',
  'Forced Proximity',
  'Fated Mates',
  'Slow Burn',
  'Forbidden Love',
  'Grumpy/Sunshine',
  'Morally Grey Hero',
  'Found Family',
  'Second Chance',
  'Fake Relationship',
  'Marriage of Convenience',
  'Bodyguard Romance',
  'Royalty/Commoner',
  'Rivals to Lovers',
];

const MICRO_TROPES = [
  'Who Did This To You?',
  'Hand on Throat',
  'Wound Tending',
  'Forehead Touch',
  'Only One Bed',
  'Carrying to Bed',
  'Jealousy Scene',
  'Training Scene Tension',
  'Dance Scene',
  'Rain Scene',
  'First Touch',
  'Protective Snarl',
  'Almost Kiss',
];

const ROMANCE_BEATS = [
  'Meet Cute/Ugly',
  'The No Way',
  'The Adhesion',
  'Inkling of Desire',
  'Deepening Desire',
  'Midpoint Intimacy',
  'Shields Up',
  'The Retreat',
  'The Break Up',
  'Dark Night',
  'Grand Gesture',
  'HEA/HFN',
];

const FANTASY_BEATS = [
  'Opening Image',
  'Theme Stated',
  'Setup',
  'Catalyst',
  'Debate',
  'Break Into Two',
  'B Story',
  'Fun and Games',
  'Midpoint',
  'Bad Guys Close In',
  'All Is Lost',
  'Dark Night of Soul',
  'Break Into Three',
  'Finale',
  'Final Image',
];

const SUBGENRES = [
  'Fae Romance',
  'Dark Romantasy',
  'Cozy Romantasy',
  'Epic Romantasy',
  'Paranormal Romance',
  'Shifter Romance',
  'Vampire Romance',
  'Academy/School',
  'Court Intrigue',
  'Quest Fantasy',
];

const ANALYSIS_STATUS = [
  'Not Started',
  'Pre-Read',
  'Reading',
  'Post-Read',
  'Complete',
];

// ============================================
// MAIN FUNCTION
// ============================================

function createRomantasyAnalysisGuide() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Rename the spreadsheet
  ss.rename('Romantasy Analysis Guide - Read Like a Writer');

  // Create all sheets
  createInstructionsSheet(ss);
  createBookOverviewSheet(ss);
  createChapterLogSheet(ss);
  createRomanceBeatsSheet(ss);
  createFantasyBeatsSheet(ss);
  createTropeTrackerSheet(ss);
  createSpiceTrackerSheet(ss);
  createBanterCollectionSheet(ss);
  createCraftMovesSheet(ss);
  createCharacterAnalysisSheet(ss);
  createPostReadSynthesisSheet(ss);
  createTensionVisualizerSheet(ss);

  // Delete the default Sheet1 if it exists
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  // Set Instructions as the active sheet
  ss.setActiveSheet(ss.getSheetByName('Instructions'));

  // Show completion message
  SpreadsheetApp.getUi().alert(
    'Template Created!',
    'Your Romantasy Analysis Guide is ready. Start with the Instructions tab to learn how to use it.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ============================================
// SHEET CREATION FUNCTIONS
// ============================================

function createInstructionsSheet(ss) {
  let sheet = ss.getSheetByName('Instructions');
  if (!sheet) {
    sheet = ss.insertSheet('Instructions');
  }
  sheet.clear();

  // Set column widths
  sheet.setColumnWidth(1, 800);

  // Title
  sheet.getRange('A1').setValue('Read Like a Writer: Romantasy Analysis Guide');
  sheet.getRange('A1').setFontSize(24).setFontWeight('bold').setFontColor(COLORS.primary);

  // Subtitle
  sheet.getRange('A2').setValue('Transform how you read. Extract craft lessons, track story structure, and understand the techniques that make romantasy novels work.');
  sheet.getRange('A2').setFontSize(12).setFontStyle('italic').setFontColor(COLORS.accent);

  // Content
  const content = [
    [''],
    ['HOW TO USE THIS GUIDE'],
    [''],
    ['This workbook helps you analyze romantasy books to understand WHY they work, not just whether you enjoyed them.'],
    [''],
    ['QUICK START:'],
    ['1. Fill out the Book Overview tab before you start reading'],
    ['2. Log chapters as you read (2-3 minutes each) in Chapter Log'],
    ['3. Track romance and fantasy beats when you encounter them'],
    ['4. Capture tropes, spice scenes, and craft moves as you notice them'],
    ['5. Complete Post-Read Synthesis within 24 hours of finishing'],
    [''],
    ['CHOOSE YOUR PATH:'],
    [''],
    ['Quick-Fill Path (~2-3 min/chapter + 20 min post-read):'],
    ['• Chapter Log with tension ratings only'],
    ['• Quick synthesis and 3-5 craft moves'],
    [''],
    ['Deep-Dive Path (~5-10 min/chapter + 60-90 min post-read):'],
    ['• Full beat tracking (Romance + Fantasy)'],
    ['• Trope analysis, spice tracking, character deep dives'],
    ['• Complete synthesis with detailed notes'],
    [''],
    ['TAB OVERVIEW:'],
    [''],
    ['📚 Book Overview - Book metadata, expectations, learning goals'],
    ['📝 Chapter Log - Per-chapter observations and tension tracking'],
    ['💕 Romance Beats - Romancing the Beat framework tracking'],
    ['⚔️ Fantasy Beats - Save the Cat! / Three-Act structure'],
    ['🎭 Trope Tracker - Macro and micro trope analysis'],
    ['🔥 Spice Tracker - Heat level and intimacy pacing'],
    ['💬 Banter Collection - Verbal chemistry examples'],
    ['✨ Craft Moves - Techniques worth stealing'],
    ['👤 Character Analysis - Protagonist deep dives'],
    ['📊 Post-Read Synthesis - Overall analysis and lessons'],
    ['📈 Tension Visualizer - Pacing visualization'],
    [''],
    ['KEY TERMS:'],
    [''],
    ['Adhesion - External force preventing characters from separating'],
    ['Ghost/Wound - Past trauma shaping behavior and beliefs'],
    ['The Lie - False belief character must overcome'],
    ['Slow Burn - Extended tension with delayed gratification'],
    ['Deep POV - Narrative deeply immersed in character\'s psyche'],
    ['HEA/HFN - Happily Ever After / Happy For Now'],
    [''],
    ['COLOR CODING (for physical reading):'],
    ['Pink/Red = Romance Beats | Blue = Fantasy/Plot | Green = World-Building'],
    ['Yellow = Character Backstory | Purple = Craft Moves to Steal'],
  ];

  sheet.getRange(3, 1, content.length, 1).setValues(content);

  // Format headers
  sheet.getRange('A4').setFontSize(14).setFontWeight('bold').setFontColor(COLORS.primary);
  sheet.getRange('A8').setFontWeight('bold');
  sheet.getRange('A15').setFontWeight('bold');
  sheet.getRange('A17').setFontWeight('bold');
  sheet.getRange('A21').setFontWeight('bold');
  sheet.getRange('A26').setFontWeight('bold');
  sheet.getRange('A40').setFontWeight('bold');
  sheet.getRange('A49').setFontWeight('bold');

  // Set background
  sheet.getRange('A1:A60').setBackground(COLORS.light);

  // Freeze the header
  sheet.setFrozenRows(2);

  // Set tab color
  sheet.setTabColor(COLORS.primary);
}

function createBookOverviewSheet(ss) {
  let sheet = ss.getSheetByName('Book Overview');
  if (!sheet) {
    sheet = ss.insertSheet('Book Overview');
  }
  sheet.clear();

  // Set column widths
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 400);
  sheet.setColumnWidth(3, 50);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 400);

  // Headers
  const headers = [
    ['BOOK METADATA', '', '', 'EXPECTATIONS & GOALS', ''],
    ['Field', 'Value', '', 'Field', 'Value'],
  ];
  sheet.getRange(1, 1, 2, 5).setValues(headers);

  // Style headers
  sheet.getRange('A1:B1').merge().setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold');
  sheet.getRange('D1:E1').merge().setBackground(COLORS.accent).setFontColor(COLORS.white).setFontWeight('bold');
  sheet.getRange('A2:E2').setBackground(COLORS.secondary).setFontWeight('bold');

  // Metadata fields
  const metadataFields = [
    ['Title', ''],
    ['Author', ''],
    ['Series', ''],
    ['Book #', ''],
    ['Publication Year', ''],
    ['Page Count', ''],
    ['Subgenre', ''],
    ['Expected Heat Level', ''],
    ['Primary Trope', ''],
    ['Secondary Tropes', ''],
    ['Analysis Status', ''],
  ];

  sheet.getRange(3, 1, metadataFields.length, 2).setValues(metadataFields);

  // Expectations fields
  const expectationFields = [
    ['What I expect from this book', ''],
    ['Anticipated tropes', ''],
    ['Current reading mood', ''],
    ['Author familiarity', ''],
    ['', ''],
    ['LEARNING GOALS', ''],
    ['Craft element to study', ''],
    ['Weakness to improve', ''],
    ['', ''],
    ['POST-READ QUICK NOTES', ''],
    ['Did it meet expectations?', ''],
  ];

  sheet.getRange(3, 4, expectationFields.length, 2).setValues(expectationFields);

  // Add data validation
  const subgenreRule = SpreadsheetApp.newDataValidation().requireValueInList(SUBGENRES).build();
  sheet.getRange('B9').setDataValidation(subgenreRule);

  const heatRule = SpreadsheetApp.newDataValidation().requireValueInList(HEAT_LEVELS).build();
  sheet.getRange('B10').setDataValidation(heatRule);

  const tropeRule = SpreadsheetApp.newDataValidation().requireValueInList(MACRO_TROPES).build();
  sheet.getRange('B11').setDataValidation(tropeRule);

  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(ANALYSIS_STATUS).build();
  sheet.getRange('B13').setDataValidation(statusRule);

  // Format
  sheet.getRange('A3:A13').setFontWeight('bold').setBackground(COLORS.light);
  sheet.getRange('D3:D13').setFontWeight('bold').setBackground(COLORS.light);
  sheet.getRange('D8').setFontWeight('bold').setBackground(COLORS.craft);
  sheet.getRange('D12').setFontWeight('bold').setBackground(COLORS.romance);

  // Add borders
  sheet.getRange('A1:B13').setBorder(true, true, true, true, true, true);
  sheet.getRange('D1:E13').setBorder(true, true, true, true, true, true);

  // Set tab color
  sheet.setTabColor(COLORS.accent);
}

function createChapterLogSheet(ss) {
  let sheet = ss.getSheetByName('Chapter Log');
  if (!sheet) {
    sheet = ss.insertSheet('Chapter Log');
  }
  sheet.clear();

  // Headers
  const headers = [
    'Ch #',
    'Start Pg',
    'End Pg',
    'POV Character',
    'Location',
    'One-Line Summary',
    'Beat Types',
    'Romantic Tension (1-10)',
    'Plot Tension (1-10)',
    'What Surprised Me',
    'Craft Move Noticed',
    'Favorite Line/Moment',
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Style header
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground(COLORS.primary)
    .setFontColor(COLORS.white)
    .setFontWeight('bold')
    .setWrap(true);

  // Set column widths
  sheet.setColumnWidth(1, 50);  // Ch #
  sheet.setColumnWidth(2, 70);  // Start Pg
  sheet.setColumnWidth(3, 70);  // End Pg
  sheet.setColumnWidth(4, 120); // POV
  sheet.setColumnWidth(5, 120); // Location
  sheet.setColumnWidth(6, 300); // Summary
  sheet.setColumnWidth(7, 150); // Beat Types
  sheet.setColumnWidth(8, 80);  // Romantic Tension
  sheet.setColumnWidth(9, 80);  // Plot Tension
  sheet.setColumnWidth(10, 200); // Surprised
  sheet.setColumnWidth(11, 200); // Craft
  sheet.setColumnWidth(12, 200); // Favorite

  // Add 50 rows for chapters
  for (let i = 2; i <= 51; i++) {
    sheet.getRange(i, 1).setValue(i - 1); // Chapter number
  }

  // Add data validation for tension
  const tensionRule = SpreadsheetApp.newDataValidation().requireValueInList(TENSION_LEVELS).build();
  sheet.getRange('H2:H51').setDataValidation(tensionRule);
  sheet.getRange('I2:I51').setDataValidation(tensionRule);

  // Add data validation for beat types
  const beatRule = SpreadsheetApp.newDataValidation().requireValueInList(BEAT_TYPES).build();
  sheet.getRange('G2:G51').setDataValidation(beatRule);

  // Conditional formatting for tension
  const romanticRange = sheet.getRange('H2:H51');
  const plotRange = sheet.getRange('I2:I51');

  // High tension = red background
  const highTensionRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(8)
    .setBackground('#FFCDD2')
    .setRanges([romanticRange, plotRange])
    .build();

  // Medium tension = yellow
  const medTensionRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(5, 7)
    .setBackground('#FFF9C4')
    .setRanges([romanticRange, plotRange])
    .build();

  // Low tension = green
  const lowTensionRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(5)
    .setBackground('#C8E6C9')
    .setRanges([romanticRange, plotRange])
    .build();

  sheet.setConditionalFormatRules([highTensionRule, medTensionRule, lowTensionRule]);

  // Alternating row colors
  for (let i = 2; i <= 51; i++) {
    if (i % 2 === 0) {
      sheet.getRange(i, 1, 1, headers.length).setBackground(COLORS.light);
    }
  }

  // Freeze header
  sheet.setFrozenRows(1);

  // Set tab color
  sheet.setTabColor(COLORS.fantasy);
}

function createRomanceBeatsSheet(ss) {
  let sheet = ss.getSheetByName('Romance Beats');
  if (!sheet) {
    sheet = ss.insertSheet('Romance Beats');
  }
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('ROMANCE BEAT TRACKER (Romancing the Beat - Gwen Hayes)');
  sheet.getRange('A1:G1').merge().setBackground(COLORS.romance).setFontWeight('bold').setFontSize(14);

  // Headers
  const headers = ['Beat', 'Phase', 'Chapter', 'Page', '%', 'How It\'s Executed', 'Quote/Moment'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, 1, headers.length).setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold');

  // Pre-populate beats
  const beats = [
    ['Meet Cute/Ugly', 'Phase 1: Setup (0-25%)', '', '', '', '', ''],
    ['The "No Way"', 'Phase 1: Setup (0-25%)', '', '', '', '', ''],
    ['The Adhesion', 'Phase 1: Setup (0-25%)', '', '', '', '', ''],
    ['Inkling of Desire', 'Phase 2: Falling (25-50%)', '', '', '', '', ''],
    ['Deepening Desire', 'Phase 2: Falling (25-50%)', '', '', '', '', ''],
    ['Midpoint Intimacy', 'Phase 2: Falling (25-50%)', '', '', '', '', ''],
    ['Shields Up', 'Phase 3: Retreat (50-75%)', '', '', '', '', ''],
    ['The Retreat', 'Phase 3: Retreat (50-75%)', '', '', '', '', ''],
    ['The Break Up', 'Phase 3: Retreat (50-75%)', '', '', '', '', ''],
    ['Dark Night', 'Phase 4: Fighting (75-100%)', '', '', '', '', ''],
    ['Grand Gesture', 'Phase 4: Fighting (75-100%)', '', '', '', '', ''],
    ['HEA/HFN', 'Phase 4: Fighting (75-100%)', '', '', '', '', ''],
  ];

  sheet.getRange(3, 1, beats.length, beats[0].length).setValues(beats);

  // Column widths
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 70);
  sheet.setColumnWidth(4, 70);
  sheet.setColumnWidth(5, 50);
  sheet.setColumnWidth(6, 300);
  sheet.setColumnWidth(7, 300);

  // Color code phases
  for (let i = 3; i <= 5; i++) { // Phase 1
    sheet.getRange(i, 1, 1, 2).setBackground('#E3F2FD');
  }
  for (let i = 6; i <= 8; i++) { // Phase 2
    sheet.getRange(i, 1, 1, 2).setBackground(COLORS.romance);
  }
  for (let i = 9; i <= 11; i++) { // Phase 3
    sheet.getRange(i, 1, 1, 2).setBackground('#FFE0B2');
  }
  for (let i = 12; i <= 14; i++) { // Phase 4
    sheet.getRange(i, 1, 1, 2).setBackground('#FFCDD2');
  }

  // Add character section
  sheet.getRange('A17').setValue('CHARACTER WOUNDS & LIES');
  sheet.getRange('A17:G17').merge().setBackground(COLORS.accent).setFontColor(COLORS.white).setFontWeight('bold');

  const charHeaders = ['Character', 'Role', 'The Wound/Ghost', 'The Lie They Believe', 'The Truth They Need', 'Want vs Need', 'Transformation Moment'];
  sheet.getRange(18, 1, 1, charHeaders.length).setValues([charHeaders]);
  sheet.getRange(18, 1, 1, charHeaders.length).setBackground(COLORS.secondary).setFontWeight('bold');

  // Add rows for H1 and H2
  sheet.getRange(19, 1).setValue('H1 (Protagonist)');
  sheet.getRange(20, 1).setValue('H2 (Love Interest)');

  // Freeze rows
  sheet.setFrozenRows(2);

  // Set tab color
  sheet.setTabColor(COLORS.romance);
}

function createFantasyBeatsSheet(ss) {
  let sheet = ss.getSheetByName('Fantasy Beats');
  if (!sheet) {
    sheet = ss.insertSheet('Fantasy Beats');
  }
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('FANTASY BEAT TRACKER (Save the Cat! / Three-Act Structure)');
  sheet.getRange('A1:F1').merge().setBackground(COLORS.fantasy).setFontWeight('bold').setFontSize(14);

  // Headers
  const headers = ['Beat', 'Act', 'Chapter', 'Page', 'What Happens', 'Romance Connection'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, 1, headers.length).setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold');

  // Pre-populate beats
  const beats = [
    ['Opening Image', 'Act 1 (0-25%)', '', '', '', ''],
    ['Theme Stated', 'Act 1 (0-25%)', '', '', '', ''],
    ['Setup', 'Act 1 (0-25%)', '', '', '', ''],
    ['Catalyst', 'Act 1 (0-25%)', '', '', '', ''],
    ['Debate', 'Act 1 (0-25%)', '', '', '', ''],
    ['Break Into Two', 'Act 1 (0-25%)', '', '', '', ''],
    ['B Story', 'Act 2A (25-50%)', '', '', '', ''],
    ['Fun and Games', 'Act 2A (25-50%)', '', '', '', ''],
    ['Midpoint', 'Act 2A (25-50%)', '', '', '', ''],
    ['Bad Guys Close In', 'Act 2B (50-75%)', '', '', '', ''],
    ['All Is Lost', 'Act 2B (50-75%)', '', '', '', ''],
    ['Dark Night of Soul', 'Act 2B (50-75%)', '', '', '', ''],
    ['Break Into Three', 'Act 3 (75-100%)', '', '', '', ''],
    ['Finale', 'Act 3 (75-100%)', '', '', '', ''],
    ['Final Image', 'Act 3 (75-100%)', '', '', '', ''],
  ];

  sheet.getRange(3, 1, beats.length, beats[0].length).setValues(beats);

  // Column widths
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 70);
  sheet.setColumnWidth(4, 70);
  sheet.setColumnWidth(5, 300);
  sheet.setColumnWidth(6, 300);

  // Color code acts
  for (let i = 3; i <= 8; i++) { // Act 1
    sheet.getRange(i, 1, 1, 2).setBackground('#E3F2FD');
  }
  for (let i = 9; i <= 11; i++) { // Act 2A
    sheet.getRange(i, 1, 1, 2).setBackground('#C8E6C9');
  }
  for (let i = 12; i <= 14; i++) { // Act 2B
    sheet.getRange(i, 1, 1, 2).setBackground('#FFE0B2');
  }
  for (let i = 15; i <= 17; i++) { // Act 3
    sheet.getRange(i, 1, 1, 2).setBackground('#FFCDD2');
  }

  // Freeze rows
  sheet.setFrozenRows(2);

  // Set tab color
  sheet.setTabColor(COLORS.fantasy);
}

function createTropeTrackerSheet(ss) {
  let sheet = ss.getSheetByName('Trope Tracker');
  if (!sheet) {
    sheet = ss.insertSheet('Trope Tracker');
  }
  sheet.clear();

  // Macro Tropes Section
  sheet.getRange('A1').setValue('MACRO TROPES (Relationship Dynamics)');
  sheet.getRange('A1:G1').merge().setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold');

  const macroHeaders = ['Trope', 'Present?', 'Setup Chapter', 'Payoff Chapter', 'Setup Description', 'Payoff Description', 'What Makes It Work'];
  sheet.getRange(2, 1, 1, macroHeaders.length).setValues([macroHeaders]);
  sheet.getRange(2, 1, 1, macroHeaders.length).setBackground(COLORS.secondary).setFontWeight('bold');

  // Pre-populate macro tropes
  const macroData = MACRO_TROPES.map(trope => [trope, '', '', '', '', '', '']);
  sheet.getRange(3, 1, macroData.length, macroData[0].length).setValues(macroData);

  // Add checkbox validation for "Present?"
  const checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange(3, 2, macroData.length, 1).setDataValidation(checkboxRule);

  // Micro Tropes Section
  const microStartRow = 3 + macroData.length + 2;
  sheet.getRange(microStartRow, 1).setValue('MICRO TROPES (Viral Moments)');
  sheet.getRange(microStartRow, 1, 1, 7).merge().setBackground(COLORS.accent).setFontColor(COLORS.white).setFontWeight('bold');

  sheet.getRange(microStartRow + 1, 1, 1, macroHeaders.length).setValues([macroHeaders]);
  sheet.getRange(microStartRow + 1, 1, 1, macroHeaders.length).setBackground(COLORS.secondary).setFontWeight('bold');

  // Pre-populate micro tropes
  const microData = MICRO_TROPES.map(trope => [trope, '', '', '', '', '', '']);
  sheet.getRange(microStartRow + 2, 1, microData.length, microData[0].length).setValues(microData);

  // Add checkbox validation for micro tropes "Present?"
  sheet.getRange(microStartRow + 2, 2, microData.length, 1).setDataValidation(checkboxRule);

  // Column widths
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 70);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 250);
  sheet.setColumnWidth(6, 250);
  sheet.setColumnWidth(7, 250);

  // Conditional formatting - highlight checked tropes
  const macroRange = sheet.getRange(3, 1, macroData.length, 7);
  const microRange = sheet.getRange(microStartRow + 2, 1, microData.length, 7);

  const presentRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$B3=TRUE')
    .setBackground(COLORS.success)
    .setRanges([macroRange])
    .build();

  sheet.setConditionalFormatRules([presentRule]);

  // Freeze header
  sheet.setFrozenRows(2);

  // Set tab color
  sheet.setTabColor(COLORS.craft);
}

function createSpiceTrackerSheet(ss) {
  let sheet = ss.getSheetByName('Spice Tracker');
  if (!sheet) {
    sheet = ss.insertSheet('Spice Tracker');
  }
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('SPICE & INTIMACY TRACKER');
  sheet.getRange('A1:I1').merge().setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold').setFontSize(14);

  // Heat Level Key
  sheet.getRange('A2').setValue('Heat Levels: 0=Clean | 1=Sweet | 2=Mild | 3=Moderate | 4=Steamy | 5=Explicit');
  sheet.getRange('A2:I2').merge().setBackground(COLORS.light).setFontStyle('italic');

  // Headers
  const headers = ['#', 'Chapter', 'Heat Level', 'Scene Type', 'Emotional Context', 'What It Reveals', 'Dynamic Shift After', 'Plot Integrated?', 'Sensory Details'];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(3, 1, 1, headers.length).setBackground(COLORS.romance).setFontWeight('bold');

  // Add 15 rows
  for (let i = 4; i <= 18; i++) {
    sheet.getRange(i, 1).setValue(i - 3);
  }

  // Data validation
  const heatRule = SpreadsheetApp.newDataValidation().requireValueInList(HEAT_LEVELS).build();
  sheet.getRange('C4:C18').setDataValidation(heatRule);

  const sceneTypes = ['First Touch', 'Almost Kiss', 'First Kiss', 'Tension Scene', 'Fade to Black', 'On-Page Scene', 'Morning After'];
  const sceneRule = SpreadsheetApp.newDataValidation().requireValueInList(sceneTypes).build();
  sheet.getRange('D4:D18').setDataValidation(sceneRule);

  const checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange('H4:H18').setDataValidation(checkboxRule);

  // Conditional formatting for heat levels
  const heatRange = sheet.getRange('C4:C18');

  const explicitRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('5 - Explicit')
    .setBackground('#FFCDD2')
    .setRanges([heatRange])
    .build();

  const steamyRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('4 - Steamy')
    .setBackground('#FFCC80')
    .setRanges([heatRange])
    .build();

  const moderateRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('3 - Moderate')
    .setBackground('#FFF59D')
    .setRanges([heatRange])
    .build();

  sheet.setConditionalFormatRules([explicitRule, steamyRule, moderateRule]);

  // Column widths
  sheet.setColumnWidth(1, 30);
  sheet.setColumnWidth(2, 70);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(7, 200);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 200);

  // Freeze header
  sheet.setFrozenRows(3);

  // Set tab color
  sheet.setTabColor('#FF5722');
}

function createBanterCollectionSheet(ss) {
  let sheet = ss.getSheetByName('Banter Collection');
  if (!sheet) {
    sheet = ss.insertSheet('Banter Collection');
  }
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('BANTER & VERBAL CHEMISTRY COLLECTION');
  sheet.getRange('A1:F1').merge().setBackground(COLORS.accent).setFontColor(COLORS.white).setFontWeight('bold').setFontSize(14);

  // Headers
  const headers = ['Chapter', 'The Quote/Exchange', 'Technique Used', 'What It Reveals', 'Why It Works', 'Use In My WIP?'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, 1, headers.length).setBackground(COLORS.secondary).setFontWeight('bold');

  // Technique options
  const techniques = ['Double Meaning', 'Callback Humor', 'Power Play', 'Vulnerability as Wit', 'Pet Names', 'One-Upmanship', 'Innuendo', 'Deflection', 'Challenge/Dare'];
  const techniqueRule = SpreadsheetApp.newDataValidation().requireValueInList(techniques).build();
  sheet.getRange('C3:C22').setDataValidation(techniqueRule);

  // Checkbox for "Use in WIP"
  const checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange('F3:F22').setDataValidation(checkboxRule);

  // Column widths
  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 400);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 100);

  // Freeze header
  sheet.setFrozenRows(2);

  // Set tab color
  sheet.setTabColor(COLORS.accent);
}

function createCraftMovesSheet(ss) {
  let sheet = ss.getSheetByName('Craft Moves');
  if (!sheet) {
    sheet = ss.insertSheet('Craft Moves');
  }
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('CRAFT MOVES TO STEAL');
  sheet.getRange('A1:F1').merge().setBackground(COLORS.craft).setFontWeight('bold').setFontSize(14);

  // Subtitle
  sheet.getRange('A2').setValue('Your personal library of techniques to emulate. When you read something brilliant, capture it here.');
  sheet.getRange('A2:F2').merge().setFontStyle('italic');

  // Headers
  const headers = ['Category', 'Chapter/Page', 'The Quote/Example', 'Why It Works', 'How I\'ll Use It', 'Used?'];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(3, 1, 1, headers.length).setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold');

  // Category options
  const categories = ['Opening Hook', 'Sensory Description', 'Tension Building', 'Emotional Moment', 'Dialogue', 'Action Sequence', 'Internal Monologue', 'Chapter Ending', 'Banter', 'World-Building'];
  const categoryRule = SpreadsheetApp.newDataValidation().requireValueInList(categories).build();
  sheet.getRange('A4:A33').setDataValidation(categoryRule);

  // Checkbox for "Used?"
  const checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange('F4:F33').setDataValidation(checkboxRule);

  // Column widths
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 350);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 250);
  sheet.setColumnWidth(6, 70);

  // Conditional formatting - highlight used
  const usedRange = sheet.getRange('A4:F33');
  const usedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$F4=TRUE')
    .setBackground(COLORS.success)
    .setRanges([usedRange])
    .build();

  sheet.setConditionalFormatRules([usedRule]);

  // Freeze header
  sheet.setFrozenRows(3);

  // Set tab color
  sheet.setTabColor(COLORS.craft);
}

function createCharacterAnalysisSheet(ss) {
  let sheet = ss.getSheetByName('Character Analysis');
  if (!sheet) {
    sheet = ss.insertSheet('Character Analysis');
  }
  sheet.clear();

  // H1 Section
  sheet.getRange('A1').setValue('PROTAGONIST (H1) ANALYSIS');
  sheet.getRange('A1:C1').merge().setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold');

  const h1Fields = [
    ['Name', ''],
    ['Role/Position', ''],
    ['External Goal', ''],
    ['Skills/Powers', ''],
    ['', ''],
    ['INTERNAL LAYER', ''],
    ['The Wound/Ghost', ''],
    ['The Lie They Believe', ''],
    ['The Truth They Need', ''],
    ['What They Fear', ''],
    ['Want vs Need', ''],
    ['', ''],
    ['ARC TRACKING', ''],
    ['Wound shown (ch)', ''],
    ['Lie challenged (ch)', ''],
    ['Transformation (ch)', ''],
  ];

  sheet.getRange(2, 1, h1Fields.length, 2).setValues(h1Fields);

  // H2 Section
  sheet.getRange('D1').setValue('LOVE INTEREST (H2) ANALYSIS');
  sheet.getRange('D1:F1').merge().setBackground(COLORS.romance).setFontColor(COLORS.white).setFontWeight('bold');

  sheet.getRange(2, 4, h1Fields.length, 2).setValues(h1Fields);

  // Format section headers
  sheet.getRange('A7').setFontWeight('bold').setBackground(COLORS.light);
  sheet.getRange('A14').setFontWeight('bold').setBackground(COLORS.light);
  sheet.getRange('D7').setFontWeight('bold').setBackground(COLORS.light);
  sheet.getRange('D14').setFontWeight('bold').setBackground(COLORS.light);

  // Format field labels
  sheet.getRange('A2:A17').setFontWeight('bold');
  sheet.getRange('D2:D17').setFontWeight('bold');

  // Column widths
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 30);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 300);

  // Voice Comparison Section
  sheet.getRange('A20').setValue('CHARACTER VOICE COMPARISON');
  sheet.getRange('A20:E20').merge().setBackground(COLORS.accent).setFontColor(COLORS.white).setFontWeight('bold');

  const voiceHeaders = ['Element', 'H1', 'H2', 'Notes'];
  sheet.getRange(21, 1, 1, voiceHeaders.length).setValues([voiceHeaders]);
  sheet.getRange(21, 1, 1, voiceHeaders.length).setBackground(COLORS.secondary).setFontWeight('bold');

  const voiceElements = [
    ['Speech patterns', '', '', ''],
    ['Internal monologue style', '', '', ''],
    ['What they notice first', '', '', ''],
    ['How they express emotion', '', '', ''],
    ['Recurring thoughts/phrases', '', '', ''],
  ];

  sheet.getRange(22, 1, voiceElements.length, voiceElements[0].length).setValues(voiceElements);

  // Set tab color
  sheet.setTabColor(COLORS.secondary);
}

function createPostReadSynthesisSheet(ss) {
  let sheet = ss.getSheetByName('Post-Read Synthesis');
  if (!sheet) {
    sheet = ss.insertSheet('Post-Read Synthesis');
  }
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('POST-READ SYNTHESIS');
  sheet.getRange('A1:D1').merge().setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold').setFontSize(14);

  // Structural Metrics
  sheet.getRange('A3').setValue('STRUCTURAL METRICS');
  sheet.getRange('A3:B3').merge().setBackground(COLORS.fantasy).setFontWeight('bold');

  const metrics = [
    ['Chapters until inciting incident', ''],
    ['First kiss page/percentage', ''],
    ['Midpoint page/percentage', ''],
    ['All Is Lost page/percentage', ''],
    ['Total chapter count', ''],
  ];

  sheet.getRange(4, 1, metrics.length, 2).setValues(metrics);

  // Overall Assessment
  sheet.getRange('A10').setValue('OVERALL ASSESSMENT');
  sheet.getRange('A10:D10').merge().setBackground(COLORS.romance).setFontWeight('bold');

  const assessHeaders = ['Element', 'Rating (1-5)', 'Notes'];
  sheet.getRange(11, 1, 1, assessHeaders.length).setValues([assessHeaders]);
  sheet.getRange(11, 1, 1, assessHeaders.length).setBackground(COLORS.secondary).setFontWeight('bold');

  const assessments = [
    ['Pacing', '', ''],
    ['Romance arc satisfaction', '', ''],
    ['Fantasy plot satisfaction', '', ''],
    ['Arc integration', '', ''],
    ['Character development', '', ''],
    ['World-building delivery', '', ''],
    ['Tension management', '', ''],
    ['Ending payoff', '', ''],
  ];

  sheet.getRange(12, 1, assessments.length, assessments[0].length).setValues(assessments);

  // Rating validation
  const ratingRule = SpreadsheetApp.newDataValidation().requireValueInList(['1', '2', '3', '4', '5']).build();
  sheet.getRange('B12:B19').setDataValidation(ratingRule);

  // Lessons Section
  sheet.getRange('A22').setValue('LESSONS FOR MY WRITING');
  sheet.getRange('A22:D22').merge().setBackground(COLORS.craft).setFontWeight('bold');

  const lessons = [
    ['Three things this book did exceptionally well:', ''],
    ['1.', ''],
    ['2.', ''],
    ['3.', ''],
    ['', ''],
    ['One thing I would have done differently:', ''],
    ['', ''],
    ['', ''],
    ['Techniques I will try in my WIP:', ''],
    ['1.', ''],
    ['2.', ''],
    ['3.', ''],
  ];

  sheet.getRange(23, 1, lessons.length, 2).setValues(lessons);

  // Hybrid Success Test
  sheet.getRange('A37').setValue('HYBRID SUCCESS TEST');
  sheet.getRange('A37:D37').merge().setBackground(COLORS.accent).setFontColor(COLORS.white).setFontWeight('bold');

  const testQuestions = [
    ['Did the romance NEED the fantasy elements to work?', ''],
    ['Did the fantasy NEED the romance to be emotionally resonant?', ''],
    ['Could you remove one arc and still have a complete story?', ''],
  ];

  sheet.getRange(38, 1, testQuestions.length, 2).setValues(testQuestions);

  const yesNoRule = SpreadsheetApp.newDataValidation().requireValueInList(['Yes', 'No', 'Partially']).build();
  sheet.getRange('B38:B40').setDataValidation(yesNoRule);

  // Column widths
  sheet.setColumnWidth(1, 350);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 300);

  // Set tab color
  sheet.setTabColor(COLORS.primary);
}

function createTensionVisualizerSheet(ss) {
  let sheet = ss.getSheetByName('Tension Visualizer');
  if (!sheet) {
    sheet = ss.insertSheet('Tension Visualizer');
  }
  sheet.clear();

  // Title
  sheet.getRange('A1').setValue('TENSION VISUALIZER');
  sheet.getRange('A1:Z1').merge().setBackground(COLORS.primary).setFontColor(COLORS.white).setFontWeight('bold').setFontSize(14);

  // Instructions
  sheet.getRange('A2').setValue('Enter tension values (1-10) from your Chapter Log. A sparkline chart will visualize the pacing.');
  sheet.getRange('A2:Z2').merge().setFontStyle('italic');

  // Headers
  sheet.getRange('A4').setValue('Chapter');
  sheet.getRange('A5').setValue('Romantic Tension');
  sheet.getRange('A6').setValue('Plot Tension');

  // Chapter numbers
  for (let i = 1; i <= 25; i++) {
    sheet.getRange(4, i + 1).setValue(i);
  }

  // Style headers
  sheet.getRange('A4:A6').setFontWeight('bold').setBackground(COLORS.light);
  sheet.getRange('B4:Z4').setBackground(COLORS.secondary).setFontWeight('bold');
  sheet.getRange('B5:Z5').setBackground(COLORS.romance);
  sheet.getRange('B6:Z6').setBackground(COLORS.fantasy);

  // Data validation for tension values
  const tensionRule = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 10)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('B5:Z6').setDataValidation(tensionRule);

  // Sparkline section
  sheet.getRange('A9').setValue('TENSION CHARTS');
  sheet.getRange('A9:Z9').merge().setBackground(COLORS.accent).setFontColor(COLORS.white).setFontWeight('bold');

  sheet.getRange('A10').setValue('Romantic Tension:');
  sheet.getRange('B10').setFormula('=SPARKLINE(B5:Z5, {"charttype","line"; "color","#E8B4B8"; "linewidth",2})');

  sheet.getRange('A11').setValue('Plot Tension:');
  sheet.getRange('B11').setFormula('=SPARKLINE(B6:Z6, {"charttype","line"; "color","#A8C5DB"; "linewidth",2})');

  sheet.getRange('A13').setValue('Combined (bars):');
  sheet.getRange('B13').setFormula('=SPARKLINE(B5:Z5, {"charttype","bar"; "color1","#E8B4B8"; "color2","#A8C5DB"})');

  // Analysis section
  sheet.getRange('A16').setValue('PACING ANALYSIS');
  sheet.getRange('A16:D16').merge().setBackground(COLORS.craft).setFontWeight('bold');

  const analysisFields = [
    ['Highest romantic tension chapter:', '=IF(MAX(B5:Z5)>0, MATCH(MAX(B5:Z5),B5:Z5,0), "")'],
    ['Highest plot tension chapter:', '=IF(MAX(B6:Z6)>0, MATCH(MAX(B6:Z6),B6:Z6,0), "")'],
    ['Average romantic tension:', '=IF(COUNT(B5:Z5)>0, ROUND(AVERAGE(B5:Z5),1), "")'],
    ['Average plot tension:', '=IF(COUNT(B6:Z6)>0, ROUND(AVERAGE(B6:Z6),1), "")'],
    ['Chapters between peaks:', ''],
    ['Saggy middle? (Ch 10-15 avg):', '=IF(COUNT(L5:P5)>0, ROUND(AVERAGE(L5:P5,L6:P6),1), "")'],
  ];

  sheet.getRange(17, 1, analysisFields.length, 2).setValues(analysisFields);
  sheet.getRange('A17:A22').setFontWeight('bold');

  // Column width for sparklines
  sheet.setColumnWidth(1, 200);
  for (let i = 2; i <= 26; i++) {
    sheet.setColumnWidth(i, 40);
  }

  // Set tab color
  sheet.setTabColor('#9C27B0');
}

// ============================================
// MENU CREATION
// ============================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Romantasy Guide')
    .addItem('Create/Reset Template', 'createRomantasyAnalysisGuide')
    .addSeparator()
    .addItem('About', 'showAbout')
    .addToUi();
}

function showAbout() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Romantasy Analysis Guide',
    'A "Read Like a Writer" workbook for analyzing romantasy novels.\n\n' +
    'Track story structure, romance beats, fantasy beats, tropes, spice pacing, and craft techniques.\n\n' +
    'Based on Romancing the Beat (Gwen Hayes) and Save the Cat! (Blake Snyder) frameworks.',
    ui.ButtonSet.OK
  );
}
