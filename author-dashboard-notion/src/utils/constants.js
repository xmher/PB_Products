// Color options for Notion select properties
export const COLORS = {
  default: 'default',
  gray: 'gray',
  brown: 'brown',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  blue: 'blue',
  purple: 'purple',
  pink: 'pink',
  red: 'red',
};

// WIP Status options
export const WIP_STATUSES = [
  { name: 'Idea', color: COLORS.gray },
  { name: 'Outlining', color: COLORS.blue },
  { name: 'Drafting', color: COLORS.yellow },
  { name: 'Revising', color: COLORS.orange },
  { name: 'Editing', color: COLORS.purple },
  { name: 'Beta Reading', color: COLORS.pink },
  { name: 'Querying', color: COLORS.brown },
  { name: 'Published', color: COLORS.green },
  { name: 'On Hold', color: COLORS.red },
];

// Genre options
export const GENRES = [
  { name: 'Romantasy', color: COLORS.pink },
  { name: 'Fantasy', color: COLORS.purple },
  { name: 'Romance', color: COLORS.red },
  { name: 'Dark Romance', color: COLORS.brown },
  { name: 'Cozy Fantasy', color: COLORS.green },
  { name: 'Urban Fantasy', color: COLORS.blue },
  { name: 'Paranormal Romance', color: COLORS.orange },
  { name: 'Epic Fantasy', color: COLORS.gray },
  { name: 'Sci-Fi Romance', color: COLORS.default },
  { name: 'Historical Romance', color: COLORS.yellow },
];

// POV options
export const POV_OPTIONS = [
  { name: 'First Person', color: COLORS.blue },
  { name: 'Third Person Limited', color: COLORS.purple },
  { name: 'Third Person Omniscient', color: COLORS.green },
  { name: 'Multiple POV', color: COLORS.orange },
  { name: 'Second Person', color: COLORS.gray },
];

// Character roles
export const CHARACTER_ROLES = [
  { name: 'Protagonist (FMC)', color: COLORS.pink },
  { name: 'Protagonist (MMC)', color: COLORS.blue },
  { name: 'Love Interest', color: COLORS.red },
  { name: 'Antagonist', color: COLORS.gray },
  { name: 'Supporting', color: COLORS.green },
  { name: 'Mentor', color: COLORS.purple },
  { name: 'Comic Relief', color: COLORS.yellow },
  { name: 'Side Character', color: COLORS.default },
];

// Character arc types
export const CHARACTER_ARCS = [
  { name: 'Positive Change', color: COLORS.green },
  { name: 'Negative Change', color: COLORS.red },
  { name: 'Flat Arc', color: COLORS.gray },
  { name: 'Corruption', color: COLORS.brown },
  { name: 'Redemption', color: COLORS.blue },
  { name: 'Disillusionment', color: COLORS.orange },
  { name: 'Growth', color: COLORS.purple },
];

// Romantasy macro tropes
export const MACRO_TROPES = [
  { name: 'Enemies to Lovers', color: COLORS.red },
  { name: 'Fated Mates', color: COLORS.purple },
  { name: 'Forbidden Love', color: COLORS.pink },
  { name: 'Forced Proximity', color: COLORS.orange },
  { name: 'Fake Dating', color: COLORS.yellow },
  { name: 'Friends to Lovers', color: COLORS.green },
  { name: 'Slow Burn', color: COLORS.brown },
  { name: 'Second Chance', color: COLORS.blue },
  { name: 'Grumpy/Sunshine', color: COLORS.gray },
  { name: 'Morally Grey Hero', color: COLORS.default },
  { name: 'Touch Her and Die', color: COLORS.red },
  { name: 'Only One Bed', color: COLORS.pink },
  { name: 'Marriage of Convenience', color: COLORS.purple },
  { name: 'Found Family', color: COLORS.green },
  { name: 'Bodyguard Romance', color: COLORS.blue },
];

