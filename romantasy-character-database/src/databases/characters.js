/**
 * Romantasy Character Database - Characters Database
 * The core character profiles with romantasy-specific fields
 */

import { notion, richText } from '../utils/notion.js';
import {
  CHARACTER_ROLES,
  CHARACTER_ARCHETYPES,
  SPECIES,
  MAGIC_TYPES,
  POWER_LEVELS,
  CHARACTER_STATUS,
  DEVELOPMENT_STATUS,
  POV_TYPES,
  MBTI_TYPES,
  ENNEAGRAM_TYPES,
  MORAL_ALIGNMENT,
  CHARACTER_ARCS,
} from '../utils/constants.js';
import { COVER_IMAGES, ICONS } from '../utils/aesthetics.js';

/**
 * Creates the main Characters database
 */
export async function createCharactersDatabase(parentPageId) {
  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: ICONS.characters },
    cover: { type: 'external', external: { url: COVER_IMAGES.characters } },
    title: richText('Characters'),
    description: richText('Your romantasy character profiles - protagonists, love interests, villains, and supporting cast'),
    properties: {
      // ============================================
      // BASIC INFORMATION
      // ============================================
      'Name': {
        title: {},
      },
      'Aliases/Titles': {
        rich_text: {},
      },
      'Age': {
        number: { format: 'number' },
      },
      'Gender': {
        select: {
          options: [
            { name: 'Female', color: 'pink' },
            { name: 'Male', color: 'blue' },
            { name: 'Non-Binary', color: 'purple' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },

      // ============================================
      // ROLE & STORY FUNCTION
      // ============================================
      'Role': {
        select: { options: CHARACTER_ROLES },
      },
      'Archetype': {
        select: { options: CHARACTER_ARCHETYPES },
      },
      'POV Type': {
        select: { options: POV_TYPES },
      },
      'Is POV Character': {
        checkbox: {},
      },

      // ============================================
      // SPECIES & SUPERNATURAL
      // ============================================
      'Species': {
        select: { options: SPECIES },
      },
      'Magic Type': {
        multi_select: { options: MAGIC_TYPES },
      },
      'Power Level': {
        select: { options: POWER_LEVELS },
      },

      // ============================================
      // PHYSICAL APPEARANCE
      // ============================================
      'Height': {
        rich_text: {},
      },
      'Eye Color': {
        rich_text: {},
      },
      'Hair Color': {
        rich_text: {},
      },
      'Distinguishing Features': {
        rich_text: {},
      },
      'Face Claim': {
        files: {},
      },

      // ============================================
      // PSYCHOLOGY & PERSONALITY
      // ============================================
      'MBTI': {
        select: { options: MBTI_TYPES },
      },
      'Enneagram': {
        select: { options: ENNEAGRAM_TYPES },
      },
      'Moral Alignment': {
        select: { options: MORAL_ALIGNMENT },
      },

      // ============================================
      // MOTIVATIONS & INTERNAL WORLD
      // ============================================
      'Core Motivation': {
        rich_text: {},
      },
      'Greatest Fear': {
        rich_text: {},
      },
      'Fatal Flaw': {
        rich_text: {},
      },
      'Greatest Strength': {
        rich_text: {},
      },
      'Secret/Hidden Truth': {
        rich_text: {},
      },

      // ============================================
      // CHARACTER ARC (Lie to Truth)
      // ============================================
      'Arc Type': {
        select: { options: CHARACTER_ARCS },
      },
      'The Lie They Believe': {
        rich_text: {},
      },
      'The Truth They Learn': {
        rich_text: {},
      },
      'Arc Summary': {
        rich_text: {},
      },

      // ============================================
      // ROMANCE-SPECIFIC FIELDS
      // ============================================
      'Views on Love': {
        rich_text: {},
      },
      'Romantic Baggage': {
        rich_text: {},
      },
      'Love Language': {
        multi_select: {
          options: [
            { name: 'Words of Affirmation', color: 'pink' },
            { name: 'Acts of Service', color: 'green' },
            { name: 'Receiving Gifts', color: 'purple' },
            { name: 'Quality Time', color: 'blue' },
            { name: 'Physical Touch', color: 'red' },
          ],
        },
      },

      // ============================================
      // STATUS & TRACKING
      // ============================================
      'Status': {
        select: { options: CHARACTER_STATUS },
      },
      'Development': {
        select: { options: DEVELOPMENT_STATUS },
      },

      // ============================================
      // ORGANIZATION
      // ============================================
      'Faction/Group': {
        rich_text: {},
      },
      'Location': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  return response.id;
}

/**
 * Adds the self-referential "Love Interest Of" relation
 * Must be called after database creation
 */
export async function addLoveInterestRelation(databaseId) {
  await notion.databases.update({
    database_id: databaseId,
    properties: {
      'Love Interest Of': {
        relation: {
          database_id: databaseId,
          single_property: {},
        },
      },
    },
  });
}

/**
 * Adds sample characters to demonstrate the database
 */
export async function addSampleCharacters(databaseId) {
  // Sample FMC - Empowered Heroine
  const fmc = await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '⚔️' },
    cover: { type: 'external', external: { url: COVER_IMAGES.sampleFMC } },
    properties: {
      'Name': { title: richText('Seraphina Ashford') },
      'Aliases/Titles': { rich_text: richText('The Shadow Blade, Sera') },
      'Age': { number: 24 },
      'Gender': { select: { name: 'Female' } },
      'Role': { select: { name: 'Protagonist (FMC)' } },
      'Archetype': { select: { name: 'Assassin with a Heart' } },
      'POV Type': { select: { name: 'Primary POV' } },
      'Is POV Character': { checkbox: true },
      'Species': { select: { name: 'Half-Blood' } },
      'Magic Type': { multi_select: [{ name: 'Shadow/Darkness' }, { name: 'Warding/Protection' }] },
      'Power Level': { select: { name: 'Skilled' } },
      'Height': { rich_text: richText('5\'7"') },
      'Eye Color': { rich_text: richText('Silver with violet flecks when using magic') },
      'Hair Color': { rich_text: richText('Raven black with a single white streak') },
      'Distinguishing Features': { rich_text: richText('Scar across her left palm from a blood oath; moves with predatory grace') },
      'MBTI': { select: { name: 'INTJ - Architect' } },
      'Enneagram': { select: { name: 'Type 8 - The Challenger' } },
      'Moral Alignment': { select: { name: 'Chaotic Good' } },
      'Core Motivation': { rich_text: richText('To protect the innocent from the corrupt court that destroyed her family') },
      'Greatest Fear': { rich_text: richText('Becoming the monster others believe her to be') },
      'Fatal Flaw': { rich_text: richText('Refuses to trust anyone, believes she must carry every burden alone') },
      'Greatest Strength': { rich_text: richText('Unwavering loyalty once earned; tactical brilliance') },
      'Secret/Hidden Truth': { rich_text: richText('She is the last heir to the throne she\'s trying to destroy') },
      'Arc Type': { select: { name: 'Learning to Trust' } },
      'The Lie They Believe': { rich_text: richText('I am unworthy of love. Anyone who gets close to me will be destroyed.') },
      'The Truth They Learn': { rich_text: richText('Vulnerability is not weakness. True strength comes from letting others in.') },
      'Views on Love': { rich_text: richText('Believes love is a liability, a weapon enemies can use against you') },
      'Romantic Baggage': { rich_text: richText('Watched her first love betray her family; has never allowed herself to feel since') },
      'Love Language': { multi_select: [{ name: 'Acts of Service' }, { name: 'Physical Touch' }] },
      'Status': { select: { name: 'Alive' } },
      'Development': { select: { name: 'Complete' } },
      'Faction/Group': { rich_text: richText('The Obsidian Court (reluctant alliance)') },
      'Location': { rich_text: richText('Currently: The Shadow Keep') },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText('This is a sample character to demonstrate the template. Feel free to edit or delete!'),
          icon: { type: 'emoji', emoji: '💡' },
          color: 'purple_background',
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Backstory') },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText('Born to a human mother and Fae father, Seraphina was raised in the borderlands between courts. When the Obsidian Court massacred her village to claim her father\'s bloodline magic, she escaped into the mortal realm. She spent ten years training as an assassin, planning her revenge...'),
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Voice & Mannerisms') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Speaks in clipped, precise sentences when guarded') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Has a dry, cutting sense of humor that emerges when comfortable') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Unconsciously touches the scar on her palm when anxious') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Never turns her back to doors or windows') },
      },
    ],
  });

  // Sample MMC - Morally Gray Hero
  const mmc = await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '🗡️' },
    cover: { type: 'external', external: { url: COVER_IMAGES.sampleMMC } },
    properties: {
      'Name': { title: richText('Kaelan Nighthollow') },
      'Aliases/Titles': { rich_text: richText('The Lord of Shadows, The Betrayer Prince') },
      'Age': { number: 847 },
      'Gender': { select: { name: 'Male' } },
      'Role': { select: { name: 'Protagonist (MMC)' } },
      'Archetype': { select: { name: 'Morally Gray Hero' } },
      'POV Type': { select: { name: 'Primary POV' } },
      'Is POV Character': { checkbox: true },
      'Species': { select: { name: 'High Fae' } },
      'Magic Type': { multi_select: [{ name: 'Shadow/Darkness' }, { name: 'Mind Reading/Telepathy' }] },
      'Power Level': { select: { name: 'Master' } },
      'Height': { rich_text: richText('6\'4"') },
      'Eye Color': { rich_text: richText('Obsidian black that swirl with shadows when emotional') },
      'Hair Color': { rich_text: richText('Silver-white, worn long') },
      'Distinguishing Features': { rich_text: richText('Elegant features that seem carved from marble; shadows literally move around him; pointed Fae ears') },
      'MBTI': { select: { name: 'INTJ - Architect' } },
      'Enneagram': { select: { name: 'Type 5 - The Investigator' } },
      'Moral Alignment': { select: { name: 'Morally Gray' } },
      'Core Motivation': { rich_text: richText('To protect his court from annihilation, no matter the personal cost') },
      'Greatest Fear': { rich_text: richText('That he has become the very monster his enemies claim he is') },
      'Fatal Flaw': { rich_text: richText('Will sacrifice anything—including his own soul—to protect those he loves') },
      'Greatest Strength': { rich_text: richText('Strategic genius; willing to make the hard choices others cannot') },
      'Secret/Hidden Truth': { rich_text: richText('He has been secretly protecting the human realm from Fae incursion for centuries, against his own people') },
      'Arc Type': { select: { name: 'Redemption Arc' } },
      'The Lie They Believe': { rich_text: richText('I am already damned. There is no redemption for what I have done.') },
      'The Truth They Learn': { rich_text: richText('The monster is not what I have done, but what I would become without her light.') },
      'Views on Love': { rich_text: richText('Believes himself incapable of love after centuries of manipulation and court games; terrified of its power') },
      'Romantic Baggage': { rich_text: richText('His first love was murdered by his own brother; he has never allowed himself to feel deeply since') },
      'Love Language': { multi_select: [{ name: 'Acts of Service' }, { name: 'Words of Affirmation' }] },
      'Status': { select: { name: 'Alive' } },
      'Development': { select: { name: 'Complete' } },
      'Faction/Group': { rich_text: richText('Lord of the Obsidian Court') },
      'Location': { rich_text: richText('The Shadow Keep') },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText('This is a sample character to demonstrate the template. Feel free to edit or delete!'),
          icon: { type: 'emoji', emoji: '💡' },
          color: 'purple_background',
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Backstory') },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText('The second son of the Obsidian throne, Kaelan was never meant to rule. When his brother\'s paranoia led to the murder of everyone Kaelan loved, he was forced to take the throne through violence. Eight centuries of leading his court through endless wars has left him cold, calculating, and utterly alone...'),
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Voice & Mannerisms') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Speaks with cold, formal precision in public; voice softens only in private') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Uses silence as a weapon; can make anyone uncomfortable with a single look') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Shadows unconsciously respond to his emotions—flaring when angry, coiling protectively when worried') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Has a devastatingly dry wit that emerges unexpectedly') },
      },
    ],
  });

  // Sample Side Character
  const side = await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '🛡️' },
    cover: { type: 'external', external: { url: COVER_IMAGES.sampleSide } },
    properties: {
      'Name': { title: richText('Thalia Sunfire') },
      'Aliases/Titles': { rich_text: richText('Captain of the Ember Guard') },
      'Age': { number: 312 },
      'Gender': { select: { name: 'Female' } },
      'Role': { select: { name: 'Found Family' } },
      'Archetype': { select: { name: 'Fierce Warrior' } },
      'POV Type': { select: { name: 'Never POV' } },
      'Is POV Character': { checkbox: false },
      'Species': { select: { name: 'Fae (Seelie)' } },
      'Magic Type': { multi_select: [{ name: 'Elemental - Fire' }] },
      'Power Level': { select: { name: 'Expert' } },
      'MBTI': { select: { name: 'ESFP - Entertainer' } },
      'Enneagram': { select: { name: 'Type 7 - The Enthusiast' } },
      'Moral Alignment': { select: { name: 'Chaotic Good' } },
      'Core Motivation': { rich_text: richText('To find joy in every battle and protect those who cannot protect themselves') },
      'Greatest Fear': { rich_text: richText('Being alone; losing her found family') },
      'Arc Type': { select: { name: 'Flat/Testing Arc' } },
      'Status': { select: { name: 'Alive' } },
      'Development': { select: { name: 'Drafted' } },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText('A sample side character showing how to use this template for supporting cast.'),
          icon: { type: 'emoji', emoji: '💡' },
          color: 'purple_background',
        },
      },
    ],
  });

  return { fmcId: fmc.id, mmcId: mmc.id, sideId: side.id };
}
