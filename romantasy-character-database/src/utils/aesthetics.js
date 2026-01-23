/**
 * Romantasy Character Database - Aesthetics
 * Dark Academia & Romantasy-inspired styling
 */

// ============================================
// COVER IMAGES (Unsplash - Free to use)
// ============================================

export const COVER_IMAGES = {
  // Main Dashboard
  dashboard: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',

  // Characters
  characters: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=1200',
  protagonist: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
  villain: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200',

  // Romance & Relationships
  relationships: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1200',
  romance: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200',

  // Tropes
  tropes: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200',

  // Character Arcs
  arcs: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200',

  // Spice/Intimacy
  spice: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1200',

  // World Building
  worldbuilding: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200',
  magic: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',

  // Sample Characters
  sampleFMC: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
  sampleMMC: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
  sampleSide: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
};

// ============================================
// ICONS (Emoji)
// ============================================

export const ICONS = {
  // Main sections
  dashboard: '🏰',
  characters: '👤',
  relationships: '💕',
  tropes: '📚',
  arcs: '🌙',
  spice: '🔥',

  // Character types
  protagonist: '⚔️',
  antagonist: '🗡️',
  loveInterest: '💜',
  sidekick: '🛡️',
  mentor: '🦉',

  // Romance
  romance: '💋',
  tension: '⚡',
  chemistry: '✨',
  heartbreak: '💔',
  hea: '💕',

  // Magic & Fantasy
  magic: '🔮',
  fae: '🧚',
  vampire: '🧛',
  shifter: '🐺',
  witch: '🌙',

  // Status
  alive: '💚',
  dead: '💀',
  missing: '❓',

  // Development
  concept: '💭',
  drafting: '✍️',
  complete: '✅',

  // Misc
  star: '⭐',
  crown: '👑',
  sword: '⚔️',
  rose: '🌹',
  moon: '🌙',
  sun: '☀️',
  heart: '❤️',
  fire: '🔥',
  sparkle: '✨',
  book: '📖',
  quill: '🪶',
};

// ============================================
// DECORATIVE DIVIDERS
// ============================================

export const DIVIDERS = {
  moonPhases: '🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌑',
  stars: '✦ ✧ ✦ ✧ ✦ ✧ ✦ ✧ ✦',
  roses: '🥀 ─── 🌹 ─── 🥀',
  swords: '⚔️ ━━━━━━━━━━ ⚔️',
  hearts: '♡ ─────────── ♡',
  sparkles: '✨ ─────────── ✨',
  simple: '───────────────',
  dots: '• • • • • • • • •',
  arrows: '➤ ─────────── ➤',
  crown: '♔ ━━━━━━━━━━ ♔',
};

// ============================================
// INSPIRATIONAL QUOTES (Romantasy-themed)
// ============================================

export const QUOTES = {
  characters: '"Every character should want something, even if it is only a glass of water." — Kurt Vonnegut',
  romance: '"The very essence of romance is uncertainty." — Oscar Wilde',
  writing: '"There is no greater agony than bearing an untold story inside you." — Maya Angelou',
  love: '"The course of true love never did run smooth." — Shakespeare',
  fantasy: '"We are all stories in the end. Just make it a good one." — Doctor Who',
  villains: '"Every villain is a hero in their own mind." — Tom Hiddleston',
  conflict: '"The only way to do great work is to love what you do." — Steve Jobs',
  arcs: '"The wound is the place where the light enters you." — Rumi',
  tropes: '"I fell in love the way you fall asleep: slowly, then all at once." — John Green',
  spice: '"A kiss is a secret told to the mouth instead of the ear." — Ingrid Bergman',
};

// ============================================
// COLOR SCHEMES
// ============================================

export const COLOR_SCHEMES = {
  darkAcademia: {
    primary: 'brown',
    secondary: 'default',
    accent: 'purple',
  },
  romantasy: {
    primary: 'purple',
    secondary: 'pink',
    accent: 'red',
  },
  fae: {
    primary: 'green',
    secondary: 'purple',
    accent: 'blue',
  },
  vampire: {
    primary: 'red',
    secondary: 'gray',
    accent: 'purple',
  },
  darkRomance: {
    primary: 'gray',
    secondary: 'red',
    accent: 'purple',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Creates a decorative header block
 */
export function createDecorativeHeader(text, dividerType = 'stars') {
  return [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: DIVIDERS[dividerType] },
          annotations: { color: 'gray' },
        }],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{
          type: 'text',
          text: { content: text },
        }],
      },
    },
  ];
}

/**
 * Creates a quote callout block
 */
export function createQuoteCallout(quoteKey, icon = '📖') {
  const quote = QUOTES[quoteKey] || QUOTES.writing;
  return {
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: [{
        type: 'text',
        text: { content: quote },
        annotations: { italic: true, color: 'gray' },
      }],
      icon: { type: 'emoji', emoji: icon },
      color: 'gray_background',
    },
  };
}

/**
 * Creates a simple divider block
 */
export function createDivider() {
  return {
    object: 'block',
    type: 'divider',
    divider: {},
  };
}

/**
 * Creates a styled paragraph
 */
export function createStyledParagraph(text, color = 'default', bold = false, italic = false) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{
        type: 'text',
        text: { content: text },
        annotations: { bold, italic, color },
      }],
    },
  };
}

/**
 * Creates a callout with icon and content
 */
export function createCallout(content, emoji = '💡', color = 'gray_background') {
  return {
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: [{
        type: 'text',
        text: { content },
      }],
      icon: { type: 'emoji', emoji },
      color,
    },
  };
}

/**
 * Creates a toggle block with content
 */
export function createToggle(title, children = []) {
  return {
    object: 'block',
    type: 'toggle',
    toggle: {
      rich_text: [{
        type: 'text',
        text: { content: title },
        annotations: { bold: true },
      }],
      children,
    },
  };
}

/**
 * Creates a bulleted list item
 */
export function createBulletItem(text) {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{
        type: 'text',
        text: { content: text },
      }],
    },
  };
}