// Micro tropes (viral moments)
export const MICRO_TROPES = [
  { name: 'Who Did This To You?', color: COLORS.red },
  { name: 'The Hand Necklace', color: COLORS.pink },
  { name: 'Injury Care', color: COLORS.orange },
  { name: 'Forehead Touch', color: COLORS.purple },
  { name: 'Carrying to Bed', color: COLORS.blue },
  { name: 'One Bed Sharing', color: COLORS.yellow },
  { name: 'Jealousy Scene', color: COLORS.green },
  { name: 'First Kiss Tension', color: COLORS.pink },
  { name: 'Rain Scene', color: COLORS.blue },
  { name: 'Dance Scene', color: COLORS.purple },
  { name: 'Training Scene', color: COLORS.orange },
  { name: 'Protective Moment', color: COLORS.red },
];

// Spice levels
export const SPICE_LEVELS = [
  { name: 'Clean (0)', color: COLORS.gray },
  { name: 'Sweet (1)', color: COLORS.green },
  { name: 'Mild (2)', color: COLORS.yellow },
  { name: 'Moderate (3)', color: COLORS.orange },
  { name: 'Spicy (4)', color: COLORS.red },
  { name: 'Extra Spicy (5)', color: COLORS.pink },
];

// Scene types
export const SCENE_TYPES = [
  { name: 'Opening Hook', color: COLORS.purple },
  { name: 'Inciting Incident', color: COLORS.blue },
  { name: 'Rising Action', color: COLORS.green },
  { name: 'Pinch Point', color: COLORS.orange },
  { name: 'Midpoint', color: COLORS.yellow },
  { name: 'Plot Twist', color: COLORS.red },
  { name: 'Dark Moment', color: COLORS.gray },
  { name: 'Climax', color: COLORS.pink },
  { name: 'Resolution', color: COLORS.green },
  { name: 'Romantic Beat', color: COLORS.pink },
  { name: 'Action/Battle', color: COLORS.red },
  { name: 'World-building', color: COLORS.purple },
  { name: 'Character Development', color: COLORS.blue },
];

// Scene statuses
export const SCENE_STATUSES = [
  { name: 'Planned', color: COLORS.gray },
  { name: 'Outlined', color: COLORS.blue },
  { name: 'Drafting', color: COLORS.yellow },
  { name: 'First Draft', color: COLORS.orange },
  { name: 'Revised', color: COLORS.purple },
  { name: 'Polished', color: COLORS.green },
];

// Location types
export const LOCATION_TYPES = [
  { name: 'Kingdom/Country', color: COLORS.purple },
  { name: 'City/Town', color: COLORS.blue },
  { name: 'Building/Structure', color: COLORS.gray },
  { name: 'Natural Landmark', color: COLORS.green },
  { name: 'Magical Place', color: COLORS.pink },
  { name: 'Hidden/Secret', color: COLORS.orange },
  { name: 'Realm/Dimension', color: COLORS.red },
];

// Magic system types
export const MAGIC_TYPES = [
  { name: 'Elemental', color: COLORS.blue },
  { name: 'Blood Magic', color: COLORS.red },
  { name: 'Shadow/Dark', color: COLORS.gray },
  { name: 'Light/Divine', color: COLORS.yellow },
  { name: 'Nature/Earth', color: COLORS.green },
  { name: 'Mind/Psychic', color: COLORS.purple },
  { name: 'Death/Necromancy', color: COLORS.brown },
  { name: 'Illusion', color: COLORS.pink },
  { name: 'Fae Magic', color: COLORS.orange },
  { name: 'Mate Bond', color: COLORS.red },
];

// Query/Submission statuses
export const QUERY_STATUSES = [
  { name: 'Researching', color: COLORS.gray },
  { name: 'Ready to Query', color: COLORS.blue },
  { name: 'Sent', color: COLORS.yellow },
  { name: 'Requested Materials', color: COLORS.purple },
  { name: 'Full Request', color: COLORS.pink },
  { name: 'Offer', color: COLORS.green },
  { name: 'Rejected', color: COLORS.red },
  { name: 'No Response', color: COLORS.brown },
  { name: 'Closed', color: COLORS.default },
];

