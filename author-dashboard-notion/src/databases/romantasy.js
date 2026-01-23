import notion from '../utils/notionClient.js';
import { MACRO_TROPES, MICRO_TROPES, RELATIONSHIP_DYNAMICS } from '../utils/constants.js';

/**
 * Creates the Trope Tracker database
 * Track both macro and micro tropes for romantasy writing
 */
export async function createTropesDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '💕' },
    title: [{ type: 'text', text: { content: 'Trope Tracker' } }],
    properties: {
      'Trope': {
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
            { name: 'Macro Trope', color: 'purple' },
            { name: 'Micro Trope', color: 'pink' },
            { name: 'BookTok Moment', color: 'red' },
          ],
        },
      },
      'Category': {
        multi_select: {
          options: [
            ...MACRO_TROPES,
            ...MICRO_TROPES,
          ],
        },
      },
      'Used': {
        checkbox: {},
      },
      'Scene/Chapter': {
        rich_text: {},
      },
      'Setup': {
        rich_text: {},
      },
      'Payoff': {
        rich_text: {},
      },
      'Reader Expectation': {
        rich_text: {},
      },
      'Marketing Potential': {
        select: {
          options: [
            { name: 'High Viral', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' },
          ],
        },
      },
      'TikTok Hook': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Tropes database:', database.id);
  return database;
}

/**
 * Creates the Relationship Tracker database
 * Track romance progression and character dynamics
 */
export async function createRelationshipsDatabase(parentPageId, manuscriptsDbId, charactersDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '💞' },
    title: [{ type: 'text', text: { content: 'Relationship Tracker' } }],
    properties: {
      'Relationship': {
        title: {},
      },
      'Manuscript': {
        relation: {
          database_id: manuscriptsDbId,
          single_property: {},
        },
      },
      'Character 1': {
        relation: {
          database_id: charactersDbId,
          single_property: {},
        },
      },
      'Character 2': {
        relation: {
          database_id: charactersDbId,
          single_property: {},
        },
      },
      'Dynamic': {
        select: {
          options: RELATIONSHIP_DYNAMICS,
        },
      },
      'Tension Level': {
        select: {
          options: [
            { name: '1 - Minimal', color: 'gray' },
            { name: '2 - Building', color: 'blue' },
            { name: '3 - Moderate', color: 'green' },
            { name: '4 - High', color: 'yellow' },
            { name: '5 - Explosive', color: 'orange' },
            { name: '6 - Breaking Point', color: 'red' },
          ],
        },
      },
      'Chemistry Score': {
        select: {
          options: [
            { name: '1 - None', color: 'gray' },
            { name: '2 - Sparks', color: 'blue' },
            { name: '3 - Simmering', color: 'green' },
            { name: '4 - Burning', color: 'yellow' },
            { name: '5 - On Fire', color: 'orange' },
            { name: '6 - Inferno', color: 'red' },
          ],
        },
      },
      'Stage': {
        select: {
          options: [
            { name: 'Pre-Meeting', color: 'gray' },
            { name: 'First Encounter', color: 'blue' },
            { name: 'Antagonistic', color: 'red' },
            { name: 'Reluctant Alliance', color: 'orange' },
            { name: 'Growing Attraction', color: 'yellow' },
            { name: 'Denial', color: 'purple' },
            { name: 'First Vulnerability', color: 'pink' },
            { name: 'Falling', color: 'green' },
            { name: 'Together', color: 'green' },
            { name: 'Black Moment', color: 'gray' },
            { name: 'Resolution', color: 'blue' },
            { name: 'HEA/HFN', color: 'pink' },
          ],
        },
      },
      'What They Want From Each Other': {
        rich_text: {},
      },
      'What They Fear About Each Other': {
        rich_text: {},
      },
      'Unresolved Tension': {
        rich_text: {},
      },
      'Key Moments': {
        rich_text: {},
      },
      'Obstacles': {
        rich_text: {},
      },
      'How They Change Each Other': {
        rich_text: {},
      },
    },
  });

  console.log('Created Relationships database:', database.id);
  return database;
}

