import notion from '../utils/notionClient.js';
import { CHARACTER_ROLES, CHARACTER_ARCS, MAGIC_TYPES } from '../utils/constants.js';
import { DIVIDERS } from '../utils/aesthetics.js';

/**
 * Creates the Characters database
 * Comprehensive character profiles with romantasy-specific fields
 */
export async function createCharactersDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '👤' },
    title: [{ type: 'text', text: { content: 'Characters' } }],
    properties: {
      'Name': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Role': {
        select: {
          options: CHARACTER_ROLES,
        },
      },
      'Arc Type': {
        select: {
          options: CHARACTER_ARCS,
        },
      },
      'Age': {
        number: {
          format: 'number',
        },
      },
      'Pronouns': {
        select: {
          options: [
            { name: 'She/Her', color: 'pink' },
            { name: 'He/Him', color: 'blue' },
            { name: 'They/Them', color: 'purple' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Species/Race': {
        select: {
          options: [
            { name: 'Human', color: 'default' },
            { name: 'Fae', color: 'purple' },
            { name: 'Vampire', color: 'red' },
            { name: 'Shifter', color: 'orange' },
            { name: 'Witch/Warlock', color: 'green' },
            { name: 'Demon', color: 'gray' },
            { name: 'Angel', color: 'yellow' },
            { name: 'Elf', color: 'blue' },
            { name: 'Dragon', color: 'red' },
            { name: 'Half-Blood', color: 'pink' },
          ],
        },
      },
      'Magic/Power': {
        multi_select: {
          options: MAGIC_TYPES,
        },
      },
      'Physical Description': {
        rich_text: {},
      },
      'Personality': {
        rich_text: {},
      },
      'Motivation': {
        rich_text: {},
      },
      'Fatal Flaw': {
        rich_text: {},
      },
      'Secret/Lie': {
        rich_text: {},
      },
      'Backstory': {
        rich_text: {},
      },
      'Voice Notes': {
        rich_text: {},
      },
      'Reference Image': {
        files: {},
      },
      'POV Character': {
        checkbox: {},
      },
      'Love Interest Of': {
        relation: {
          database_id: 'self',
          single_property: {},
        },
      },
    },
  });

  console.log('Created Characters database:', database.id);
  return database;
}

/**
 * Adds sample character entry with romantasy-specific details and rich page content
 */
