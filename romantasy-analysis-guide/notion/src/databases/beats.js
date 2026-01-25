import notion from '../utils/notionClient.js';
import { ROMANCE_BEATS, ROMANCE_PHASES, FANTASY_BEATS } from '../utils/constants.js';

/**
 * Creates the Romance Beats database
 * Track Romancing the Beat framework elements
 */
export async function createRomanceBeatsDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '💕' },
    title: [{ type: 'text', text: { content: 'Romance Beat Tracker' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Track the Romancing the Beat (Gwen Hayes) framework. Log each romance beat as you encounter it.',
        },
      },
    ],
    properties: {
      'Beat': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
        },
      },
      'Beat Type': {
        select: {
          options: ROMANCE_BEATS,
        },
      },
      'Phase': {
        select: {
          options: ROMANCE_PHASES,
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
      'Percentage': {
        number: {
          format: 'percent',
        },
      },
      'How It\'s Executed': {
        rich_text: {},
      },
      'Quote/Moment': {
        rich_text: {},
      },
      'What Makes It Work': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Romance Beats database:', database.id);
  return database;
}

/**
 * Creates the Fantasy Beats database
 * Track Save the Cat! / Three-Act structure
 */
export async function createFantasyBeatsDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '⚔️' },
    title: [{ type: 'text', text: { content: 'Fantasy Beat Tracker' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Track the Save the Cat! / Three-Act structure for the fantasy plot. Note how plot beats connect to romance.',
        },
      },
    ],
    properties: {
      'Beat': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
        },
      },
      'Beat Type': {
        select: {
          options: FANTASY_BEATS,
        },
      },
      'Act': {
        select: {
          options: [
            { name: 'Act 1 (0-25%)', color: 'blue' },
            { name: 'Act 2A (25-50%)', color: 'green' },
            { name: 'Act 2B (50-75%)', color: 'orange' },
            { name: 'Act 3 (75-100%)', color: 'red' },
          ],
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
      'Percentage': {
        number: {
          format: 'percent',
        },
      },
      'What Happens': {
        rich_text: {},
      },
      'Romance Connection': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Fantasy Beats database:', database.id);
  return database;
}

/**
 * Add sample romance beats
 */
export async function addSampleRomanceBeats(databaseId, bookPageId) {
  const beats = [
    {
      name: 'Sample: The Meet Ugly',
      type: 'Meet Cute/Ugly',
      phase: 'Phase 1: Setup (0-25%)',
      chapter: 3,
      percentage: 0.08,
      execution: 'She enters his court as a prisoner. He\'s cold and menacing. Immediate antagonism.',
      quote: '"You\'re either very brave or very foolish to look at me like that."',
      works: 'The power imbalance creates instant tension. Her defiance hints at chemistry.',
    },
    {
      name: 'Sample: The Adhesion',
      type: 'The Adhesion',
      phase: 'Phase 1: Setup (0-25%)',
      chapter: 5,
      percentage: 0.12,
      execution: 'A magical bargain binds them together. She cannot leave without completing it.',
      quote: '',
      works: 'Classic forced proximity through magic. Neither can walk away.',
    },
    {
      name: 'Sample: Inkling of Desire',
      type: 'Inkling of Desire',
      phase: 'Phase 2: Falling (25-50%)',
      chapter: 12,
      percentage: 0.30,
      execution: 'She catches him being kind to a servant. Sees past the mask.',
      quote: '"I saw the way he looked at her—not with cruelty, but something almost like... gentleness."',
      works: 'The "crack in the armor" - she sees him do something that contradicts her bias.',
    },
  ];

  for (const beat of beats) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '💗' },
      properties: {
        'Beat': {
          title: [{ text: { content: beat.name } }],
        },
        ...(bookPageId && {
          'Book': {
            relation: [{ id: bookPageId }],
          },
        }),
        'Beat Type': {
          select: { name: beat.type },
        },
        'Phase': {
          select: { name: beat.phase },
        },
        'Chapter': {
          number: beat.chapter,
        },
        'Percentage': {
          number: beat.percentage,
        },
        'How It\'s Executed': {
          rich_text: [{ text: { content: beat.execution } }],
        },
        'Quote/Moment': {
          rich_text: [{ text: { content: beat.quote } }],
        },
        'What Makes It Work': {
          rich_text: [{ text: { content: beat.works } }],
        },
      },
    });
  }

  console.log('Added sample romance beats');
}

/**
 * Add sample fantasy beats
 */
export async function addSampleFantasyBeats(databaseId, bookPageId) {
  const beats = [
    {
      name: 'Sample: Opening Image',
      type: 'Opening Image',
      act: 'Act 1 (0-25%)',
      chapter: 1,
      percentage: 0.01,
      happens: 'Protagonist hunts in a frozen forest, barely surviving winter.',
      romance: 'Establishes her independence and survival skills—traits that will attract the LI.',
    },
    {
      name: 'Sample: Catalyst',
      type: 'Catalyst',
      act: 'Act 1 (0-25%)',
      chapter: 2,
      percentage: 0.05,
      happens: 'She kills a fae wolf, breaking the treaty. Must pay the price.',
      romance: 'This action is what brings her to him—the catalyst is the adhesion.',
    },
    {
      name: 'Sample: Midpoint',
      type: 'Midpoint',
      act: 'Act 2A (25-50%)',
      chapter: 20,
      percentage: 0.50,
      happens: 'First major revelation about the true villain. Stakes escalate.',
      romance: 'Often aligns with first kiss or major intimacy milestone.',
    },
  ];

  for (const beat of beats) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '🗡️' },
      properties: {
        'Beat': {
          title: [{ text: { content: beat.name } }],
        },
        ...(bookPageId && {
          'Book': {
            relation: [{ id: bookPageId }],
          },
        }),
        'Beat Type': {
          select: { name: beat.type },
        },
        'Act': {
          select: { name: beat.act },
        },
        'Chapter': {
          number: beat.chapter,
        },
        'Percentage': {
          number: beat.percentage,
        },
        'What Happens': {
          rich_text: [{ text: { content: beat.happens } }],
        },
        'Romance Connection': {
          rich_text: [{ text: { content: beat.romance } }],
        },
      },
    });
  }

  console.log('Added sample fantasy beats');
}

export default {
  createRomanceBeatsDatabase,
  createFantasyBeatsDatabase,
  addSampleRomanceBeats,
  addSampleFantasyBeats,
};
