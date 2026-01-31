/**
 * Romantasy Character Database - Dashboard Page
 * Creates the main dashboard with links to all databases
 */

import { notion, richText } from '../utils/notion.js';
import {
  COVER_IMAGES,
  ICONS,
  DIVIDERS,
  QUOTES,
  createDivider,
  createCallout,
} from '../utils/aesthetics.js';

/**
 * Creates the main dashboard page
 */
export async function createDashboard(parentPageId) {
  const response = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: ICONS.dashboard },
    cover: { type: 'external', external: { url: COVER_IMAGES.dashboard } },
    properties: {
      title: richText('Romantasy Character Database'),
    },
    children: [
      // Hero Section
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: DIVIDERS.stars },
            annotations: { color: 'gray' },
          }],
        },
      },
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{
            type: 'text',
            text: { content: 'Welcome to Your Character Database' },
          }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{
            type: 'text',
            text: { content: QUOTES.characters },
            annotations: { italic: true, color: 'gray' },
          }],
        },
      },
      createDivider(),

      // Introduction Callout
      createCallout(
        'This template is designed specifically for Romantasy authors. Track your characters, map their relationships, manage romantic tension, and never lose track of your tropes or spice levels.',
        '🏰',
        'purple_background'
      ),
      createDivider(),

      // Quick Start Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Quick Start Guide') },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: 'Characters' },
            annotations: { bold: true },
          }, {
            type: 'text',
            text: { content: ' - Start here! Create your FMC and MMC with detailed profiles' },
          }],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: 'Relationships' },
            annotations: { bold: true },
          }, {
            type: 'text',
            text: { content: ' - Map the connections between characters, especially your main romance' },
          }],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: 'Trope Library' },
            annotations: { bold: true },
          }, {
            type: 'text',
            text: { content: ' - Browse and tag your favorite tropes to characters and scenes' },
          }],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: 'Spice Scenes' },
            annotations: { bold: true },
          }, {
            type: 'text',
            text: { content: ' - Plan your romantic and intimate scenes with heat level tracking' },
          }],
        },
      },
      createDivider(),

      // Tips Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Pro Tips') },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{
            type: 'text',
            text: { content: 'Using Face Claims Effectively' },
            annotations: { bold: true },
          }],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: richText('Upload images to the "Face Claim" property in your character profiles. Use Gallery view to see your entire cast visually. Pinterest and Unsplash are great sources for aesthetic images.'),
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{
            type: 'text',
            text: { content: 'Tracking Dual POV' },
            annotations: { bold: true },
          }],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: richText('Mark your POV characters with the "Is POV Character" checkbox. Use "POV Type" to distinguish between primary and secondary POVs. Filter the Characters database to see only POV characters when planning scenes.'),
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{
            type: 'text',
            text: { content: 'The Lie/Truth Character Arc' },
            annotations: { bold: true },
          }],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: richText('Every compelling character believes a LIE about themselves or the world at the start. Through the story, they learn the TRUTH. Fill in "The Lie They Believe" and "The Truth They Learn" for your main characters to track their internal journey.'),
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{
            type: 'text',
            text: { content: 'Pacing Your Spice Levels' },
            annotations: { bold: true },
          }],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: richText('Use the Spice Scenes database to ensure your intimate moments are paced well throughout the story. Sort by "Scene Order" to see the progression. The "Tension Before/After" fields help you track emotional escalation.'),
              },
            },
          ],
        },
      },
      createDivider(),

      // Database Links Placeholder
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Your Databases') },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText('Your databases have been created below. Click any database to open it, or use the links in the sidebar.'),
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: DIVIDERS.roses },
            annotations: { color: 'gray' },
          }],
        },
      },
    ],
  });

  return response.id;
}

/**
 * Creates a "Getting Started" page with detailed instructions
 */
export async function createGettingStartedPage(parentPageId) {
  const response = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📖' },
    properties: {
      title: richText('Getting Started'),
    },
    children: [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: richText('Getting Started with Your Romantasy Character Database') },
      },
      createDivider(),

      // Step 1
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Step 1: Create Your Protagonists') },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText('Start by creating your FMC (Female Main Character) and MMC (Male Main Character). Focus on:'),
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Basic info: Name, age, species') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('The Lie They Believe - What false belief drives them?') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Their views on love and romantic baggage') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Mark them as "Is POV Character" if they have chapters from their perspective') },
      },
      createDivider(),

      // Step 2
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Step 2: Map Your Main Romance') },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText('In the Relationships database, create an entry for your main couple:'),
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Link both characters') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Mark "Is Main Romance" as checked') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Select your tropes (Enemies to Lovers, Fated Mates, etc.)') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Define the source of conflict and what draws them together') },
      },
      createDivider(),

      // Step 3
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Step 3: Plan Your Key Scenes') },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText('Use the Spice & Romance Scenes database to plan pivotal moments:'),
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('First Meeting - How do they initially encounter each other?') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('First Kiss - What circumstances lead to this moment?') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Black Moment - The lowest point where all seems lost') },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText('Resolution - How do they find their HEA?') },
      },
      createDivider(),

      // Tips
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Pro Tips for Romantasy Writers') },
      },
      createCallout(
        'The "Lie/Truth" framework is essential for Romantasy. Your FMC and MMC should each have their own lie they believe AND a shared "Romance Truth" they discover together.',
        '✨',
        'purple_background'
      ),
      createCallout(
        'Track your Chemistry and Tension scores in the Relationships database. These should generally increase throughout Act 1 and 2, peak before the Black Moment, then resolve high in the finale.',
        '🔥',
        'red_background'
      ),
      createCallout(
        'Use the Trope Library to tag your characters and relationships. This helps ensure you\'re hitting the beats readers expect while putting your unique spin on beloved tropes.',
        '📚',
        'blue_background'
      ),
    ],
  });

  return response.id;
}
