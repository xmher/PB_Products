/**
 * Romantasy Character Database - Relationships Database
 * Track romantic and non-romantic relationships between characters
 * with chemistry scores, tension levels, and romance arc progression
 */

import { notion, richText } from '../utils/notion.js';
import {
  RELATIONSHIP_TYPES,
  RELATIONSHIP_DYNAMICS,
  ROMANCE_STAGES,
  TENSION_LEVELS,
  CHEMISTRY_SCORES,
  MACRO_TROPES,
} from '../utils/constants.js';
import { COVER_IMAGES, ICONS } from '../utils/aesthetics.js';

/**
 * Creates the Relationships database
 */
export async function createRelationshipsDatabase(parentPageId, charactersDbId) {
  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: ICONS.relationships },
    cover: { type: 'external', external: { url: COVER_IMAGES.relationships } },
    title: richText('Relationships'),
    description: richText('Track the dynamics between your characters - romantic tension, chemistry, and relationship evolution'),
    properties: {
      // ============================================
      // RELATIONSHIP IDENTIFICATION
      // ============================================
      'Relationship': {
        title: {},
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

      // ============================================
      // RELATIONSHIP TYPE & DYNAMIC
      // ============================================
      'Type': {
        select: { options: RELATIONSHIP_TYPES },
      },
      'Dynamic': {
        select: { options: RELATIONSHIP_DYNAMICS },
      },
      'Is Main Romance': {
        checkbox: {},
      },

      // ============================================
      // ROMANCE TRACKING
      // ============================================
      'Romance Stage': {
        select: { options: ROMANCE_STAGES },
      },
      'Tension Level': {
        select: { options: TENSION_LEVELS },
      },
      'Chemistry Score': {
        select: { options: CHEMISTRY_SCORES },
      },
      'Tropes': {
        multi_select: { options: MACRO_TROPES },
      },

      // ============================================
      // RELATIONSHIP DETAILS
      // ============================================
      'How They Met': {
        rich_text: {},
      },
      'Initial Impression': {
        rich_text: {},
      },
      'Source of Conflict': {
        rich_text: {},
      },
      'What Draws Them Together': {
        rich_text: {},
      },
      'Obstacles': {
        rich_text: {},
      },

      // ============================================
      // KEY MOMENTS
      // ============================================
      'First Meeting Scene': {
        rich_text: {},
      },
      'First Kiss/Touch': {
        rich_text: {},
      },
      'Black Moment': {
        rich_text: {},
      },
      'Resolution': {
        rich_text: {},
      },

      // ============================================
      // NOTES
      // ============================================
      'Relationship Arc Summary': {
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
 * Adds sample relationships
 */
export async function addSampleRelationships(databaseId, fmcId, mmcId, sideId) {
  // Main Romance
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '💕' },
    properties: {
      'Relationship': { title: richText('Seraphina & Kaelan') },
      'Character 1': { relation: [{ id: fmcId }] },
      'Character 2': { relation: [{ id: mmcId }] },
      'Type': { select: { name: 'Romantic Interest' } },
      'Dynamic': { select: { name: 'Rivals' } },
      'Is Main Romance': { checkbox: true },
      'Romance Stage': { select: { name: 'Antagonism/Denial' } },
      'Tension Level': { select: { name: '5 - Ready to Combust' } },
      'Chemistry Score': { select: { name: '5 - Inferno' } },
      'Tropes': { multi_select: [{ name: 'Enemies to Lovers' }, { name: 'Forced Proximity' }, { name: 'Forbidden Love' }] },
      'How They Met': { rich_text: richText('She broke into his court to assassinate him. He caught her—and offered her a bargain instead of death.') },
      'Initial Impression': { rich_text: richText('She sees a monster. He sees a weapon—and something familiar in her shadows.') },
      'Source of Conflict': { rich_text: richText('She wants to destroy his court. He needs her power to save it. Neither trusts the other—both are hiding who they really are.') },
      'What Draws Them Together': { rich_text: richText('They are two souls forged in darkness, both believing themselves unworthy of love. They see in each other the truth others cannot—the protector hiding beneath the monster.') },
      'Obstacles': { rich_text: richText('Her mission to destroy everything he protects. His refusal to be honest about his true motives. The blood oath that binds them both to forces beyond their control.') },
      'Relationship Arc Summary': { rich_text: richText('From enemies bound by a blood bargain, through reluctant alliance, to an all-consuming love that threatens to destroy or save them both.') },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText('This is a sample relationship showing how to track your main romance. Edit or delete to create your own!'),
          icon: { type: 'emoji', emoji: '💡' },
          color: 'pink_background',
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Key Romantic Beats') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('First Meeting: Assassination attempt / The Bargain') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('First Touch: He catches her blade with his bare hand, shadows tangling with hers') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('First Kiss: After she saves his life against her mission, in the moonlight of the war room') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Black Moment: She discovers her true identity—and that he knew all along') },
      },
    ],
  });

  // Friendship/Found Family relationship
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '🤝' },
    properties: {
      'Relationship': { title: richText('Seraphina & Thalia') },
      'Character 1': { relation: [{ id: fmcId }] },
      'Character 2': { relation: [{ id: sideId }] },
      'Type': { select: { name: 'Found Family' } },
      'Dynamic': { select: { name: 'Equals/Partners' } },
      'Is Main Romance': { checkbox: false },
      'How They Met': { rich_text: richText('Thalia was assigned as Sera\'s "guard" (jailer). She won Sera over with relentless cheerfulness and deadly training sessions.') },
      'What Draws Them Together': { rich_text: richText('Thalia sees past Sera\'s walls and refuses to let her push her away. She becomes the sister Sera never had.') },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText('Use this database for ALL important relationships—not just romantic ones. Found family, rivalries, and friendships are equally important to track!'),
          icon: { type: 'emoji', emoji: '💡' },
          color: 'green_background',
        },
      },
    ],
  });
}
