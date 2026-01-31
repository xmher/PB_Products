/**
 * Romantasy Character Database - Spice Scenes Database
 * Track intimate and romantic scenes with heat levels and emotional context
 */

import { notion, richText } from '../utils/notion.js';
import {
  SPICE_LEVELS,
  INTIMACY_TYPES,
  TENSION_LEVELS,
  SCENE_TYPES,
} from '../utils/constants.js';
import { COVER_IMAGES, ICONS } from '../utils/aesthetics.js';

/**
 * Creates the Spice Scenes database
 */
export async function createScenesDatabase(parentPageId, charactersDbId, relationshipsDbId) {
  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: ICONS.spice },
    cover: { type: 'external', external: { url: COVER_IMAGES.spice } },
    title: richText('Spice & Romance Scenes'),
    description: richText('Track your romantic and intimate scenes - heat levels, emotional beats, and key moments'),
    properties: {
      // ============================================
      // SCENE IDENTIFICATION
      // ============================================
      'Scene': {
        title: {},
      },
      'Chapter/Section': {
        rich_text: {},
      },
      'Scene Order': {
        number: { format: 'number' },
      },

      // ============================================
      // CHARACTERS INVOLVED
      // ============================================
      'Characters': {
        relation: {
          database_id: charactersDbId,
          single_property: {},
        },
      },
      'Relationship': {
        relation: {
          database_id: relationshipsDbId,
          single_property: {},
        },
      },

      // ============================================
      // SCENE TYPE & HEAT
      // ============================================
      'Scene Type': {
        select: { options: SCENE_TYPES },
      },
      'Intimacy Type': {
        select: { options: INTIMACY_TYPES },
      },
      'Spice Level': {
        select: { options: SPICE_LEVELS },
      },
      'Tension Before': {
        select: { options: TENSION_LEVELS },
      },
      'Tension After': {
        select: { options: TENSION_LEVELS },
      },

      // ============================================
      // EMOTIONAL CONTEXT
      // ============================================
      'Emotional Stakes': {
        rich_text: {},
      },
      'What Changes': {
        rich_text: {},
      },
      'POV Character': {
        rich_text: {},
      },
      'Mood/Tone': {
        multi_select: {
          options: [
            { name: 'Tender', color: 'pink' },
            { name: 'Desperate', color: 'red' },
            { name: 'Playful', color: 'yellow' },
            { name: 'Angry/Passionate', color: 'orange' },
            { name: 'Healing', color: 'green' },
            { name: 'Bittersweet', color: 'purple' },
            { name: 'First Time', color: 'blue' },
            { name: 'Reunion', color: 'pink' },
            { name: 'Goodbye', color: 'gray' },
            { name: 'Forbidden', color: 'red' },
            { name: 'Claiming', color: 'purple' },
            { name: 'Comfort', color: 'green' },
          ],
        },
      },

      // ============================================
      // SCENE ELEMENTS
      // ============================================
      'Location': {
        rich_text: {},
      },
      'Time of Day': {
        select: {
          options: [
            { name: 'Dawn', color: 'yellow' },
            { name: 'Morning', color: 'yellow' },
            { name: 'Afternoon', color: 'orange' },
            { name: 'Evening', color: 'purple' },
            { name: 'Night', color: 'blue' },
            { name: 'Midnight', color: 'gray' },
          ],
        },
      },
      'Triggers/Catalyst': {
        rich_text: {},
      },
      'Interruptions': {
        rich_text: {},
      },

      // ============================================
      // WRITING NOTES
      // ============================================
      'Key Lines/Dialogue': {
        rich_text: {},
      },
      'Sensory Details': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },

      // ============================================
      // STATUS
      // ============================================
      'Status': {
        select: {
          options: [
            { name: 'Planned', color: 'gray' },
            { name: 'Outlined', color: 'blue' },
            { name: 'Drafted', color: 'yellow' },
            { name: 'Revised', color: 'orange' },
            { name: 'Complete', color: 'green' },
          ],
        },
      },
    },
  });

  return response.id;
}

/**
 * Adds sample scenes
 */
