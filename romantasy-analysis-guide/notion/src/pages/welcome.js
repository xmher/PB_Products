import notion from '../utils/notionClient.js';

/**
 * Creates the welcome page content with guide overview and instructions
 */
export async function createWelcomeContent(pageId) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      // Header callout
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Transform how you read. Extract craft lessons, track story structure, and understand the techniques that make romantasy novels work.',
              },
            },
          ],
          icon: { type: 'emoji', emoji: '📚' },
          color: 'purple_background',
        },
      },
      // Divider
      { object: 'block', type: 'divider', divider: {} },
      // How to Use section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'How to Use This Template' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This template helps you read like a writer—analyzing books in your genre to understand ',
              },
            },
            {
              type: 'text',
              text: { content: 'why' },
              annotations: { italic: true },
            },
            {
              type: 'text',
              text: {
                content: ' they work, not just whether you enjoyed them.',
              },
            },
          ],
        },
      },
      // Quick Start toggle
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Quick Start Guide' },
              annotations: { bold: true },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Add a new book' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: ' to the Book Analysis Library before you start reading' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Fill out Pre-Read' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: ' expectations and learning goals' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Log chapters' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: ' as you read (2-3 min each)' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Track beats' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: ' when you encounter them (Romance + Fantasy)' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Capture craft moves' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: ' whenever you read something brilliant' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'numbered_list_item',
              numbered_list_item: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Complete synthesis' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: ' within 24 hours of finishing' },
                  },
                ],
              },
            },
          ],
        },
      },
      // Choose Your Path toggle
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Choose Your Analysis Path' },
              annotations: { bold: true },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Quick-Fill Path (~2-3 min/chapter + 20 min post-read)' },
                    annotations: { bold: true },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: 'Chapter logs with tension ratings only' } }],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: 'Quick synthesis and 3-5 craft moves' } }],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Deep-Dive Path (~5-10 min/chapter + 60-90 min post-read)' },
                    annotations: { bold: true },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: 'Full beat tracking (Romance + Fantasy)' } }],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: 'Trope analysis, spice tracking, character deep dives' } }],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: 'Complete synthesis with scene dissections' } }],
              },
            },
          ],
        },
      },
      // Divider
      { object: 'block', type: 'divider', divider: {} },
      // Databases Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Your Analysis Databases' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'All databases are linked to the Book Analysis Library. When you create entries, always link them to the book you\'re analyzing.',
              },
            },
          ],
        },
      },
      // Key Terms toggle
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Key Terms Glossary' },
              annotations: { bold: true },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'Adhesion: ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'The external force preventing characters from separating (forced proximity, quest, magical bond)' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'Ghost/Wound: ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Past trauma shaping character\'s behavior and beliefs about love/world' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'The Lie: ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'False belief the character holds that must be overcome for growth' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'Slow Burn: ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Extended romantic tension with delayed gratification—a pacing strategy, not just duration' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'Deep POV: ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Narrative style deeply immersed in character\'s psyche—no emotional distance' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'HEA/HFN: ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Happily Ever After / Happy For Now—required romance resolution types' } },
                ],
              },
            },
          ],
        },
      },
      // Beat Sheets toggle
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Beat Sheet Quick Reference' },
              annotations: { bold: true },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'Romancing the Beat (Gwen Hayes)' }, annotations: { bold: true, underline: true } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Phase 1 (0-25%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Meet Cute/Ugly → "No Way" → Adhesion' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Phase 2 (25-50%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Inkling → Deepening → Midpoint Intimacy' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Phase 3 (50-75%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Shields Up → Retreat → Break Up' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Phase 4 (75-100%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Dark Night → Grand Gesture → HEA/HFN' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: 'Save the Cat! (Blake Snyder)' }, annotations: { bold: true, underline: true } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Act 1 (0-25%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Opening → Setup → Catalyst → Debate → Break Into Two' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Act 2A (25-50%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'B Story → Fun & Games → Midpoint' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Act 2B (50-75%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Bad Guys Close In → All Is Lost → Dark Night' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Act 3 (75-100%): ' }, annotations: { bold: true } },
                  { type: 'text', text: { content: 'Break Into Three → Finale → Final Image' } },
                ],
              },
            },
          ],
        },
      },
      // Color Coding toggle
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Color-Coding System (for physical reading)' },
              annotations: { bold: true },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Pink/Red: ' }, annotations: { bold: true, color: 'red' } },
                  { type: 'text', text: { content: 'Romance Beats — tension, kisses, declarations' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Blue: ' }, annotations: { bold: true, color: 'blue' } },
                  { type: 'text', text: { content: 'Fantasy/Plot Beats — quest progress, magic, external conflict' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Green: ' }, annotations: { bold: true, color: 'green' } },
                  { type: 'text', text: { content: 'World-Building — lore, setting, magic system rules' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Yellow: ' }, annotations: { bold: true, color: 'yellow' } },
                  { type: 'text', text: { content: 'Character Backstory — wounds, ghosts, motivations' } },
                ],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  { type: 'text', text: { content: 'Purple: ' }, annotations: { bold: true, color: 'purple' } },
                  { type: 'text', text: { content: 'Craft Moves to Steal — exceptional techniques' } },
                ],
              },
            },
          ],
        },
      },
    ],
  });

  console.log('Added welcome page content');
}

export default { createWelcomeContent };
