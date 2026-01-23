import notion from '../utils/notionClient.js';
import { CHARACTER_ROLES, CHARACTER_ARCS, MAGIC_TYPES } from '../utils/constants.js';

/**
 * Creates the Characters database
 * Comprehensive character profiles with romantasy-specific fields
 */
export async function createCharactersDatabase(parentPageId, manuscriptsDbId) {
  const database = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '👤' },
    title: [{ type: 'text', text: { content: 'Characters' } }],
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
      'Role': {
        select: {
          options: CHARACTER_ROLES,
        },
      },
      'Arc Type': {
        select: {
          options: CHARACTER_ARCS,
        },
      },
      'Age': {
        number: {
          format: 'number',
        },
      },
      'Pronouns': {
        select: {
          options: [
            { name: 'She/Her', color: 'pink' },
            { name: 'He/Him', color: 'blue' },
            { name: 'They/Them', color: 'purple' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Species/Race': {
        select: {
          options: [
            { name: 'Human', color: 'default' },
            { name: 'Fae', color: 'purple' },
            { name: 'Vampire', color: 'red' },
            { name: 'Shifter', color: 'orange' },
            { name: 'Witch/Warlock', color: 'green' },
            { name: 'Demon', color: 'gray' },
            { name: 'Angel', color: 'yellow' },
            { name: 'Elf', color: 'blue' },
            { name: 'Dragon', color: 'red' },
            { name: 'Half-Blood', color: 'pink' },
          ],
        },
      },
      'Magic/Power': {
        multi_select: {
          options: MAGIC_TYPES,
        },
      },
      'Physical Description': {
        rich_text: {},
      },
      'Personality': {
        rich_text: {},
      },
      'Motivation': {
        rich_text: {},
      },
      'Fatal Flaw': {
        rich_text: {},
      },
      'Secret/Lie': {
        rich_text: {},
      },
      'Backstory': {
        rich_text: {},
      },
      'Voice Notes': {
        rich_text: {},
      },
      'Reference Image': {
        files: {},
      },
      'POV Character': {
        checkbox: {},
      },
      'Love Interest Of': {
        relation: {
          database_id: 'self',
          single_property: {},
        },
      },
    },
  });

  console.log('Created Characters database:', database.id);
  return database;
}

/**
 * Adds sample character entry with romantasy-specific details
 */
export async function addSampleCharacters(databaseId, manuscriptPageId) {
  const sampleCharacters = [
    {
      name: 'Sample: Sera Blackwood',
      role: 'Protagonist (FMC)',
      arcType: 'Growth',
      age: 24,
      pronouns: 'She/Her',
      species: 'Half-Blood',
      magic: ['Shadow/Dark', 'Death/Necromancy'],
      physical: 'Silver hair, violet eyes, pale skin. Multiple scars on her arms from training.',
      personality: 'Guarded, fiercely independent, sarcastic. Secretly yearns for connection but pushes people away.',
      motivation: 'To prove she belongs in both courts despite her mixed heritage.',
      flaw: 'Trust issues prevent her from accepting help, even when she desperately needs it.',
      secret: 'She can see the dead, a power she hides because it marks her as cursed.',
      pov: true,
    },
    {
      name: 'Sample: Prince Caelan Nightshade',
      role: 'Love Interest',
      arcType: 'Redemption',
      age: 127,
      pronouns: 'He/Him',
      species: 'Fae',
      magic: ['Shadow/Dark', 'Illusion'],
      physical: 'Tall, dark hair that absorbs light, eyes that shift between silver and black. Impossibly beautiful in a dangerous way.',
      personality: 'Cold and calculating on the surface. Dry wit masks deep wounds. Intensely protective of those he claims as his.',
      motivation: 'To save his dying court, even if it means sacrificing his own happiness.',
      flaw: 'Believes he is beyond redemption, so acts the monster everyone expects.',
      secret: 'He recognized Sera as his mate the moment he saw her but hid it to protect her from court politics.',
      pov: true,
    },
  ];

  for (const char of sampleCharacters) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      icon: { type: 'emoji', emoji: char.role.includes('FMC') ? '👸' : '🤴' },
      properties: {
        'Name': {
          title: [{ text: { content: char.name } }],
        },
        ...(manuscriptPageId && {
          'Manuscript': {
            relation: [{ id: manuscriptPageId }],
          },
        }),
        'Role': {
          select: { name: char.role },
        },
        'Arc Type': {
          select: { name: char.arcType },
        },
        'Age': {
          number: char.age,
        },
        'Pronouns': {
          select: { name: char.pronouns },
        },
        'Species/Race': {
          select: { name: char.species },
        },
        'Magic/Power': {
          multi_select: char.magic.map(m => ({ name: m })),
        },
        'Physical Description': {
          rich_text: [{ text: { content: char.physical } }],
        },
        'Personality': {
          rich_text: [{ text: { content: char.personality } }],
        },
        'Motivation': {
          rich_text: [{ text: { content: char.motivation } }],
        },
        'Fatal Flaw': {
          rich_text: [{ text: { content: char.flaw } }],
        },
        'Secret/Lie': {
          rich_text: [{ text: { content: char.secret } }],
        },
        'POV Character': {
          checkbox: char.pov,
        },
      },
    });
  }

  console.log('Added sample characters');
}

export default createCharactersDatabase;