export async function addSampleScenes(databaseId, fmcId, mmcId, relationshipId) {
  // First Meeting
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '⚔️' },
    properties: {
      'Scene': { title: richText('The Assassination Attempt') },
      'Chapter/Section': { rich_text: richText('Chapter 1') },
      'Scene Order': { number: 1 },
      'Characters': { relation: [{ id: fmcId }, { id: mmcId }] },
      'Scene Type': { select: { name: 'First Meeting' } },
      'Intimacy Type': { select: { name: 'First Touch/Contact' } },
      'Spice Level': { select: { name: '0 - Clean/Sweet' } },
      'Tension Before': { select: { name: '1 - Subtle Awareness' } },
      'Tension After': { select: { name: '4 - Crackling Tension' } },
      'Emotional Stakes': { rich_text: richText('Sera\'s entire revenge plan depends on this moment. Kaelan\'s survival instincts war with his curiosity about this shadow-wielding assassin.') },
      'What Changes': { rich_text: richText('Instead of death, a bargain is struck. Both realize the other is not what they expected.') },
      'POV Character': { rich_text: richText('Seraphina') },
      'Mood/Tone': { multi_select: [{ name: 'Desperate' }, { name: 'Angry/Passionate' }] },
      'Location': { rich_text: richText('The Shadow Keep - Lord\'s chambers') },
      'Time of Day': { select: { name: 'Midnight' } },
      'Triggers/Catalyst': { rich_text: richText('Sera has infiltrated the keep after months of planning') },
      'Key Lines/Dialogue': { rich_text: richText('"You fight like someone who has nothing to lose," he murmured, shadows coiling around them both. "How refreshing."') },
      'Status': { select: { name: 'Complete' } },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText('Track ALL your romantic scenes here - from first meeting to HEA. The Spice Level helps you pace intimacy throughout your story.'),
          icon: { type: 'emoji', emoji: '💡' },
          color: 'red_background',
        },
      },
    ],
  });

  // First Kiss
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '💋' },
    properties: {
      'Scene': { title: richText('War Room Confession') },
      'Chapter/Section': { rich_text: richText('Chapter 15') },
      'Scene Order': { number: 2 },
      'Characters': { relation: [{ id: fmcId }, { id: mmcId }] },
      'Scene Type': { select: { name: 'Confession' } },
      'Intimacy Type': { select: { name: 'First Kiss' } },
      'Spice Level': { select: { name: '2 - Fade to Black' } },
      'Tension Before': { select: { name: '6 - Explosive' } },
      'Tension After': { select: { name: '4 - Crackling Tension' } },
      'Emotional Stakes': { rich_text: richText('She just saved his life against everything she\'s been working toward. He can no longer deny what she means to him.') },
      'What Changes': { rich_text: richText('The walls between them shatter. They can\'t pretend this is just a bargain anymore.') },
      'POV Character': { rich_text: richText('Kaelan') },
      'Mood/Tone': { multi_select: [{ name: 'Desperate' }, { name: 'Tender' }, { name: 'Forbidden' }] },
      'Location': { rich_text: richText('War room, moonlight through the windows') },
      'Time of Day': { select: { name: 'Night' } },
      'Triggers/Catalyst': { rich_text: richText('She took a blade meant for him. He demands to know why.') },
      'Key Lines/Dialogue': { rich_text: richText('"Why?" His voice cracked on the word. "You could have had everything you wanted. He would have killed me." / "I know." Her hand trembled against his chest. "I know."') },
      'Status': { select: { name: 'Outlined' } },
    },
  });

  // Black Moment
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '💔' },
    properties: {
      'Scene': { title: richText('The Truth Revealed') },
      'Chapter/Section': { rich_text: richText('Chapter 22') },
      'Scene Order': { number: 3 },
      'Characters': { relation: [{ id: fmcId }, { id: mmcId }] },
      'Scene Type': { select: { name: 'Break Up/Separation' } },
      'Intimacy Type': { select: { name: 'Emotional Vulnerability' } },
      'Spice Level': { select: { name: '0 - Clean/Sweet' } },
      'Tension Before': { select: { name: '3 - Undeniable Attraction' } },
      'Tension After': { select: { name: '1 - Subtle Awareness' } },
      'Emotional Stakes': { rich_text: richText('Everything they\'ve built shatters. She learns her true identity—and that he knew all along.') },
      'What Changes': { rich_text: richText('Trust is broken. She flees. He lets her go, believing she deserves better than the monster he\'s become.') },
      'POV Character': { rich_text: richText('Seraphina') },
      'Mood/Tone': { multi_select: [{ name: 'Bittersweet' }, { name: 'Goodbye' }] },
      'Location': { rich_text: richText('The throne room') },
      'Time of Day': { select: { name: 'Dawn' } },
      'Triggers/Catalyst': { rich_text: richText('His brother arrives with proof of who she really is') },
      'Emotional Stakes': { rich_text: richText('This is the "all is lost" moment - maximum pain before the resolution') },
      'Status': { select: { name: 'Planned' } },
    },
  });
}
