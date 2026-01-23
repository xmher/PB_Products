/**
 * Romantasy Character Database - Tropes Database
 * A library of romance and fantasy tropes for tagging and tracking
 */

import { notion, richText } from '../utils/notion.js';
import { COVER_IMAGES, ICONS } from '../utils/aesthetics.js';

/**
 * Creates the Tropes database
 */
export async function createTropesDatabase(parentPageId, charactersDbId, relationshipsDbId) {
  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: ICONS.tropes },
    cover: { type: 'external', external: { url: COVER_IMAGES.tropes } },
    title: richText('Trope Library'),
    description: richText('Your collection of romance and fantasy tropes - tag characters and relationships for BookTok-worthy moments'),
    properties: {
      // ============================================
      // TROPE IDENTIFICATION
      // ============================================
      'Trope': {
        title: {},
      },
      'Category': {
        select: {
          options: [
            { name: 'Macro Trope', color: 'purple' },
            { name: 'Micro Trope', color: 'pink' },
            { name: 'BookTok Moment', color: 'red' },
            { name: 'Fantasy Trope', color: 'blue' },
            { name: 'Character Trope', color: 'green' },
            { name: 'Setting Trope', color: 'brown' },
          ],
        },
      },

      // ============================================
      // CONNECTIONS
      // ============================================
      'Used By Characters': {
        relation: {
          database_id: charactersDbId,
          single_property: {},
        },
      },
      'Used In Relationships': {
        relation: {
          database_id: relationshipsDbId,
          single_property: {},
        },
      },

      // ============================================
      // TROPE DETAILS
      // ============================================
      'Description': {
        rich_text: {},
      },
      'Why Readers Love It': {
        rich_text: {},
      },
      'Common Pitfalls': {
        rich_text: {},
      },
      'Works Well With': {
        rich_text: {},
      },

      // ============================================
      // USAGE TRACKING
      // ============================================
      'Scene Ideas': {
        rich_text: {},
      },
      'Notes': {
        rich_text: {},
      },
      'Popularity': {
        select: {
          options: [
            { name: 'Evergreen Classic', color: 'green' },
            { name: 'Currently Trending', color: 'red' },
            { name: 'Niche Favorite', color: 'purple' },
            { name: 'Emerging', color: 'yellow' },
          ],
        },
      },
    },
  });

  return response.id;
}

/**
 * Adds sample tropes to demonstrate the database
 */