// Social media platforms
export const SOCIAL_PLATFORMS = [
  { name: 'TikTok', color: COLORS.pink },
  { name: 'Instagram', color: COLORS.purple },
  { name: 'Twitter/X', color: COLORS.blue },
  { name: 'Pinterest', color: COLORS.red },
  { name: 'Substack', color: COLORS.orange },
  { name: 'YouTube', color: COLORS.red },
  { name: 'Facebook', color: COLORS.blue },
];

// Content types for marketing
export const CONTENT_TYPES = [
  { name: 'Cover Reveal', color: COLORS.pink },
  { name: 'Character Aesthetic', color: COLORS.purple },
  { name: 'Trope Bingo', color: COLORS.yellow },
  { name: 'Quote Graphic', color: COLORS.blue },
  { name: 'Behind the Scenes', color: COLORS.gray },
  { name: 'Writing Update', color: COLORS.green },
  { name: 'Book Recommendation', color: COLORS.orange },
  { name: 'ARC Announcement', color: COLORS.red },
  { name: 'Release Day', color: COLORS.green },
  { name: 'Giveaway', color: COLORS.yellow },
];

// Task priorities
export const PRIORITIES = [
  { name: 'High', color: COLORS.red },
  { name: 'Medium', color: COLORS.yellow },
  { name: 'Low', color: COLORS.gray },
];

// Task statuses
export const TASK_STATUSES = [
  { name: 'To Do', color: COLORS.gray },
  { name: 'In Progress', color: COLORS.blue },
  { name: 'Blocked', color: COLORS.red },
  { name: 'Done', color: COLORS.green },
];

// Relationship dynamics
export const RELATIONSHIP_DYNAMICS = [
  { name: 'Romantic Interest', color: COLORS.pink },
  { name: 'Best Friends', color: COLORS.green },
  { name: 'Rivals', color: COLORS.red },
  { name: 'Family', color: COLORS.blue },
  { name: 'Mentor/Student', color: COLORS.purple },
  { name: 'Enemies', color: COLORS.gray },
  { name: 'Allies', color: COLORS.yellow },
  { name: 'Former Lovers', color: COLORS.orange },
  { name: 'Complicated', color: COLORS.brown },
];

// Three-Act Structure beats
export const THREE_ACT_BEATS = [
  { name: 'Act 1 - Setup', color: COLORS.blue },
  { name: 'Inciting Incident', color: COLORS.purple },
  { name: 'First Plot Point', color: COLORS.pink },
  { name: 'Act 2A - Rising', color: COLORS.green },
  { name: 'Midpoint', color: COLORS.yellow },
  { name: 'Act 2B - Falling', color: COLORS.orange },
  { name: 'Second Plot Point', color: COLORS.red },
  { name: 'Act 3 - Resolution', color: COLORS.gray },
];

// Save the Cat beats
export const SAVE_THE_CAT_BEATS = [
  { name: 'Opening Image', color: COLORS.blue },
  { name: 'Theme Stated', color: COLORS.purple },
  { name: 'Setup', color: COLORS.gray },
  { name: 'Catalyst', color: COLORS.pink },
  { name: 'Debate', color: COLORS.orange },
  { name: 'Break Into Two', color: COLORS.yellow },
  { name: 'B Story', color: COLORS.green },
  { name: 'Fun and Games', color: COLORS.blue },
  { name: 'Midpoint', color: COLORS.purple },
  { name: 'Bad Guys Close In', color: COLORS.red },
  { name: 'All Is Lost', color: COLORS.gray },
  { name: 'Dark Night of the Soul', color: COLORS.brown },
  { name: 'Break Into Three', color: COLORS.yellow },
  { name: 'Finale', color: COLORS.pink },
  { name: 'Final Image', color: COLORS.green },
];
