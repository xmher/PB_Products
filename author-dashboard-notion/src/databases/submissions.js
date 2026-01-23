import notion from '../utils/notionClient.js';
import { QUERY_STATUSES } from '../utils/constants.js';

/**
 * Creates the Query/Submission Tracker database
 * For authors seeking traditional publishing
 */
export async function createSubmissionsDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📬' },
    title: [{ type: 'text', text: { content: 'Query Tracker' } }],
    properties: {
      'Agent/Publisher': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Agency': {
        rich_text: {},
      },
      'Status': {
        select: {
          options: QUERY_STATUSES,
        },
      },
      'Query Type': {
        select: {
          options: [
            { name: 'Query Letter', color: 'blue' },
            { name: 'Query + Synopsis', color: 'purple' },
            { name: 'Query + Pages', color: 'green' },
            { name: 'Full Request', color: 'pink' },
            { name: 'Pitch Contest', color: 'yellow' },
            { name: 'Direct Submission', color: 'orange' },
          ],
        },
      },
      'Date Sent': {
        date: {},
      },
      'Response Date': {
        date: {},
      },
      'Days Waiting': {
        formula: {
          expression: 'if(empty(prop("Response Date")), if(empty(prop("Date Sent")), 0, dateBetween(now(), prop("Date Sent"), "days")), dateBetween(prop("Response Date"), prop("Date Sent"), "days"))',
        },
      },
      'Expected Response Time': {
        rich_text: {},
      },
      'Follow Up Date': {
        date: {},
      },
      'Materials Sent': {
        multi_select: {
          options: [
            { name: 'Query Letter', color: 'blue' },
            { name: 'Synopsis', color: 'purple' },
            { name: 'First 5 Pages', color: 'green' },
            { name: 'First 10 Pages', color: 'green' },
            { name: 'First 3 Chapters', color: 'yellow' },
            { name: 'First 50 Pages', color: 'orange' },
            { name: 'Full Manuscript', color: 'red' },
          ],
        },
      },
      'Genres They Rep': {
        multi_select: {
          options: [
            { name: 'Romantasy', color: 'pink' },
            { name: 'Fantasy', color: 'purple' },
            { name: 'Romance', color: 'red' },
            { name: 'YA', color: 'blue' },
            { name: 'Adult', color: 'gray' },
            { name: 'Sci-Fi', color: 'green' },
          ],
        },
      },
      'MSWL Match': {
        rich_text: {},
      },
      'Personalization': {
        rich_text: {},
      },
      'Response Notes': {
        rich_text: {},
      },
      'Feedback': {
        rich_text: {},
      },
      'Website': {
        url: {},
      },
      'QueryTracker Link': {
        url: {},
      },
      'Priority': {
        select: {
          options: [
            { name: 'Dream Agent', color: 'pink' },
            { name: 'High', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' },
          ],
        },
      },
    },
  });

  console.log('Created Query Tracker database:', database.id);
  return database;
}

/**
 * Creates the Beta Readers / ARC database
 */
export async function createBetaReadersDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📖' },
    title: [{ type: 'text', text: { content: 'Beta Readers & ARCs' } }],
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
      'Type': {
        select: {
          options: [
            { name: 'Beta Reader', color: 'blue' },
            { name: 'ARC Reader', color: 'purple' },
            { name: 'Sensitivity Reader', color: 'pink' },
            { name: 'CP (Critique Partner)', color: 'green' },
          ],
        },
      },
      'Status': {
        select: {
          options: [
            { name: 'Invited', color: 'gray' },
            { name: 'Accepted', color: 'blue' },
            { name: 'Reading', color: 'yellow' },
            { name: 'Feedback Received', color: 'green' },
            { name: 'Declined', color: 'red' },
            { name: 'No Response', color: 'gray' },
          ],
        },
      },
      'Contact': {
        email: {},
      },
      'Platform': {
        select: {
          options: [
            { name: 'Goodreads', color: 'brown' },
            { name: 'BookTok', color: 'pink' },
            { name: 'Bookstagram', color: 'purple' },
            { name: 'Blog', color: 'blue' },
            { name: 'Amazon', color: 'orange' },
            { name: 'StoryGraph', color: 'green' },
          ],
        },
      },
      'Follower Count': {
        number: {
          format: 'number',
        },
      },
      'Date Sent': {
        date: {},
      },
      'Due Date': {
        date: {},
      },
      'Review Posted': {
        checkbox: {},
      },
      'Review Link': {
        url: {},
      },
      'Feedback Summary': {
        rich_text: {},
      },
      'Would Use Again': {
        checkbox: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Beta Readers database:', database.id);
  return database;
}

/**
 * Add sample query entry
 */
export async function addSampleQuery(databaseId, manuscriptPageId) {
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '✉️' },
    properties: {
      'Agent/Publisher': {
        title: [{ text: { content: 'Sample: Jane Agent' } }],
      },
      ...(manuscriptPageId && {
        'Manuscript': {
          relation: [{ id: manuscriptPageId }],
        },
      }),
      'Agency': {
        rich_text: [{ text: { content: 'Dream Literary Agency' } }],
      },
      'Status': {
        select: { name: 'Researching' },
      },
      'Query Type': {
        select: { name: 'Query + Pages' },
      },
      'Genres They Rep': {
        multi_select: [{ name: 'Romantasy' }, { name: 'Fantasy' }, { name: 'Romance' }],
      },
      'MSWL Match': {
        rich_text: [{ text: { content: 'Looking for: enemies-to-lovers, morally grey heroes, dark romantasy with emotional depth' } }],
      },
      'Priority': {
        select: { name: 'Dream Agent' },
      },
    },
  });

  console.log('Added sample query');
}

export default {
  createSubmissionsDatabase,
  createBetaReadersDatabase,
  addSampleQuery,
};
