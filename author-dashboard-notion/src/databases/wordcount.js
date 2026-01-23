import notion from '../utils/notionClient.js';

/**
 * Creates the Writing Sessions / Word Count Tracker database
 * Track daily writing with dynamic goal calculations
 */
export async function createWritingSessionsDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📊' },
    title: [{ type: 'text', text: { content: 'Writing Sessions' } }],
    properties: {
      'Date': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Session Date': {
        date: {},
      },
      'Words Written': {
        number: {
          format: 'number',
        },
      },
      'Time Spent (min)': {
        number: {
          format: 'number',
        },
      },
      'Words Per Hour': {
        formula: {
          expression: 'if(prop("Time Spent (min)") > 0, round(prop("Words Written") / prop("Time Spent (min)") * 60), 0)',
        },
      },
      'Daily Goal': {
        number: {
          format: 'number',
        },
      },
      'Goal Met': {
        formula: {
          expression: 'if(prop("Daily Goal") > 0, prop("Words Written") >= prop("Daily Goal"), false)',
        },
      },
      'Session Type': {
        select: {
          options: [
            { name: 'Drafting', color: 'blue' },
            { name: 'Revising', color: 'purple' },
            { name: 'Editing', color: 'orange' },
            { name: 'Outlining', color: 'green' },
            { name: 'Sprint', color: 'red' },
          ],
        },
      },
      'Mood': {
        select: {
          options: [
            { name: 'Flow State', color: 'green' },
            { name: 'Productive', color: 'blue' },
            { name: 'Steady', color: 'yellow' },
            { name: 'Struggling', color: 'orange' },
            { name: 'Blocked', color: 'red' },
          ],
        },
      },
      'Notes': {
        rich_text: {},
      },
      'Where I Left Off': {
        rich_text: {},
      },
      'Tomorrow\'s Focus': {
        rich_text: {},
      },
    },
  });

  console.log('Created Writing Sessions database:', database.id);
  return database;
}

/**
 * Creates the Writing Goals database
 * Set and track writing goals by project or overall
 */
export async function createWritingGoalsDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🎯' },
    title: [{ type: 'text', text: { content: 'Writing Goals' } }],
    properties: {
      'Goal': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Goal Type': {
        select: {
          options: [
            { name: 'Daily Word Count', color: 'blue' },
            { name: 'Weekly Word Count', color: 'purple' },
            { name: 'Monthly Word Count', color: 'pink' },
            { name: 'Draft Completion', color: 'green' },
            { name: 'Revision Round', color: 'orange' },
            { name: 'Deadline', color: 'red' },
            { name: 'Habit', color: 'yellow' },
          ],
        },
      },
      'Target': {
        number: {
          format: 'number',
        },
      },
      'Current': {
        number: {
          format: 'number',
        },
      },
      'Progress %': {
        formula: {
          expression: 'if(prop("Target") > 0, round(prop("Current") / prop("Target") * 100), 0)',
        },
      },
      'Start Date': {
        date: {},
      },
      'End Date': {
        date: {},
      },
      'Status': {
        select: {
          options: [
            { name: 'Not Started', color: 'gray' },
            { name: 'In Progress', color: 'blue' },
            { name: 'On Track', color: 'green' },
            { name: 'Behind', color: 'orange' },
            { name: 'At Risk', color: 'red' },
            { name: 'Completed', color: 'green' },
            { name: 'Abandoned', color: 'gray' },
          ],
        },
      },
      'Reward': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Writing Goals database:', database.id);
  return database;
}

/**
 * Add sample writing session
 */
export async function addSampleWritingSessions(databaseId, manuscriptPageId) {
  const today = new Date().toISOString().split('T')[0];

  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '✍️' },
    properties: {
      'Date': {
        title: [{ text: { content: `Sample Session - ${today}` } }],
      },
      ...(manuscriptPageId && {
        'Manuscript': {
          relation: [{ id: manuscriptPageId }],
        },
      }),
      'Session Date': {
        date: { start: today },
      },
      'Words Written': {
        number: 1500,
      },
      'Time Spent (min)': {
        number: 60,
      },
      'Daily Goal': {
        number: 1000,
      },
      'Session Type': {
        select: { name: 'Drafting' },
      },
      'Mood': {
        select: { name: 'Flow State' },
      },
      'Notes': {
        rich_text: [{ text: { content: 'Great session! The dialogue flowed naturally.' } }],
      },
      'Where I Left Off': {
        rich_text: [{ text: { content: 'Chapter 3, Scene 2 - Sera just discovered the truth about her mother.' } }],
      },
      'Tomorrow\'s Focus': {
        rich_text: [{ text: { content: 'Write the confrontation scene. Focus on the emotional beat.' } }],
      },
    },
  });

  console.log('Added sample writing session');
}

export default {
  createWritingSessionsDatabase,
  createWritingGoalsDatabase,
  addSampleWritingSessions,
};