export async function addSampleCharacters(databaseId, manuscriptPageId) {
  // Sample FMC - Sera
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '🗡️' },
    cover: {
      type: 'external',
      external: { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1500' },
    },
    properties: {
      'Name': { title: [{ text: { content: 'Sample: Sera Blackwood' } }] },
      ...(manuscriptPageId && { 'Manuscript': { relation: [{ id: manuscriptPageId }] } }),
      'Role': { select: { name: 'Protagonist (FMC)' } },
      'Arc Type': { select: { name: 'Growth' } },
      'Age': { number: 24 },
      'Pronouns': { select: { name: 'She/Her' } },
      'Species/Race': { select: { name: 'Half-Blood' } },
      'Magic/Power': { multi_select: [{ name: 'Shadow/Dark' }, { name: 'Death/Necromancy' }] },
      'Physical Description': { rich_text: [{ text: { content: 'Silver hair, violet eyes, pale skin. Multiple scars on her arms from training.' } }] },
      'Personality': { rich_text: [{ text: { content: 'Guarded, fiercely independent, sarcastic. Secretly yearns for connection but pushes people away.' } }] },
      'Motivation': { rich_text: [{ text: { content: 'To prove she belongs in both courts despite her mixed heritage.' } }] },
      'Fatal Flaw': { rich_text: [{ text: { content: 'Trust issues prevent her from accepting help, even when she desperately needs it.' } }] },
      'Secret/Lie': { rich_text: [{ text: { content: 'She can see the dead, a power she hides because it marks her as cursed.' } }] },
      'POV Character': { checkbox: true },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: DIVIDERS.moon }, annotations: { color: 'gray' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '💜' },
          color: 'purple_background',
          rich_text: [
            { type: 'text', text: { content: '"I don\'t need anyone to save me. I\'ve been saving myself since the day I was born wrong."' }, annotations: { italic: true } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '🪞 Appearance' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Silver hair that catches moonlight, violet eyes that see too much, skin pale as death itself. Her arms bear the lattice-work of scars from years of training — marks she refuses to hide. She moves like a predator, like something raised in shadows.' } }],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '🖤 The Wound' } }] },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '🩸' },
          color: 'red_background',
          rich_text: [
            { type: 'text', text: { content: 'Born between courts. Belonging to neither.\n\n' }, annotations: { bold: true } },
            { type: 'text', text: { content: 'Her mother was human. Her father was Fae. Both courts see her as an abomination. She learned early that the only person she could rely on was herself.' } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '✨ Powers & Abilities' } }] },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { type: 'text', text: { content: 'Shadow Walking' }, annotations: { bold: true } },
            { type: 'text', text: { content: ' — Can step through shadows, traveling short distances' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { type: 'text', text: { content: 'Death Sight' }, annotations: { bold: true } },
            { type: 'text', text: { content: ' — Sees the recently dead (her deepest secret)' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { type: 'text', text: { content: 'Shadow Blades' }, annotations: { bold: true } },
            { type: 'text', text: { content: ' — Can manifest weapons from darkness' } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '💕 Character Arc' } }] },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: 'From "I need no one" → "I choose to let him in"' }, annotations: { color: 'gray' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: DIVIDERS.moon }, annotations: { color: 'gray' } }],
        },
      },
    ],
  });

  // Sample MMC - Prince Caelan
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '👑' },
    cover: {
      type: 'external',
      external: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1500' },
    },
    properties: {
      'Name': { title: [{ text: { content: 'Sample: Prince Caelan Nightshade' } }] },
      ...(manuscriptPageId && { 'Manuscript': { relation: [{ id: manuscriptPageId }] } }),
      'Role': { select: { name: 'Love Interest' } },
      'Arc Type': { select: { name: 'Redemption' } },
      'Age': { number: 127 },
      'Pronouns': { select: { name: 'He/Him' } },
      'Species/Race': { select: { name: 'Fae' } },
      'Magic/Power': { multi_select: [{ name: 'Shadow/Dark' }, { name: 'Illusion' }] },
      'Physical Description': { rich_text: [{ text: { content: 'Tall, dark hair that absorbs light, eyes that shift between silver and black. Impossibly beautiful in a dangerous way.' } }] },
      'Personality': { rich_text: [{ text: { content: 'Cold and calculating on the surface. Dry wit masks deep wounds. Intensely protective of those he claims as his.' } }] },
      'Motivation': { rich_text: [{ text: { content: 'To save his dying court, even if it means sacrificing his own happiness.' } }] },
      'Fatal Flaw': { rich_text: [{ text: { content: 'Believes he is beyond redemption, so acts the monster everyone expects.' } }] },
      'Secret/Lie': { rich_text: [{ text: { content: 'He recognized Sera as his mate the moment he saw her but hid it to protect her from court politics.' } }] },
      'POV Character': { checkbox: true },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: DIVIDERS.moon }, annotations: { color: 'gray' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '🖤' },
          color: 'default',
          rich_text: [
            { type: 'text', text: { content: '"They call me a monster. Perhaps it\'s time I stop pretending they\'re wrong."' }, annotations: { italic: true } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '🪞 Appearance' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Hair like liquid shadow, absorbing light rather than reflecting it. Eyes that shift between molten silver and void-black depending on his mood. Cheekbones sharp enough to cut. Beautiful the way a blade is beautiful — you know it will hurt you, and you reach for it anyway.' } }],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '🖤 The Wound' } }] },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '⚔️' },
          color: 'gray_background',
          rich_text: [
            { type: 'text', text: { content: 'The weight of a dying court. The sins of his father.\n\n' }, annotations: { bold: true } },
            { type: 'text', text: { content: 'His father\'s madness destroyed their court. Now Caelan bears the blame, the crown, and the impossible task of rebuilding what was lost. He\'s learned that caring for someone only gives your enemies a weapon.' } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '🔥 The Morally Grey Moments' } }] },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Kills without hesitation to protect what\'s his' } }],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Uses manipulation as easily as breathing' } }],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Hid the mate bond from Sera (to protect her? Or himself?)' } }],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '💕 Character Arc' } }] },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: 'From "I am the monster" → "Perhaps I can be something more"' }, annotations: { color: 'gray' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: DIVIDERS.moon }, annotations: { color: 'gray' } }],
        },
      },
    ],
  });

  console.log('Added sample characters');
}

export default createCharactersDatabase;
