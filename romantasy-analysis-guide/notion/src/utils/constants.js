// ============================================
// ROMANTASY ANALYSIS GUIDE - CONSTANTS
// ============================================

// Heat Level Scale
export const HEAT_LEVELS = [
  { name: '0 - Clean', color: 'gray' },
  { name: '1 - Sweet', color: 'green' },
  { name: '2 - Mild', color: 'blue' },
  { name: '3 - Moderate', color: 'purple' },
  { name: '4 - Steamy', color: 'orange' },
  { name: '5 - Explicit', color: 'red' },
];

// Tension Levels (1-10)
export const TENSION_LEVELS = [
  { name: '1 - Minimal', color: 'gray' },
  { name: '2', color: 'gray' },
  { name: '3 - Low', color: 'blue' },
  { name: '4', color: 'blue' },
  { name: '5 - Medium', color: 'green' },
  { name: '6', color: 'yellow' },
  { name: '7 - High', color: 'yellow' },
  { name: '8', color: 'orange' },
  { name: '9 - Very High', color: 'orange' },
  { name: '10 - Peak', color: 'red' },
];

// Macro Tropes
export const MACRO_TROPES = [
  { name: 'Enemies to Lovers', color: 'red' },
  { name: 'Forced Proximity', color: 'orange' },
  { name: 'Fated Mates / Soul Bond', color: 'purple' },
  { name: 'Slow Burn', color: 'pink' },
  { name: 'Forbidden Love', color: 'red' },
  { name: 'Grumpy/Sunshine', color: 'yellow' },
  { name: 'Morally Grey Hero', color: 'gray' },
  { name: 'Found Family', color: 'green' },
  { name: 'Second Chance', color: 'blue' },
  { name: 'Fake Relationship', color: 'purple' },
  { name: 'Marriage of Convenience', color: 'pink' },
  { name: 'Bodyguard Romance', color: 'blue' },
  { name: 'Royalty/Commoner', color: 'purple' },
  { name: 'Secret Identity', color: 'gray' },
  { name: 'Rivals to Lovers', color: 'orange' },
];

// Micro Tropes (Viral Moments)
export const MICRO_TROPES = [
  { name: 'Who Did This To You?', color: 'red' },
  { name: 'Hand on Throat', color: 'red' },
  { name: 'Wound Tending', color: 'pink' },
  { name: 'Forehead Touch', color: 'pink' },
  { name: 'Only One Bed', color: 'purple' },
  { name: 'Carrying to Bed', color: 'purple' },
  { name: 'Jealousy Scene', color: 'orange' },
  { name: 'Training Scene Tension', color: 'yellow' },
  { name: 'Dance Scene', color: 'pink' },
  { name: 'Rain Scene', color: 'blue' },
  { name: 'First Touch', color: 'green' },
  { name: 'Protective Snarl', color: 'red' },
  { name: 'I\'d Burn the World', color: 'red' },
  { name: 'First Real Name', color: 'purple' },
  { name: 'Clothing Adjustment', color: 'pink' },
  { name: 'Almost Kiss', color: 'orange' },
  { name: 'Sleep Vulnerability', color: 'blue' },
];

// Chapter Beat Types
export const BEAT_TYPES = [
  { name: 'Fantasy Plot', color: 'blue' },
  { name: 'Romance Beat', color: 'pink' },
  { name: 'World-Building', color: 'green' },
  { name: 'Character Reveal', color: 'yellow' },
  { name: 'Action/Battle', color: 'red' },
  { name: 'Quiet Moment', color: 'purple' },
  { name: 'Midpoint', color: 'orange' },
  { name: 'All Is Lost', color: 'gray' },
  { name: 'Resolution', color: 'green' },
];

// Romance Phases (Romancing the Beat)
export const ROMANCE_PHASES = [
  { name: 'Phase 1: Setup (0-25%)', color: 'blue' },
  { name: 'Phase 2: Falling (25-50%)', color: 'pink' },
  { name: 'Phase 3: Retreating (50-75%)', color: 'orange' },
  { name: 'Phase 4: Fighting (75-100%)', color: 'red' },
];

// Romance Beats
export const ROMANCE_BEATS = [
  { name: 'Meet Cute/Ugly', color: 'blue' },
  { name: 'The No Way', color: 'gray' },
  { name: 'The Adhesion', color: 'purple' },
  { name: 'Inkling of Desire', color: 'pink' },
  { name: 'Deepening Desire', color: 'pink' },
  { name: 'Midpoint Intimacy', color: 'orange' },
  { name: 'Shields Up', color: 'yellow' },
  { name: 'The Retreat', color: 'orange' },
  { name: 'The Break Up', color: 'red' },
  { name: 'Dark Night', color: 'gray' },
  { name: 'Grand Gesture', color: 'purple' },
  { name: 'HEA/HFN', color: 'green' },
];