/**
 * Creates the Spice Scene Tracker
 * Track romantic/intimate scenes for pacing
 */
export async function createSpiceTrackerDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🔥' },
    title: [{ type: 'text', text: { content: 'Spice Scene Tracker' } }],
    properties: {
      'Scene': {
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
      'Heat Level': {
        select: {
          options: [
            { name: '0 - Clean', color: 'gray' },
            { name: '1 - Sweet Kiss', color: 'green' },
            { name: '2 - Heated Kiss', color: 'blue' },
            { name: '3 - Fade to Black', color: 'purple' },
            { name: '4 - Steamy', color: 'orange' },
            { name: '5 - Explicit', color: 'red' },
          ],
        },
      },
      'Type': {
        select: {
          options: [
            { name: 'First Touch', color: 'blue' },
            { name: 'Almost Kiss', color: 'purple' },
            { name: 'First Kiss', color: 'pink' },
            { name: 'Tension Scene', color: 'yellow' },
            { name: 'Intimate Moment', color: 'orange' },
            { name: 'Full Scene', color: 'red' },
            { name: 'Morning After', color: 'green' },
          ],
        },
      },
      'Emotional Context': {
        rich_text: {},
      },
      'What It Means For The Plot': {
        rich_text: {},
      },
      'Sensory Details': {
        rich_text: {},
      },
      'Dialogue Highlights': {
        rich_text: {},
      },
      'Pacing Notes': {
        rich_text: {},
      },
      'Draft Status': {
        select: {
          options: [
            { name: 'Planned', color: 'gray' },
            { name: 'Drafted', color: 'yellow' },
            { name: 'Revised', color: 'blue' },
            { name: 'Polished', color: 'green' },
          ],
        },
      },
    },
  });

  console.log('Created Spice Tracker database:', database.id);
  return database;
}

/**
 * Add sample tropes with marketing angles
 */
export async function addSampleTropes(databaseId, manuscriptPageId) {
  const sampleTropes = [
    {
      trope: 'Sample: Enemies to Lovers Arc',
      type: 'Macro Trope',
      category: ['Enemies to Lovers'],
      used: true,
      setup: 'Sera is sent to kill Caelan. He knows. They\'re forced to work together.',
      payoff: 'The hate dissolves as they realize they\'re fighting the same enemy.',
      expectation: 'Readers want the banter, the tension, the moment he saves her despite everything.',
      marketing: 'High Viral',
      tiktok: '"He was supposed to be my target. Now he\'s the only one I trust."',
    },
    {
      trope: 'Sample: "Who Did This To You?"',
      type: 'Micro Trope',
      category: ['Who Did This To You?'],
      used: true,
      setup: 'Sera returns injured. Caelan finds her.',
      payoff: 'His rage reveals how much he cares despite their antagonism.',
      expectation: 'The switch from cold to protective. The quiet rage.',
      marketing: 'High Viral',
      tiktok: 'POV: He sees your injuries and his whole personality changes',
    },
  ];

  for (const trope of sampleTropes) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: '💘' },
      properties: {
        'Trope': {
          title: [{ text: { content: trope.trope } }],
        },
        ...(manuscriptPageId && {
          'Manuscript': {
            relation: [{ id: manuscriptPageId }],
          },
        }),
        'Type': {
          select: { name: trope.type },
        },
        'Category': {
          multi_select: trope.category.map(c => ({ name: c })),
        },
        'Used': {
          checkbox: trope.used,
        },
        'Setup': {
          rich_text: [{ text: { content: trope.setup } }],
        },
        'Payoff': {
          rich_text: [{ text: { content: trope.payoff } }],
        },
        'Reader Expectation': {
          rich_text: [{ text: { content: trope.expectation } }],
        },
        'Marketing Potential': {
          select: { name: trope.marketing },
        },
        'TikTok Hook': {
          rich_text: [{ text: { content: trope.tiktok } }],
        },
      },
    });
  }

  console.log('Added sample tropes');
}

export default {
  createTropesDatabase,
  createRelationshipsDatabase,
  createSpiceTrackerDatabase,
  addSampleTropes,
};
