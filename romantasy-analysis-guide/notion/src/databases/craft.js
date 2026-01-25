import notion from '../utils/notionClient.js';
import { CRAFT_CATEGORIES, WORLDBUILDING_TECHNIQUES } from '../utils/constants.js';

/**
 * Creates the Craft Moves to Steal database
 * Collect exceptional techniques worth emulating
 */
export async function createCraftMovesDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '✨' },
    title: [{ type: 'text', text: { content: 'Craft Moves to Steal' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Your personal library of techniques to emulate. When you read something brilliant, capture it here.',
        },
      },
    ],
    properties: {
      'Technique': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
        },
      },
      'Category': {
        select: {
          options: CRAFT_CATEGORIES,
        },
      },
      'Chapter': {
        number: {
          format: 'number',
        },
      },
      'Page': {
        number: {
          format: 'number',
        },
      },
      'The Quote/Example': {
        rich_text: {},
      },
      'Why It Works': {
        rich_text: {},
      },
      'How I\'ll Use It': {
        rich_text: {},
      },
      'Used in My WIP?': {
        checkbox: {},
      },
    },
  });

  console.log('Created Craft Moves database:', database.id);
  return database;
}

/**
 * Creates the World-Building Notes database
 * Track how lore is delivered without info-dumping
 */
export async function createWorldBuildingDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🌍' },
    title: [{ type: 'text', text: { content: 'World-Building Notes' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Track how the author delivers lore. In romantasy, world-building creates stakes and adhesion.',
        },
      },
    ],
    properties: {
      'Element': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
        },
      },
      'Type': {
        select: {
          options: [
            { name: 'Magic System', color: 'purple' },
            { name: 'Political Structure', color: 'blue' },
            { name: 'Geography', color: 'green' },
            { name: 'History/Lore', color: 'yellow' },
            { name: 'Culture/Customs', color: 'orange' },
            { name: 'Species/Races', color: 'pink' },
            { name: 'Religion/Mythology', color: 'gray' },
          ],
        },
      },
      'Delivery Technique': {
        select: {
          options: WORLDBUILDING_TECHNIQUES,
        },
      },
      'Chapter Introduced': {
        number: {
          format: 'number',
        },
      },
      'How It\'s Revealed': {
        rich_text: {},
      },
      'Romance Connection': {
        rich_text: {},
      },
      'Plot Connection': {
        rich_text: {},
      },
      'Example Passage': {
        rich_text: {},
      },
      'Integration Quality': {
        select: {
          options: [
            { name: 'Seamless', color: 'green' },
            { name: 'Good', color: 'blue' },
            { name: 'Noticeable', color: 'yellow' },
            { name: 'Info-Dump', color: 'red' },
          ],
        },
      },
    },
  });

  console.log('Created World-Building Notes database:', database.id);
  return database;
}

/**
 * Creates the Character Analysis database
 * Deep dive into protagonist construction
 */
export async function createCharacterDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '👤' },
    title: [{ type: 'text', text: { content: 'Character Analysis' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Deep dive into how the author builds compelling characters. Track wounds, lies, arcs, and voice.',
        },
      },
    ],
    properties: {
      'Character': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
        },
      },
      'Role': {
        select: {
          options: [
            { name: 'Protagonist (H1)', color: 'purple' },
            { name: 'Love Interest (H2)', color: 'pink' },
            { name: 'Antagonist', color: 'red' },
            { name: 'Supporting', color: 'blue' },
            { name: 'Mentor', color: 'green' },
          ],
        },
      },
      'External Goal': {
        rich_text: {},
      },
      'Internal Wound': {
        rich_text: {},
      },
      'The Lie They Believe': {
        rich_text: {},
      },
      'The Truth They Need': {
        rich_text: {},
      },
      'What They Fear': {
        rich_text: {},
      },
      'Want vs Need': {
        rich_text: {},
      },
      'Arc Summary': {
        rich_text: {},
      },
      'Voice Notes': {
        rich_text: {},
      },
      'Wound Shown (Chapter)': {
        number: {
          format: 'number',
        },
      },
      'Lie Challenged (Chapter)': {
        number: {
          format: 'number',
        },
      },
      'Transformation (Chapter)': {
        number: {
          format: 'number',
        },
      },
    },
  });

  console.log('Created Character Analysis database:', database.id);
  return database;
}

/**
 * Add sample craft moves
 */
export async function addSampleCraftMoves(databaseId, bookPageId) {
  const moves = [
    {
      name: 'Sample: Opening Hook - Sensory Immersion',
      category: 'Opening Hook',
      chapter: 1,
      quote: '"The forest had teeth, and tonight they were hungry." (Example—adapt for actual book)',
      works: 'Personification creates immediate atmosphere. We\'re grounded in danger before we know anything else.',
      use: 'Try opening my chapter 3 with a sensory line that establishes mood before character.',
    },
    {
      name: 'Sample: Tension - Short Sentences',
      category: 'Tension Building',
      chapter: 12,
      quote: '"He moved. She didn\'t breathe. One step. Two. His hand reached—" (Example)',
      works: 'Sentence fragments create staccato rhythm. Reader\'s heart rate increases with the pace.',
      use: 'Use during the chapter 15 confrontation scene.',
    },
    {
      name: 'Sample: Emotional Moment - Body Language',
      category: 'Emotional Moment',
      chapter: 28,
      quote: '"She didn\'t cry. But her hands shook as she pressed them flat against the table, as if she could hold herself together through sheer pressure." (Example)',
      works: 'Shows emotion through physical action. We FEEL her restraint and pain without being told.',
      use: 'Replace my "she felt devastated" with physical manifestation.',
    },
  ];

  for (const move of moves) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '💎' },
      properties: {
        'Technique': {
          title: [{ text: { content: move.name } }],
        },
        ...(bookPageId && {
          'Book': {
            relation: [{ id: bookPageId }],
          },
        }),
        'Category': {
          select: { name: move.category },
        },
        'Chapter': {
          number: move.chapter,
        },
        'The Quote/Example': {
          rich_text: [{ text: { content: move.quote } }],
        },
        'Why It Works': {
          rich_text: [{ text: { content: move.works } }],
        },
        'How I\'ll Use It': {
          rich_text: [{ text: { content: move.use } }],
        },
      },
    });
  }

  console.log('Added sample craft moves');
}

export default {
  createCraftMovesDatabase,
  createWorldBuildingDatabase,
  createCharacterDatabase,
  addSampleCraftMoves,
};