export async function addSampleTropes(databaseId) {
  // Enemies to Lovers
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '⚔️' },
    properties: {
      'Trope': { title: richText('Enemies to Lovers') },
      'Category': { select: { name: 'Macro Trope' } },
      'Description': { rich_text: richText('Characters who start as adversaries—whether through circumstance, opposing goals, or genuine hatred—gradually develop romantic feelings. The journey from conflict to love creates powerful emotional tension.') },
      'Why Readers Love It': { rich_text: richText('The tension is built-in. Every interaction crackles with potential. When the walls finally come down, the emotional payoff is immense. Readers love watching characters discover that the person they thought they hated understands them better than anyone.') },
      'Common Pitfalls': { rich_text: richText('Making the "enemy" phase too cruel or abusive. The conflict should come from circumstances or misunderstanding, not genuine malice. Readers need to root for the relationship, not fear it.') },
      'Works Well With': { rich_text: richText('Forced Proximity, Rivals, Morally Gray Hero, Touch Her and Die') },
      'Popularity': { select: { name: 'Evergreen Classic' } },
    },
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Key Beats for This Trope') },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText('Antagonistic First Meeting - Establish clear conflict') },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText('Forced Interaction - They can\'t just walk away') },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText('Grudging Respect - A glimpse beneath the surface') },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText('Vulnerability Moment - Walls crack') },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText('The Shift - Denial of growing feelings') },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText('Confession/Confrontation - Truth emerges') },
      },
    ],
  });

  // Who Did This To You
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '😤' },
    properties: {
      'Trope': { title: richText('Who Did This To You?') },
      'Category': { select: { name: 'BookTok Moment' } },
      'Description': { rich_text: richText('The moment when one character discovers the other has been hurt, and their reaction reveals the depth of their feelings. Usually involves barely contained rage and tenderness in equal measure.') },
      'Why Readers Love It': { rich_text: richText('It shows protective instincts in action. The contrast between gentle care for the injured party and murderous intent toward whoever hurt them is deeply satisfying. It\'s love expressed through action, not words.') },
      'Common Pitfalls': { rich_text: richText('Making it too over-the-top or possessive. The best versions balance protectiveness with respect for the injured character\'s autonomy.') },
      'Works Well With': { rich_text: richText('Touch Her and Die, Morally Gray Hero, Heal His Wounds, Soft Only For Her') },
      'Popularity': { select: { name: 'Currently Trending' } },
    },
  });

  // Fated Mates
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '🌙' },
    properties: {
      'Trope': { title: richText('Fated Mates / Soulmates') },
      'Category': { select: { name: 'Macro Trope' } },
      'Description': { rich_text: richText('Characters are destined to be together through supernatural means—a magical bond, prophecy, or cosmic connection. Common in paranormal and fantasy romance.') },
      'Why Readers Love It': { rich_text: richText('It removes the "will they/won\'t they" question and replaces it with "how will they navigate this?" The certainty of destiny combined with the struggle of free will creates delicious tension.') },
      'Common Pitfalls': { rich_text: richText('Removing all character agency. The best fated mate stories have characters CHOOSE each other despite or because of the bond, not simply submit to it.') },
      'Works Well With': { rich_text: richText('Rejection Trope, Enemies to Lovers, Forbidden Love, Shifter Romance') },
      'Popularity': { select: { name: 'Evergreen Classic' } },
    },
  });

  // Touch Her and Die
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '💀' },
    properties: {
      'Trope': { title: richText('Touch Her and Die') },
      'Category': { select: { name: 'BookTok Moment' } },
      'Description': { rich_text: richText('A character (usually the MMC) makes it violently clear that anyone who threatens or harms their love interest will face deadly consequences. Can be stated explicitly or demonstrated through action.') },
      'Why Readers Love It': { rich_text: richText('It\'s possessive in the best way—not controlling, but protective. The juxtaposition of a dangerous character who is soft and protective toward one specific person is incredibly appealing.') },
      'Common Pitfalls': { rich_text: richText('Crossing into toxic territory. The best versions have the FMC as capable in her own right—she doesn\'t NEED protection, which makes his protectiveness a choice, not a necessity.') },
      'Works Well With': { rich_text: richText('Morally Gray Hero, Who Did This To You, Soft Only For Her, Villain Who Loves Her') },
      'Popularity': { select: { name: 'Currently Trending' } },
    },
  });

  // Grumpy/Sunshine
  await notion.pages.create({
    parent: { database_id: databaseId },
    icon: { type: 'emoji', emoji: '☀️' },
    properties: {
      'Trope': { title: richText('Grumpy / Sunshine') },
      'Category': { select: { name: 'Macro Trope' } },
      'Description': { rich_text: richText('One character is perpetually cheerful and optimistic (sunshine), while the other is brooding, cynical, or antisocial (grumpy). Opposites attract as the sunshine gradually melts the grumpy exterior.') },
      'Why Readers Love It': { rich_text: richText('The contrast is inherently amusing and tender. Watching the grumpy character gradually soften—often against their will—while still maintaining their edge is deeply satisfying. The sunshine character often sees value in the grumpy one that others miss.') },
      'Common Pitfalls': { rich_text: richText('Making the grumpy character genuinely mean or cruel rather than guarded. The sunshine character shouldn\'t be naive or one-dimensional either.') },
      'Works Well With': { rich_text: richText('Soft Only For Her, Found Family, Forced Proximity, He Falls First') },
      'Popularity': { select: { name: 'Evergreen Classic' } },
    },
  });
}