// Fantasy Beats (Save the Cat)
export const FANTASY_BEATS = [
  { name: 'Opening Image', color: 'blue' },
  { name: 'Theme Stated', color: 'purple' },
  { name: 'Setup', color: 'blue' },
  { name: 'Catalyst', color: 'yellow' },
  { name: 'Debate', color: 'gray' },
  { name: 'Break Into Two', color: 'green' },
  { name: 'B Story', color: 'pink' },
  { name: 'Fun and Games', color: 'green' },
  { name: 'Midpoint', color: 'orange' },
  { name: 'Bad Guys Close In', color: 'red' },
  { name: 'All Is Lost', color: 'gray' },
  { name: 'Dark Night of Soul', color: 'gray' },
  { name: 'Break Into Three', color: 'green' },
  { name: 'Finale', color: 'red' },
  { name: 'Final Image', color: 'blue' },
];

// Scene Types for Spice Tracking
export const SCENE_TYPES = [
  { name: 'First Touch', color: 'blue' },
  { name: 'Almost Kiss', color: 'purple' },
  { name: 'First Kiss', color: 'pink' },
  { name: 'Tension Scene', color: 'yellow' },
  { name: 'Fade to Black', color: 'purple' },
  { name: 'On-Page Scene', color: 'orange' },
  { name: 'Full Scene', color: 'red' },
  { name: 'Morning After', color: 'green' },
];

// Narrative Distance
export const NARRATIVE_DISTANCE = [
  { name: 'Cinematic', color: 'blue' },
  { name: 'Close Third', color: 'purple' },
  { name: 'Deep POV', color: 'red' },
];

// Analysis Status
export const ANALYSIS_STATUS = [
  { name: 'Not Started', color: 'gray' },
  { name: 'Pre-Read', color: 'blue' },
  { name: 'Reading', color: 'yellow' },
  { name: 'Post-Read', color: 'orange' },
  { name: 'Complete', color: 'green' },
];

// Subgenres
export const SUBGENRES = [
  { name: 'Fae Romance', color: 'purple' },
  { name: 'Dark Romantasy', color: 'gray' },
  { name: 'Cozy Romantasy', color: 'green' },
  { name: 'Epic Romantasy', color: 'blue' },
  { name: 'Paranormal Romance', color: 'red' },
  { name: 'Shifter Romance', color: 'orange' },
  { name: 'Vampire Romance', color: 'red' },
  { name: 'Academy/School', color: 'yellow' },
  { name: 'Court Intrigue', color: 'purple' },
  { name: 'Quest Fantasy', color: 'blue' },
];

// Rating Scale (1-5)
export const RATING_SCALE = [
  { name: '1 - Poor', color: 'red' },
  { name: '2 - Below Average', color: 'orange' },
  { name: '3 - Average', color: 'yellow' },
  { name: '4 - Good', color: 'green' },
  { name: '5 - Excellent', color: 'green' },
];

// Integration Quality
export const INTEGRATION_QUALITY = [
  { name: 'Fully Integrated', color: 'green' },
  { name: 'Mostly Integrated', color: 'blue' },
  { name: 'Somewhat Separate', color: 'yellow' },
  { name: 'Completely Separate', color: 'red' },
];

// World-Building Techniques
export const WORLDBUILDING_TECHNIQUES = [
  { name: 'Conflict Reveal', color: 'red' },
  { name: 'Training Scene', color: 'yellow' },
  { name: 'Fish Out of Water', color: 'blue' },
  { name: 'Dialogue Debate', color: 'purple' },
  { name: 'Sensory Immersion', color: 'green' },
  { name: 'Memory/Flashback', color: 'gray' },
  { name: 'Document/Book', color: 'brown' },
  { name: 'Travel Exposition', color: 'blue' },
  { name: 'Stakes Demonstration', color: 'red' },
];

// Craft Categories
export const CRAFT_CATEGORIES = [
  { name: 'Opening Hook', color: 'red' },
  { name: 'Sensory Description', color: 'green' },
  { name: 'Tension Building', color: 'orange' },
  { name: 'Emotional Moment', color: 'pink' },
  { name: 'Dialogue', color: 'blue' },
  { name: 'Action Sequence', color: 'red' },
  { name: 'Internal Monologue', color: 'purple' },
  { name: 'Chapter Ending', color: 'yellow' },
  { name: 'Banter', color: 'pink' },
  { name: 'World-Building', color: 'green' },
];

export default {
  HEAT_LEVELS,
  TENSION_LEVELS,
  MACRO_TROPES,
  MICRO_TROPES,
  BEAT_TYPES,
  ROMANCE_PHASES,
  ROMANCE_BEATS,
  FANTASY_BEATS,
  SCENE_TYPES,
  NARRATIVE_DISTANCE,
  ANALYSIS_STATUS,
  SUBGENRES,
  RATING_SCALE,
  INTEGRATION_QUALITY,
  WORLDBUILDING_TECHNIQUES,
  CRAFT_CATEGORIES,
};
