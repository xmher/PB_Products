import notion from '../utils/notionClient.js';
import { WIP_STATUSES, GENRES, POV_OPTIONS, SPICE_LEVELS, MACRO_TROPES } from '../utils/constants.js';

/**
 * Creates the main Manuscripts/WIP database
 * This is the central hub for all writing projects
 */
export async function createManuscriptsDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📚' },
    title: [{ type: 'text', text: { content: 'Manuscripts' } }],
    properties: {
      // Title is auto-created, but we name it
      'Title': {
        title: {},
      },
      'Status': {
        select: {
          options: WIP_STATUSES,
        },
      },
      'Genre': {
        multi_select: {
          options: GENRES,
        },
      },
      'POV': {
        select: {
          options: POV_OPTIONS,
        },
      },
      'Spice Level': {
        select: {
          options: SPICE_LEVELS,
        },
      },
      'Tropes': {
        multi_select: {
          options: MACRO_TROPES,
        },
      },
      'Target Word Count': {
        number: {
          format: 'number',
        },
      },
      'Current Word Count': {
        number: {
          format: 'number',
        },
      },
      'Progress %': {
        formula: {
          expression: 'if(prop("Target Word Count") > 0, round(prop("Current Word Count") / prop("Target Word Count") * 100), 0)',
        },
      },
      'Start Date': {
        date: {},
      },
      'Target Deadline': {
        date: {},
      },
      'Logline': {
        rich_text: {},
      },
      'Series': {
        rich_text: {},
      },
      'Book Number': {
        number: {
          format: 'number',
        },
      },
      'Cover Image': {
        files: {},
      },
      'Notes': {
        rich_text: {},
      },
      'Last Updated': {
        last_edited_time: {},
      },
    },
  });

  console.log('Created Manuscripts database:', database.id);
  return database;
}

/**
 * Adds sample manuscript entries
 */
export async function addSampleManuscripts(databaseId) {
  const sampleManuscripts = [
    {
      title: 'Sample: The Shadow Court',
      status: 'Drafting',
      genre: ['Romantasy', 'Dark Romance'],
      pov: 'Multiple POV',
      spiceLevel: 'Spicy (4)',
      tropes: ['Enemies to Lovers', 'Fated Mates', 'Morally Grey Hero'],
      targetWordCount: 100000,
      currentWordCount: 35000,
      logline: 'A fae assassin must protect the prince she was sent to kill when an ancient evil threatens both their courts.',
      series: 'Courts of Shadow',
      bookNumber: 1,
    },
  ];

  for (const manuscript of sampleManuscripts) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '📖' },
      properties: {
        'Title': {
          title: [{ text: { content: manuscript.title } }],
        },
        'Status': {
          select: { name: manuscript.status },
        },
        'Genre': {
          multi_select: manuscript.genre.map(g => ({ name: g })),
        },
        'POV': {
          select: { name: manuscript.pov },
        },
        'Spice Level': {
          select: { name: manuscript.spiceLevel },
        },
        'Tropes': {
          multi_select: manuscript.tropes.map(t => ({ name: t })),
        },
        'Target Word Count': {
          number: manuscript.targetWordCount,
        },
        'Current Word Count': {
          number: manuscript.currentWordCount,
        },
        'Logline': {
          rich_text: [{ text: { content: manuscript.logline } }],
        },
        'Series': {
          rich_text: [{ text: { content: manuscript.series } }],
        },
        'Book Number': {
          number: manuscript.bookNumber,
        },
      },
    });
  }

  console.log('Added sample manuscripts');
}

export default createManuscriptsDatabase;
