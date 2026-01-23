import notion from '../utils/notionClient.js';
import { SOCIAL_PLATFORMS, CONTENT_TYPES } from '../utils/constants.js';

/**
 * Creates the Content Calendar database
 * Plan and track social media content for book marketing
 */
export async function createContentCalendarDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📅' },
    title: [{ type: 'text', text: { content: 'Content Calendar' } }],
    properties: {
      'Title': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Platform': {
        multi_select: {
          options: SOCIAL_PLATFORMS,
        },
      },
      'Content Type': {
        select: {
          options: CONTENT_TYPES,
        },
      },
      'Publish Date': {
        date: {},
      },
      'Status': {
        select: {
          options: [
            { name: 'Idea', color: 'gray' },
            { name: 'Planned', color: 'blue' },
            { name: 'Creating', color: 'yellow' },
            { name: 'Ready', color: 'purple' },
            { name: 'Scheduled', color: 'orange' },
            { name: 'Published', color: 'green' },
          ],
        },
      },
      'Caption/Script': {
        rich_text: {},
      },
      'Hashtags': {
        rich_text: {},
      },
      'Hook': {
        rich_text: {},
      },
      'Media': {
        files: {},
      },
      'Link': {
        url: {},
      },
      'Engagement': {
        number: {
          format: 'number',
        },
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Content Calendar database:', database.id);
  return database;
}

/**
 * Creates the Marketing Ideas database
 * Capture and organize marketing ideas
 */
export async function createMarketingIdeasDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '💡' },
    title: [{ type: 'text', text: { content: 'Marketing Ideas' } }],
    properties: {
      'Idea': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Category': {
        select: {
          options: [
            { name: 'Trope Bingo', color: 'pink' },
            { name: 'Quote Graphic', color: 'blue' },
            { name: 'Character Aesthetic', color: 'purple' },
            { name: 'Behind the Scenes', color: 'gray' },
            { name: 'Book Rec', color: 'green' },
            { name: 'Viral Trend', color: 'red' },
            { name: 'Collaboration', color: 'yellow' },
            { name: 'Giveaway', color: 'orange' },
          ],
        },
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
      'Effort Level': {
        select: {
          options: [
            { name: 'Quick (< 30 min)', color: 'green' },
            { name: 'Medium (1-2 hrs)', color: 'yellow' },
            { name: 'High (half day+)', color: 'red' },
          ],
        },
      },
      'Best Platform': {
        multi_select: {
          options: SOCIAL_PLATFORMS,
        },
      },
      'Description': {
        rich_text: {},
      },
      'Example/Reference': {
        url: {},
      },
      'Used': {
        checkbox: {},
      },
    },
  });

  console.log('Created Marketing Ideas database:', database.id);
  return database;
}

/**
 * Creates the Book Launch Checklist database
 */
export async function createLaunchChecklistDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🚀' },
    title: [{ type: 'text', text: { content: 'Launch Checklist' } }],
    properties: {
      'Task': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Phase': {
        select: {
          options: [
            { name: '8 Weeks Out', color: 'gray' },
            { name: '6 Weeks Out', color: 'blue' },
            { name: '4 Weeks Out', color: 'purple' },
            { name: '2 Weeks Out', color: 'yellow' },
            { name: 'Launch Week', color: 'orange' },
            { name: 'Launch Day', color: 'red' },
            { name: 'Post-Launch', color: 'green' },
          ],
        },
      },
      'Category': {
        select: {
          options: [
            { name: 'Social Media', color: 'pink' },
            { name: 'Email List', color: 'blue' },
            { name: 'ARC/Reviews', color: 'purple' },
            { name: 'Retailer Setup', color: 'green' },
            { name: 'Website', color: 'gray' },
            { name: 'Graphics', color: 'yellow' },
            { name: 'Promotion', color: 'orange' },
          ],
        },
      },
      'Due Date': {
        date: {},
      },
      'Status': {
        select: {
          options: [
            { name: 'Not Started', color: 'gray' },
            { name: 'In Progress', color: 'blue' },
            { name: 'Done', color: 'green' },
            { name: 'Skipped', color: 'red' },
          ],
        },
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Launch Checklist database:', database.id);
  return database;
}

/**
 * Add sample content calendar entries
 */
export async function addSampleContent(databaseId, manuscriptPageId) {
  const sampleContent = [
    {
      title: 'Sample: Cover Reveal Reel',
      platform: ['TikTok', 'Instagram'],
      contentType: 'Cover Reveal',
      status: 'Idea',
      caption: 'After months of work, I finally get to show you the cover for THE SHADOW COURT',
      hook: 'POV: You finally get to see the cover of your debut novel',
      hashtags: '#romantasy #booktok #coverreveal #authortok #enemiestolovers',
    },
    {
      title: 'Sample: Trope List Graphic',
      platform: ['Instagram', 'Pinterest'],
      contentType: 'Trope Bingo',
      status: 'Planned',
      caption: 'If you love these tropes, THE SHADOW COURT is for you',
      hashtags: '#romantasytropes #bookrecs #enemiestolovers #fatedmates',
    },
  ];

  for (const content of sampleContent) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '📱' },
      properties: {
        'Title': {
          title: [{ text: { content: content.title } }],
        },
        ...(manuscriptPageId && {
          'Manuscript': {
            relation: [{ id: manuscriptPageId }],
          },
        }),
        'Platform': {
          multi_select: content.platform.map(p => ({ name: p })),
        },
        'Content Type': {
          select: { name: content.contentType },
        },
        'Status': {
          select: { name: content.status },
        },
        'Caption/Script': {
          rich_text: [{ text: { content: content.caption } }],
        },
        'Hook': {
          rich_text: [{ text: { content: content.hook || '' } }],
        },
        'Hashtags': {
          rich_text: [{ text: { content: content.hashtags } }],
        },
      },
    });
  }

  console.log('Added sample content');
}

export default {
  createContentCalendarDatabase,
  createMarketingIdeasDatabase,
  createLaunchChecklistDatabase,
  addSampleContent,
};
