import notion from '../utils/notionClient.js';
import { MACRO_TROPES, MICRO_TROPES } from '../utils/constants.js';

/**
 * Creates the Trope Tracker database
 * Track both macro and micro trope execution
 */
export async function createTropeTrackerDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🎭' },
    title: [{ type: 'text', text: { content: 'Trope Tracker' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Track how tropes are set up and paid off. Macro tropes define the relationship; micro tropes create viral moments.',
        },
      },
    ],
    properties: {
      'Trope': {
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
            { name: 'Macro Trope', color: 'purple' },
            { name: 'Micro Trope', color: 'pink' },
          ],
        },
      },
      'Trope Name': {
        select: {
          options: [...MACRO_TROPES, ...MICRO_TROPES],
        },
      },
      'Setup Chapter': {
        number: {
          format: 'number',
        },
      },
      'Payoff Chapter': {
        number: {
          format: 'number',
        },
      },
      'Setup Description': {
        rich_text: {},
      },
      'Payoff Description': {
        rich_text: {},
      },
      'What Makes It Work': {
        rich_text: {},
      },
      'Subverted?': {
        checkbox: {},
      },
      'Subversion Notes': {
        rich_text: {},
      },
      'Viral Potential': {
        select: {
          options: [
            { name: 'High', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' },
          ],
        },
      },
      'Quotable Moment': {
        rich_text: {},
      },
    },
  });

  console.log('Created Trope Tracker database:', database.id);
  return database;
}

/**
 * Add sample trope entries
 */
export async function addSampleTropes(databaseId, bookPageId) {
  const tropes = [
    {
      name: 'Sample: Enemies to Lovers Arc',
      type: 'Macro Trope',
      tropeName: 'Enemies to Lovers',
      setupChapter: 3,
      payoffChapter: 35,
      setup: 'She arrives as a prisoner in his court. He\'s cold, she\'s defiant. Genuine hatred based on what his kind did to her family.',
      payoff: 'He sacrifices his power to save her. She realizes he\'s been protecting her all along.',
      works: 'The hatred is JUSTIFIED not manufactured. Each crack in the armor is earned through action, not told.',
      subverted: false,
      viral: 'High',
      quote: '"I thought I came here to destroy you. I didn\'t expect you to destroy me first."',
    },
    {
      name: 'Sample: Who Did This To You?',
      type: 'Micro Trope',
      tropeName: 'Who Did This To You?',
      setupChapter: 18,
      payoffChapter: 18,
      setup: 'She returns from a mission injured. He finds her bleeding.',
      payoff: 'His immediate shift from cold to murderous protective rage.',
      works: 'The contrast between his usual demeanor and his reaction reveals depth of feeling he\'s been hiding.',
      subverted: false,
      viral: 'High',
      quote: '"Who. Did. This." Not a question. A death sentence.',
    },
    {
      name: 'Sample: Only One Bed',
      type: 'Micro Trope',
      tropeName: 'Only One Bed',
      setupChapter: 12,
      payoffChapter: 12,
      setup: 'Forced to take shelter during a storm. The inn has one room.',
      payoff: 'They try to maintain distance but end up gravitating together for warmth.',
      works: 'The forced intimacy creates vulnerability. Neither can hide behind walls.',
      subverted: false,
      viral: 'Medium',
      quote: '"I\'ll take the floor." "Don\'t be ridiculous. It\'s freezing." "Fine. But stay on your side."',
    },
  ];

  for (const trope of tropes) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: trope.type === 'Macro Trope' ? '💜' : '💗' },
      properties: {
        'Trope': {
          title: [{ text: { content: trope.name } }],
        },
        ...(bookPageId && {
          'Book': {
            relation: [{ id: bookPageId }],
          },
        }),
        'Type': {
          select: { name: trope.type },
        },
        'Trope Name': {
          select: { name: trope.tropeName },
        },
        'Setup Chapter': {
          number: trope.setupChapter,
        },
        'Payoff Chapter': {
          number: trope.payoffChapter,
        },
        'Setup Description': {
          rich_text: [{ text: { content: trope.setup } }],
        },
        'Payoff Description': {
          rich_text: [{ text: { content: trope.payoff } }],
        },
        'What Makes It Work': {
          rich_text: [{ text: { content: trope.works } }],
        },
        'Subverted?': {
          checkbox: trope.subverted,
        },
        'Viral Potential': {
          select: { name: trope.viral },
        },
        'Quotable Moment': {
          rich_text: [{ text: { content: trope.quote } }],
        },
      },
    });
  }

  console.log('Added sample tropes');
}

export default {
  createTropeTrackerDatabase,
  addSampleTropes,
};
