/**
 * Aesthetic Constants for Author Dashboard
 * Dark Academia / Romantasy Vibes
 */

// High-quality Unsplash cover images (Dark Academia & Writing themed)
export const COVER_IMAGES = {
  // Main dashboard - moody library
  dashboard: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1500',

  // Story Bible - ancient books
  storyBible: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1500',

  // Characters - portraits/silhouettes
  characters: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1500',

  // World Building - fantasy castle
  worldBuilding: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1500',

  // Romantasy - roses and dark aesthetic
  romantasy: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1500',

  // Writing desk - vintage typewriter
  writing: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1500',

  // Planning - notebook and coffee
  planning: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1500',

  // Marketing - aesthetic flat lay
  marketing: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1500',

  // Submissions - letters and wax seal
  submissions: 'https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?w=1500',

  // Mobile - minimal aesthetic
  mobile: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1500',

  // Goals - candles and books
  goals: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=1500',

  // Magic - mystical
  magic: 'https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?w=1500',
};

// Icon sets - using emojis that fit the aesthetic
export const ICONS = {
  // Main sections
  dashboard: '🏛️',
  manuscripts: '📜',
  storyBible: '📖',
  characters: '🪞',
  locations: '🗺️',
  magic: '🔮',
  lore: '⚱️',
  scenes: '🎭',

  // Romantasy
  romantasy: '🥀',
  tropes: '💫',
  relationships: '🖤',
  spice: '🔥',

  // Progress
  sessions: '🕯️',
  goals: '🎯',
  tasks: '📋',
  research: '🔍',

  // Business
  queries: '✉️',
  beta: '📚',
  content: '📱',
  marketing: '✨',
  launch: '🚀',

  // Actions
  write: '✍️',
  add: '➕',
  idea: '💡',
  note: '📝',

  // Status
  inProgress: '🌙',
  complete: '⭐',
  waiting: '⏳',
};

// Color schemes for different sections
export const COLOR_SCHEMES = {
  // Main - purple/default for elegance
  main: {
    background: 'purple_background',
    callout: 'default',
  },

  // Story Bible - brown/sepia tones
  storyBible: {
    background: 'brown_background',
    callout: 'brown_background',
  },

  // Characters - pink for romance vibes
  characters: {
    background: 'pink_background',
    callout: 'pink_background',
  },

  // World Building - blue/purple mystical
  world: {
    background: 'purple_background',
    callout: 'blue_background',
  },

  // Romantasy - red/pink passionate
  romantasy: {
    background: 'red_background',
    callout: 'pink_background',
  },

  // Progress - green/yellow energetic
  progress: {
    background: 'green_background',
    callout: 'yellow_background',
  },

  // Business - gray/professional
  business: {
    background: 'gray_background',
    callout: 'default',
  },
};

// Decorative divider text
export const DIVIDERS = {
  fancy: '═══════════════════════════════════════',
  dots: '· · · · · · · · · · · · · · · · · · · · ·',
  stars: '✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦',
  moon: '☽ ─────────── ☾',
  rose: '⋆｡°✩ ─────── ✩°｡⋆',
};

// Aesthetic quotes for different sections
export const QUOTES = {
  dashboard: '"A writer is someone for whom writing is more difficult than it is for other people." — Thomas Mann',
  characters: '"Every character should want something, even if it is only a glass of water." — Kurt Vonnegut',
  worldBuilding: '"World-building is the art of creating a place that feels like home for your characters." — Unknown',
  romantasy: '"Romance is the glamour which turns the dust of everyday life into a golden haze." — Elinor Glyn',
  writing: '"Start writing, no matter what. The water does not flow until the faucet is turned on." — Louis L\'Amour',
  goals: '"A goal without a plan is just a wish." — Antoine de Saint-Exupéry',
};

export default {
  COVER_IMAGES,
  ICONS,
  COLOR_SCHEMES,
  DIVIDERS,
  QUOTES,
};
