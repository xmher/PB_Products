import notion from '../utils/notionClient.js';
import { TASK_STATUSES, PRIORITIES } from '../utils/constants.js';

/**
 * Creates the Master Tasks database
 * Central task management for all writing projects
 */
export async function createTasksDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '✅' },
    title: [{ type: 'text', text: { content: 'Tasks' } }],
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
      'Status': {
        select: {
          options: TASK_STATUSES,
        },
      },
      'Priority': {
        select: {
          options: PRIORITIES,
        },
      },
      'Category': {
        select: {
          options: [
            { name: 'Writing', color: 'blue' },
            { name: 'Editing', color: 'purple' },
            { name: 'Research', color: 'green' },
            { name: 'World-building', color: 'orange' },
            { name: 'Marketing', color: 'pink' },
            { name: 'Admin', color: 'gray' },
            { name: 'Querying', color: 'yellow' },
            { name: 'Publishing', color: 'red' },
          ],
        },
      },
      'Due Date': {
        date: {},
      },
      'Completed Date': {
        date: {},
      },
      'Time Estimate (min)': {
        number: {
          format: 'number',
        },
      },
      'Notes': {
        rich_text: {},
      },
      'Recurring': {
        checkbox: {},
      },
    },
  });

  console.log('Created Tasks database:', database.id);
  return database;
}

/**
 * Creates the Research database
 * Store research links, notes, and references
 */
export async function createResearchDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🔍' },
    title: [{ type: 'text', text: { content: 'Research' } }],
    properties: {
      'Topic': {
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
            { name: 'Historical', color: 'brown' },
            { name: 'Cultural', color: 'green' },
            { name: 'Scientific', color: 'blue' },
            { name: 'Geographical', color: 'purple' },
            { name: 'Mythology', color: 'pink' },
            { name: 'Combat/Weapons', color: 'red' },
            { name: 'Language', color: 'yellow' },
            { name: 'Fashion/Clothing', color: 'orange' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Source Type': {
        select: {
          options: [
            { name: 'Book', color: 'brown' },
            { name: 'Article', color: 'blue' },
            { name: 'Video', color: 'red' },
            { name: 'Podcast', color: 'purple' },
            { name: 'Expert Interview', color: 'green' },
            { name: 'Website', color: 'gray' },
            { name: 'Personal Experience', color: 'yellow' },
          ],
        },
      },
      'Link': {
        url: {},
      },
      'Key Points': {
        rich_text: {},
      },
      'How I\'ll Use It': {
        rich_text: {},
      },
      'Citation': {
        rich_text: {},
      },
      'Files': {
        files: {},
      },
    },
  });

  console.log('Created Research database:', database.id);
  return database;
}

/**
 * Add sample tasks
 */
export async function addSampleTasks(databaseId, manuscriptPageId) {
  const sampleTasks = [
    {
      task: 'Sample: Finish Chapter 3 draft',
      status: 'In Progress',
      priority: 'High',
      category: 'Writing',
      time: 120,
      notes: 'Focus on the confrontation scene',
    },
    {
      task: 'Sample: Research fae court etiquette',
      status: 'To Do',
      priority: 'Medium',
      category: 'Research',
      time: 60,
      notes: 'Need details for the ball scene',
    },
    {
      task: 'Sample: Update character sheet for Caelan',
      status: 'To Do',
      priority: 'Low',
      category: 'World-building',
      time: 30,
      notes: 'Add new backstory details revealed in Ch 2',
    },
  ];

  for (const task of sampleTasks) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '📌' },
      properties: {
        'Task': {
          title: [{ text: { content: task.task } }],
        },
        ...(manuscriptPageId && {
          'Manuscript': {
            relation: [{ id: manuscriptPageId }],
          },
        }),
        'Status': {
          select: { name: task.status },
        },
        'Priority': {
          select: { name: task.priority },
        },
        'Category': {
          select: { name: task.category },
        },
        'Time Estimate (min)': {
          number: task.time,
        },
        'Notes': {
          rich_text: [{ text: { content: task.notes } }],
        },
      },
    });
  }

  console.log('Added sample tasks');
}

export default {
  createTasksDatabase,
  createResearchDatabase,
  addSampleTasks,
};
