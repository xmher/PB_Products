import notion from '../utils/notionClient.js';
import { LOCATION_TYPES, MAGIC_TYPES } from '../utils/constants.js';

/**
 * Creates the Locations database for world-building
 */
export async function createLocationsDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🏰' },
    title: [{ type: 'text', text: { content: 'Locations' } }],
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
          options: LOCATION_TYPES,
        },
      },
      'Parent Location': {
        relation: {
          database_id: 'self',
          single_property: {},
        },
      },
      'Climate': {
        select: {
          options: [
            { name: 'Temperate', color: 'green' },
            { name: 'Tropical', color: 'yellow' },
            { name: 'Arctic', color: 'blue' },
            { name: 'Desert', color: 'orange' },
            { name: 'Magical', color: 'purple' },
            { name: 'Varies', color: 'gray' },
          ],
        },
      },
      'Description': {
        rich_text: {},
      },
      'Atmosphere/Mood': {
        rich_text: {},
      },
      'Key Features': {
        rich_text: {},
      },
      'Cultural Notes': {
        rich_text: {},
      },
      'Dangers': {
        rich_text: {},
      },
      'Reference Images': {
        files: {},
      },
      'Appears In Scenes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Locations database:', database.id);
  return database;
}

/**
 * Creates the Magic Systems database
 */
export async function createMagicSystemsDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '✨' },
    title: [{ type: 'text', text: { content: 'Magic Systems' } }],
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
          options: MAGIC_TYPES,
        },
      },
      'Source': {
        rich_text: {},
      },
      'Rules/Limitations': {
        rich_text: {},
      },
      'Cost/Price': {
        rich_text: {},
      },
      'Manifestation': {
        rich_text: {},
      },
      'Who Can Use': {
        rich_text: {},
      },
      'Tied to Romance': {
        checkbox: {},
      },
      'Romance Connection': {
        rich_text: {},
      },
      'Weaknesses': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log('Created Magic Systems database:', database.id);
  return database;
}

/**
 * Creates the Lore/World Rules database
 */
export async function createLoreDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📜' },
    title: [{ type: 'text', text: { content: 'Lore & World Rules' } }],
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
            { name: 'History', color: 'brown' },
            { name: 'Politics', color: 'red' },
            { name: 'Religion', color: 'purple' },
            { name: 'Culture', color: 'green' },
            { name: 'Economy', color: 'yellow' },
            { name: 'Technology', color: 'blue' },
            { name: 'Mythology', color: 'pink' },
            { name: 'Language', color: 'orange' },
            { name: 'Creatures', color: 'gray' },
          ],
        },
      },
      'Summary': {
        rich_text: {},
      },
      'Details': {
        rich_text: {},
      },
      'Impact on Plot': {
        rich_text: {},
      },
      'Related Characters': {
        rich_text: {},
      },
      'Source/Reference': {
        url: {},
      },
    },
  });

  console.log('Created Lore database:', database.id);
  return database;
}

/**
 * Add sample world-building entries
 */
export async function addSampleWorldbuilding(locationsDbId, magicDbId, manuscriptPageId) {
  // Sample location
  await notion.pages.create({
    parent: { database_id: locationsDbId },
    icon: { type: 'emoji', emoji: '🏯' },
    properties: {
      'Name': {
        title: [{ text: { content: 'Sample: The Shadow Court' } }],
      },
      ...(manuscriptPageId && {
        'Manuscript': {
          relation: [{ id: manuscriptPageId }],
        },
      }),
      'Type': {
        select: { name: 'Kingdom/Country' },
      },
      'Climate': {
        select: { name: 'Magical' },
      },
      'Description': {
        rich_text: [{ text: { content: 'A realm of eternal twilight where shadows are alive and darkness is a source of power. The sun never fully rises, casting the land in perpetual dusk.' } }],
      },
      'Atmosphere/Mood': {
        rich_text: [{ text: { content: 'Mysterious, dangerous, seductive. Beautiful in a haunting way.' } }],
      },
      'Key Features': {
        rich_text: [{ text: { content: 'The Obsidian Palace, The Whispering Woods, The Lake of Lost Souls, The Night Market' } }],
      },
    },
  });

  // Sample magic system
  await notion.pages.create({
    parent: { database_id: magicDbId },
    icon: { type: 'emoji', emoji: '🌑' },
    properties: {
      'Name': {
        title: [{ text: { content: 'Sample: Shadow Weaving' } }],
      },
      ...(manuscriptPageId && {
        'Manuscript': {
          relation: [{ id: manuscriptPageId }],
        },
      }),
      'Type': {
        select: { name: 'Shadow/Dark' },
      },
      'Source': {
        rich_text: [{ text: { content: 'Drawn from the space between light and dark. Strongest during twilight hours.' } }],
      },
      'Rules/Limitations': {
        rich_text: [{ text: { content: 'Cannot create shadows where none exist. Requires existing darkness to manipulate. Bright light weakens the user.' } }],
      },
      'Cost/Price': {
        rich_text: [{ text: { content: 'Extended use causes the user\'s emotions to fade. Over time, heavy users become cold and detached.' } }],
      },
      'Tied to Romance': {
        checkbox: true,
      },
      'Romance Connection': {
        rich_text: [{ text: { content: 'When bonded mates share shadow magic, they can literally feel each other\'s emotions through the darkness.' } }],
      },
    },
  });

  console.log('Added sample world-building entries');
}

export default {
  createLocationsDatabase,
  createMagicSystemsDatabase,
  createLoreDatabase,
  addSampleWorldbuilding,
};
