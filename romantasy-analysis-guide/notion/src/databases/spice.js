import notion from '../utils/notionClient.js';
import { HEAT_LEVELS, SCENE_TYPES } from '../utils/constants.js';

/**
 * Creates the Spice & Intimacy Tracker database
 * Track the progression and purpose of intimate scenes
 */
export async function createSpiceTrackerDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🔥' },
    title: [{ type: 'text', text: { content: 'Spice & Intimacy Tracker' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Track the pacing and purpose of intimate scenes. Great spice advances character and relationship—it doesn\'t pause the plot.',
        },
      },
    ],
    properties: {
      'Scene': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
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
      'Heat Level': {
        select: {
          options: HEAT_LEVELS,
        },
      },
      'Scene Type': {
        select: {
          options: SCENE_TYPES,
        },
      },
      'Emotional Context': {
        rich_text: {},
      },
      'What It Reveals': {
        rich_text: {},
      },
      'Dynamic Shift After': {
        rich_text: {},
      },
      'Plot Integrated?': {
        checkbox: {},
      },
      'Sensory Details Used': {
        rich_text: {},
      },
      'Dialogue Highlight': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Spice Tracker database:', database.id);
  return database;
}

/**
 * Creates the Banter Collection database
 * Track verbal chemistry and dialogue techniques
 */
export async function createBanterDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '💬' },
    title: [{ type: 'text', text: { content: 'Banter Collection' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Collect examples of verbal sparring and chemistry. Study the techniques that make dialogue crackle.',
        },
      },
    ],
    properties: {
      'Exchange': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
        },
      },
      'Chapter': {
        number: {
          format: 'number',
        },
      },
      'The Quote': {
        rich_text: {},
      },
      'Technique': {
        multi_select: {
          options: [
            { name: 'Double Meaning', color: 'purple' },
            { name: 'Callback Humor', color: 'blue' },
            { name: 'Power Play', color: 'red' },
            { name: 'Vulnerability as Wit', color: 'pink' },
            { name: 'Pet Names', color: 'green' },
            { name: 'One-Upmanship', color: 'orange' },
            { name: 'Innuendo', color: 'purple' },
            { name: 'Deflection', color: 'yellow' },
            { name: 'Challenge/Dare', color: 'red' },
          ],
        },
      },
      'What It Reveals': {
        rich_text: {},
      },
      'Why It Works': {
        rich_text: {},
      },
    },
  });

  console.log('Created Banter Collection database:', database.id);
  return database;
}

/**
 * Add sample spice entries
 */
export async function addSampleSpice(databaseId, bookPageId) {
  const scenes = [
    {
      name: 'Sample: First Almost Kiss',
      chapter: 15,
      percentage: 0.35,
      heat: '2 - Mild',
      type: 'Almost Kiss',
      context: 'After a dangerous battle, adrenaline high, they\'re alone for the first time.',
      reveals: 'His restraint—he pulls back because he doesn\'t want to take advantage.',
      shift: 'She now knows he wants her. The tension becomes charged.',
      integrated: true,
      sensory: 'His breath on her lips, the heat of his hand on her waist, her heart pounding.',
    },
    {
      name: 'Sample: First Real Kiss',
      chapter: 22,
      percentage: 0.52,
      heat: '3 - Moderate',
      type: 'First Kiss',
      context: 'Midpoint—after a revelation that changes everything.',
      reveals: 'Both their vulnerabilities. He admits fear; she admits wanting him.',
      shift: 'No going back. They\'ve crossed a line.',
      integrated: true,
      sensory: 'The taste of wine, his fingers in her hair, the stone wall cold against her back.',
    },
  ];

  for (const scene of scenes) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '🔥' },
      properties: {
        'Scene': {
          title: [{ text: { content: scene.name } }],
        },
        ...(bookPageId && {
          'Book': {
            relation: [{ id: bookPageId }],
          },
        }),
        'Chapter': {
          number: scene.chapter,
        },
        'Percentage': {
          number: scene.percentage,
        },
        'Heat Level': {
          select: { name: scene.heat },
        },
        'Scene Type': {
          select: { name: scene.type },
        },
        'Emotional Context': {
          rich_text: [{ text: { content: scene.context } }],
        },
        'What It Reveals': {
          rich_text: [{ text: { content: scene.reveals } }],
        },
        'Dynamic Shift After': {
          rich_text: [{ text: { content: scene.shift } }],
        },
        'Plot Integrated?': {
          checkbox: scene.integrated,
        },
        'Sensory Details Used': {
          rich_text: [{ text: { content: scene.sensory } }],
        },
      },
    });
  }

  console.log('Added sample spice entries');
}

/**
 * Add sample banter entries
 */
export async function addSampleBanter(databaseId, bookPageId) {
  const exchanges = [
    {
      name: 'Sample: The Nickname Challenge',
      chapter: 8,
      quote: '"Don\'t call me that." "What, \'princess\'? I thought you\'d like it. You certainly act like one." "And you act like something that crawled out of the sewers, but I don\'t call you \'rat.\'" "...I\'ll allow \'princess.\'"',
      techniques: ['Pet Names', 'One-Upmanship', 'Challenge/Dare'],
      reveals: 'Their dynamic—she gives as good as she gets, and he respects it.',
      works: 'The volley is fast, each line escalates, and his concession shows he\'s enjoying it.',
    },
    {
      name: 'Sample: The Threat-Flirt',
      chapter: 14,
      quote: '"If you keep looking at me like that, I won\'t be responsible for what happens." "Is that a threat?" "It\'s a promise."',
      techniques: ['Double Meaning', 'Innuendo', 'Power Play'],
      reveals: 'The tension is mutual. He\'s not the only one affected.',
      works: 'The shift from "threat" to "promise" turns danger into desire.',
    },
  ];

  for (const exchange of exchanges) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '💭' },
      properties: {
        'Exchange': {
          title: [{ text: { content: exchange.name } }],
        },
        ...(bookPageId && {
          'Book': {
            relation: [{ id: bookPageId }],
          },
        }),
        'Chapter': {
          number: exchange.chapter,
        },
        'The Quote': {
          rich_text: [{ text: { content: exchange.quote } }],
        },
        'Technique': {
          multi_select: exchange.techniques.map(t => ({ name: t })),
        },
        'What It Reveals': {
          rich_text: [{ text: { content: exchange.reveals } }],
        },
        'Why It Works': {
          rich_text: [{ text: { content: exchange.works } }],
        },
      },
    });
  }

  console.log('Added sample banter entries');
}

export default {
  createSpiceTrackerDatabase,
  createBanterDatabase,
  addSampleSpice,
  addSampleBanter,
};
