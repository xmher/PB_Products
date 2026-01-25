import notion from '../utils/notionClient.js';
import { BEAT_TYPES, TENSION_LEVELS } from '../utils/constants.js';

/**
 * Creates the Chapter Logs database
 * Track chapter-by-chapter observations while reading
 */
export async function createChapterLogsDatabase(parentPageId, booksDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📝' },
    title: [{ type: 'text', text: { content: 'Chapter Logs' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Quick chapter-by-chapter notes. Fill out after each chapter to capture observations before they fade.',
        },
      },
    ],
    properties: {
      'Chapter': {
        title: {},
      },
      'Book': {
        relation: {
          database_id: booksDbId,
          single_property: {},
        },
      },
      'Chapter #': {
        number: {
          format: 'number',
        },
      },
      'Start Page': {
        number: {
          format: 'number',
        },
      },
      'End Page': {
        number: {
          format: 'number',
        },
      },
      'POV Character': {
        rich_text: {},
      },
      'Location': {
        rich_text: {},
      },
      'One-Line Summary': {
        rich_text: {},
      },
      'Beat Types': {
        multi_select: {
          options: BEAT_TYPES,
        },
      },
      'Romantic Tension': {
        select: {
          options: TENSION_LEVELS,
        },
      },
      'Plot Tension': {
        select: {
          options: TENSION_LEVELS,
        },
      },
      'What Surprised Me': {
        rich_text: {},
      },
      'Craft Move Noticed': {
        rich_text: {},
      },
      'Favorite Line': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Chapter Logs database:', database.id);
  return database;
}

/**
 * Add sample chapter entries for a book
 */
export async function addSampleChapters(databaseId, bookPageId) {
  const chapters = [
    {
      title: 'Chapter 1',
      number: 1,
      summary: 'Introduce protagonist in their normal world before disruption',
      beatTypes: ['Fantasy Plot', 'Character Reveal'],
      romantictTension: '2',
      plotTension: '3 - Low',
      surprised: 'Sample: The immediate sensory immersion into the forest',
      craft: 'Sample: Opening line hook technique',
    },
    {
      title: 'Chapter 2',
      number: 2,
      summary: 'The inciting incident forces protagonist into action',
      beatTypes: ['Fantasy Plot', 'Romance Beat'],
      romantictTension: '4',
      plotTension: '5 - Medium',
      surprised: 'Sample: How quickly the meet-cute happened',
      craft: 'Sample: Tension through short sentences during action',
    },
    {
      title: 'Chapter 3',
      number: 3,
      summary: 'First major interaction between protagonists',
      beatTypes: ['Romance Beat', 'World-Building'],
      romantictTension: '6',
      plotTension: '4',
      surprised: 'Sample: The antagonism felt genuine, not forced',
      craft: 'Sample: Subtext in dialogue - saying one thing, meaning another',
    },
  ];

  for (const chapter of chapters) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '📄' },
      properties: {
        'Chapter': {
          title: [{ text: { content: chapter.title } }],
        },
        ...(bookPageId && {
          'Book': {
            relation: [{ id: bookPageId }],
          },
        }),
        'Chapter #': {
          number: chapter.number,
        },
        'One-Line Summary': {
          rich_text: [{ text: { content: chapter.summary } }],
        },
        'Beat Types': {
          multi_select: chapter.beatTypes.map(b => ({ name: b })),
        },
        'Romantic Tension': {
          select: { name: chapter.romantictTension },
        },
        'Plot Tension': {
          select: { name: chapter.plotTension },
        },
        'What Surprised Me': {
          rich_text: [{ text: { content: chapter.surprised } }],
        },
        'Craft Move Noticed': {
          rich_text: [{ text: { content: chapter.craft } }],
        },
      },
    });
  }

  console.log('Added sample chapters');
}

export default {
  createChapterLogsDatabase,
  addSampleChapters,
};
