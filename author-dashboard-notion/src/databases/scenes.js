import notion from '../utils/notionClient.js';
import { SCENE_TYPES, SCENE_STATUSES, THREE_ACT_BEATS, SAVE_THE_CAT_BEATS, SPICE_LEVELS } from '../utils/constants.js';

/**
 * Creates the Scenes/Chapters database
 * Tracks every scene with plot structure alignment
 */
export async function createScenesDatabase(parentPageId, manuscriptsDbId, charactersDbId, locationsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🎬' },
    title: [{ type: 'text', text: { content: 'Scenes & Chapters' } }],
    properties: {
      'Scene Title': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Chapter': {
        number: {
          format: 'number',
        },
      },
      'Scene Number': {
        number: {
          format: 'number',
        },
      },
      'Scene Order': {
        formula: {
          expression: 'prop("Chapter") * 100 + prop("Scene Number")',
        },
      },
      'Status': {
        select: {
          options: SCENE_STATUSES,
        },
      },
      'Scene Type': {
        multi_select: {
          options: SCENE_TYPES,
        },
      },
      'Three-Act Beat': {
        select: {
          options: THREE_ACT_BEATS,
        },
      },
      'Save the Cat Beat': {
        select: {
          options: SAVE_THE_CAT_BEATS,
        },
      },
      'POV Character': {
        relation: {
          database_id: charactersDbId,
          single_property: {},
        },
      },
      'Characters Present': {
        relation: {
          database_id: charactersDbId,
          single_property: {},
        },
      },
      'Location': {
        relation: {
          database_id: locationsDbId,
          single_property: {},
        },
      },
      'Time': {
        select: {
          options: [
            { name: 'Morning', color: 'yellow' },
            { name: 'Afternoon', color: 'orange' },
            { name: 'Evening', color: 'purple' },
            { name: 'Night', color: 'blue' },
            { name: 'Dawn', color: 'pink' },
            { name: 'Twilight', color: 'gray' },
          ],
        },
      },
      'Word Count': {
        number: {
          format: 'number',
        },
      },
      'Scene Goal': {
        rich_text: {},
      },
      'Conflict': {
        rich_text: {},
      },
      'Outcome': {
        rich_text: {},
      },
      'Emotional Beat': {
        rich_text: {},
      },
      'Romance Progress': {
        select: {
          options: [
            { name: 'Tension Building', color: 'blue' },
            { name: 'First Meeting', color: 'green' },
            { name: 'Antagonistic', color: 'red' },
            { name: 'Softening', color: 'yellow' },
            { name: 'Vulnerability', color: 'purple' },
            { name: 'First Touch', color: 'pink' },
            { name: 'First Kiss', color: 'pink' },
            { name: 'Intimate', color: 'red' },
            { name: 'Confession', color: 'purple' },
            { name: 'Separation', color: 'gray' },
            { name: 'Reunion', color: 'green' },
          ],
        },
      },
      'Spice Level': {
        select: {
          options: SPICE_LEVELS,
        },
      },
      'Key Lines/Quotes': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Scenes database:', database.id);
  return database;
}

/**
 * Add sample scenes with plot structure
 */
export async function addSampleScenes(databaseId, manuscriptPageId) {
  const sampleScenes = [
    {
      title: 'Sample: The Assignment',
      chapter: 1,
      sceneNumber: 1,
      status: 'First Draft',
      sceneType: ['Opening Hook', 'Character Development'],
      threeAct: 'Act 1 - Setup',
      saveCat: 'Opening Image',
      time: 'Night',
      wordCount: 2500,
      goal: 'Establish Sera as a skilled but isolated assassin. Show her world.',
      conflict: 'Sera receives an assignment she knows will destroy her—kill the Shadow Prince.',
      outcome: 'She accepts, believing she has no choice, but something feels wrong.',
      emotional: 'Resignation, hidden fear, loneliness',
      romanceProgress: 'Tension Building',
      spice: 'Clean (0)',
    },
    {
      title: 'Sample: First Encounter',
      chapter: 2,
      sceneNumber: 1,
      status: 'Outlined',
      sceneType: ['Inciting Incident', 'Romantic Beat'],
      threeAct: 'Inciting Incident',
      saveCat: 'Catalyst',
      time: 'Twilight',
      wordCount: 0,
      goal: 'Sera and Caelan meet. Instant tension and attraction despite themselves.',
      conflict: 'She\'s there to kill him. He knows. Neither acts on it.',
      outcome: 'A dangerous game begins. He offers her a deal instead of death.',
      emotional: 'Shock, intrigue, unwanted attraction, danger',
      romanceProgress: 'First Meeting',
      spice: 'Clean (0)',
    },
  ];

  for (const scene of sampleScenes) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '📝' },
      properties: {
        'Scene Title': {
          title: [{ text: { content: scene.title } }],
        },
        ...(manuscriptPageId && {
          'Manuscript': {
            relation: [{ id: manuscriptPageId }],
          },
        }),
        'Chapter': {
          number: scene.chapter,
        },
        'Scene Number': {
          number: scene.sceneNumber,
        },
        'Status': {
          select: { name: scene.status },
        },
        'Scene Type': {
          multi_select: scene.sceneType.map(t => ({ name: t })),
        },
        'Three-Act Beat': {
          select: { name: scene.threeAct },
        },
        'Save the Cat Beat': {
          select: { name: scene.saveCat },
        },
        'Time': {
          select: { name: scene.time },
        },
        'Word Count': {
          number: scene.wordCount,
        },
        'Scene Goal': {
          rich_text: [{ text: { content: scene.goal } }],
        },
        'Conflict': {
          rich_text: [{ text: { content: scene.conflict } }],
        },
        'Outcome': {
          rich_text: [{ text: { content: scene.outcome } }],
        },
        'Emotional Beat': {
          rich_text: [{ text: { content: scene.emotional } }],
        },
        'Romance Progress': {
          select: { name: scene.romanceProgress },
        },
        'Spice Level': {
          select: { name: scene.spice },
        },
      },
    });
  }

  console.log('Added sample scenes');
}

export default createScenesDatabase;
