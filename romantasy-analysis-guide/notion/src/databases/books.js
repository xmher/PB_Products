import notion from '../utils/notionClient.js';
import {
  HEAT_LEVELS,
  MACRO_TROPES,
  ANALYSIS_STATUS,
  SUBGENRES,
  RATING_SCALE,
} from '../utils/constants.js';

/**
 * Creates the main Books database for tracking analyzed books
 */
export async function createBooksDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📚' },
    title: [{ type: 'text', text: { content: 'Book Analysis Library' } }],
    description: [
      {
        type: 'text',
        text: {
          content: 'Track all books you analyze with this guide. Each entry links to chapter logs, beat tracking, and craft notes.',
        },
      },
    ],
    properties: {
      'Title': {
        title: {},
      },
      'Author': {
        rich_text: {},
      },
      'Series': {
        rich_text: {},
      },
      'Book #': {
        number: {
          format: 'number',
        },
      },
      'Status': {
        select: {
          options: ANALYSIS_STATUS,
        },
      },
      'Subgenre': {
        select: {
          options: SUBGENRES,
        },
      },
      'Heat Level': {
        select: {
          options: HEAT_LEVELS,
        },
      },
      'Primary Trope': {
        select: {
          options: MACRO_TROPES,
        },
      },
      'Secondary Tropes': {
        multi_select: {
          options: MACRO_TROPES,
        },
      },
      'Page Count': {
        number: {
          format: 'number',
        },
      },
      'Date Started': {
        date: {},
      },
      'Date Finished': {
        date: {},
      },
      'First Kiss %': {
        number: {
          format: 'percent',
        },
      },
      'Midpoint %': {
        number: {
          format: 'percent',
        },
      },
      'All Is Lost %': {
        number: {
          format: 'percent',
        },
      },
      'Overall Rating': {
        select: {
          options: RATING_SCALE,
        },
      },
      'Pacing Rating': {
        select: {
          options: RATING_SCALE,
        },
      },
      'Romance Arc Rating': {
        select: {
          options: RATING_SCALE,
        },
      },
      'Fantasy Plot Rating': {
        select: {
          options: RATING_SCALE,
        },
      },
      'Integration Rating': {
        select: {
          options: RATING_SCALE,
        },
      },
      'Pre-Read Expectations': {
        rich_text: {},
      },
      'Learning Goals': {
        rich_text: {},
      },
      'Key Lessons': {
        rich_text: {},
      },
      'Would Do Differently': {
        rich_text: {},
      },
      'Cover Image': {
        files: {},
      },
    },
  });

  console.log('Created Books database:', database.id);
  return database;
}

/**
 * Add a sample book entry
 */
export async function addSampleBook(databaseId) {
  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '📖' },
    properties: {
      'Title': {
        title: [{ text: { content: 'Sample: A Court of Thorns and Roses' } }],
      },
      'Author': {
        rich_text: [{ text: { content: 'Sarah J. Maas' } }],
      },
      'Series': {
        rich_text: [{ text: { content: 'A Court of Thorns and Roses' } }],
      },
      'Book #': {
        number: 1,
      },
      'Status': {
        select: { name: 'Not Started' },
      },
      'Subgenre': {
        select: { name: 'Fae Romance' },
      },
      'Heat Level': {
        select: { name: '3 - Moderate' },
      },
      'Primary Trope': {
        select: { name: 'Enemies to Lovers' },
      },
      'Secondary Tropes': {
        multi_select: [
          { name: 'Forced Proximity' },
          { name: 'Fated Mates / Soul Bond' },
        ],
      },
      'Pre-Read Expectations': {
        rich_text: [{ text: { content: 'Expecting fae court politics, slow burn romance, Beauty and the Beast retelling elements' } }],
      },
      'Learning Goals': {
        rich_text: [{ text: { content: 'Study how SJM handles the enemies-to-lovers arc progression and magic system integration' } }],
      },
    },
  });

  // Add page content with analysis template
  await notion.blocks.children.append({
    block_id: page.id,
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Pre-Read Setup' } }],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{ type: 'text', text: { content: 'Expectations & Goals' } }],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'What I expect: ', annotations: { bold: true } } },
                  { type: 'text', text: { content: '(Fill in before reading)' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'Learning focus: ', annotations: { bold: true } } },
                  { type: 'text', text: { content: '(What craft element to study)' } },
                ],
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Post-Read Synthesis' } }],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{ type: 'text', text: { content: 'Three Things Done Well' } }],
          children: [
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [{ type: 'text', text: { content: '' } }],
              },
            },
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [{ type: 'text', text: { content: '' } }],
              },
            },
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [{ type: 'text', text: { content: '' } }],
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{ type: 'text', text: { content: 'Techniques to Use in My WIP' } }],
          children: [
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [{ type: 'text', text: { content: '' } }],
              },
            },
          ],
        },
      },
    ],
  });

  console.log('Added sample book:', page.id);
  return page;
}

export default {
  createBooksDatabase,
  addSampleBook,
};
