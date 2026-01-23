import notion from '../utils/notionClient.js';
import { COVER_IMAGES, ICONS, DIVIDERS, QUOTES } from '../utils/aesthetics.js';

/**
 * Creates the main Author Dashboard page with Dark Academia aesthetic
 */
export async function createDashboardPage(parentPageId) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: ICONS.dashboard },
    cover: {
      type: 'external',
      external: { url: COVER_IMAGES.dashboard },
    },
    properties: {
      title: [{ type: 'text', text: { content: 'Author Dashboard' } }],
    },
    children: [
      // ═══════════════════════════════════════════════════════════════
      // HEADER
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.moon },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Welcome, Storyteller' },
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: QUOTES.dashboard },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.moon },
              annotations: { color: 'gray' },
            },
          ],
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // QUICK ACTIONS - Elegant callouts
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '⚡ Quick Actions' } }],
        },
      },
      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🕯️' },
                      color: 'purple_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Log Writing Session' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: '\nTrack your words & time' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🎭' },
                      color: 'blue_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'New Scene' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: '\nAdd to your manuscript' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🪞' },
                      color: 'pink_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'New Character' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: '\nBring someone to life' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '💡' },
                      color: 'yellow_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Capture Idea' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: '\nBefore it escapes' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // ═══════════════════════════════════════════════════════════════
      // MANUSCRIPTS SECTION
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📜 Your Manuscripts' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '📚' },
          color: 'brown_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Your works-in-progress live here. Each manuscript is a world waiting to be discovered.\n\n' },
            },
            {
              type: 'text',
              text: { content: 'Tip: ' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: 'Create a Board view grouped by Status to see your pipeline at a glance.' },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: '→ ' },
              annotations: { color: 'gray' },
            },
            {
              type: 'text',
              text: { content: 'Open Manuscripts Database' },
              annotations: { bold: true },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // ═══════════════════════════════════════════════════════════════
      // STORY BIBLE SECTION
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📖 Story Bible' } }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: QUOTES.worldBuilding },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🪞' },
                      color: 'pink_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Characters\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Souls that breathe on the page. Profiles, arcs, secrets, and lies.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🔮' },
                      color: 'purple_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Magic Systems\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Rules, costs, and the price of power.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🗺️' },
                      color: 'blue_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Locations\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Kingdoms, cities, and hidden places. Make your world feel real.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '⚱️' },
                      color: 'brown_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Lore & History\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'The past shapes the present. Mythology, politics, culture.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // ═══════════════════════════════════════════════════════════════
      // ROMANTASY TOOLS SECTION
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🥀 Romantasy Tools' } }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: QUOTES.romantasy },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '🖤' },
          color: 'red_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Tools designed for the romantasy writer. Track the tension, the tropes, and the heat.\n\n' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '💫' },
                      color: 'pink_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Trope Tracker\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Enemies to Lovers? Fated Mates? Track every delicious trope and BookTok moment.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🖤' },
                      color: 'purple_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Relationship Tracker\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Chemistry scores. Tension levels. The slow burn from hate to love.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🔥' },
                      color: 'orange_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Spice Tracker\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'From sweet tension to explicit heat. Pace your romantic scenes perfectly.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // ═══════════════════════════════════════════════════════════════
      // PLOTTING & SCENES SECTION
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🎭 Plotting & Scenes' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '🎬' },
          color: 'blue_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Scenes & Chapters Database\n\n' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: 'Plot your story with built-in structure support:\n' },
            },
            {
              type: 'text',
              text: { content: '• Three-Act Structure beats\n• Save the Cat! beats\n• Romance progression tracking\n• POV and location linking' },
              annotations: { color: 'gray' },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // ═══════════════════════════════════════════════════════════════
      // PROGRESS TRACKING SECTION
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📊 Progress & Goals' } }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: QUOTES.goals },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🕯️' },
                      color: 'yellow_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Writing Sessions\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Log your daily words. Track your pace. See your progress.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🎯' },
                      color: 'green_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Writing Goals\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Daily, weekly, monthly. Set targets and crush them.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '📋' },
                      color: 'default',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Tasks\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'Your master to-do list across all projects.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // ═══════════════════════════════════════════════════════════════
      // AUTHOR BUSINESS SECTION
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '💼 Author Business' } }],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: { content: '✉️ Querying & Submissions' },
              annotations: { bold: true },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'callout',
              callout: {
                icon: { type: 'emoji', emoji: '📬' },
                color: 'purple_background',
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Query Tracker — ' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: 'Track agents, submissions, and responses. Never lose track of where you\'ve queried.' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'callout',
              callout: {
                icon: { type: 'emoji', emoji: '📚' },
                color: 'brown_background',
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Beta Readers & ARCs — ' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: 'Manage your reader team. Track feedback and reviews.' },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: { content: '📱 Marketing & Launch' },
              annotations: { bold: true },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'callout',
              callout: {
                icon: { type: 'emoji', emoji: '📅' },
                color: 'pink_background',
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Content Calendar — ' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: 'Plan your BookTok, Instagram, and social media content.' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'callout',
              callout: {
                icon: { type: 'emoji', emoji: '💡' },
                color: 'yellow_background',
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Marketing Ideas — ' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: 'Capture viral content ideas. Trope bingos, quote graphics, aesthetics.' },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'callout',
              callout: {
                icon: { type: 'emoji', emoji: '🚀' },
                color: 'red_background',
                rich_text: [
                  {
                    type: 'text',
                    text: { content: 'Launch Checklist — ' },
                    annotations: { bold: true },
                  },
                  {
                    type: 'text',
                    text: { content: 'Step-by-step book release planning. Never miss a beat.' },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // ═══════════════════════════════════════════════════════════════
      // FOOTER
      // ═══════════════════════════════════════════════════════════════
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.moon },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '✨' },
          color: 'gray_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Pro Tips\n\n' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Filter by Manuscript' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — Every database links to Manuscripts. Filter to focus on one project.\n' },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Create Views' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — Add Kanban, Gallery, and Calendar views to databases.\n' },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Use Linked Databases' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — Embed filtered views on manuscript pages for project-specific views.' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: '\n' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: QUOTES.writing },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
    ],
  });

  console.log('   ✓ Dashboard page created');
  return page;
}

/**
 * Creates the Mobile Writing Room - simplified for on-the-go
 */
export async function createMobileWritingRoom(parentPageId) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📱' },
    cover: {
      type: 'external',
      external: { url: COVER_IMAGES.mobile },
    },
    properties: {
      title: [{ type: 'text', text: { content: 'Mobile Writing Room' } }],
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.moon },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '📱' },
          color: 'purple_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'A quiet space for writing on the go.\n' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: 'Simplified for mobile. Capture ideas before they escape.' },
              annotations: { color: 'gray' },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '💭 Quick Capture' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Ideas, dialogue, scenes — write them here:' },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '✍️' },
          color: 'default',
          rich_text: [{ type: 'text', text: { content: '\n\n\n' } }],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🌙 Where I Left Off' } }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Last scene: \nLast line: \nNext: ' },
              annotations: { color: 'gray' },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📋 Today\'s Focus' } }],
        },
      },
      {
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: 'Scene to write:' } }],
          checked: false,
        },
      },
      {
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: 'Word count goal:' } }],
          checked: false,
        },
      },
      {
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: 'One thing to remember:' } }],
          checked: false,
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '💡 Stray Thoughts' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: '' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: '' } }],
        },
      },

      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: '\n' + DIVIDERS.moon },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
    ],
  });

  console.log('   ✓ Mobile Writing Room created');
  return page;
}

/**
 * Creates a beautiful Story Bible hub page
 */
export async function createStoryBiblePage(parentPageId) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📖' },
    cover: {
      type: 'external',
      external: { url: COVER_IMAGES.storyBible },
    },
    properties: {
      title: [{ type: 'text', text: { content: 'Story Bible' } }],
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.moon },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: 'The Story Bible' } }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Every world has its secrets. Keep them here.' },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.moon },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Your Story Bible is a living document — a wiki for your fictional world. Every character, location, magic system, and piece of lore lives here, interconnected and searchable.\n\nAs your story grows, so does this bible. Use it to maintain consistency, spark ideas, and remember the details that make your world feel real.' },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🪞' },
                      color: 'pink_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Characters\n\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'The souls of your story. Physical traits, personality, motivations, secrets, and fatal flaws.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🗺️' },
                      color: 'blue_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Locations\n\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'The places where your story unfolds. Kingdoms, cities, hidden groves, and cursed forests.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '🔮' },
                      color: 'purple_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Magic Systems\n\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'The rules of power. Sources, limitations, costs, and how magic ties to your romance.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      icon: { type: 'emoji', emoji: '⚱️' },
                      color: 'brown_background',
                      rich_text: [
                        {
                          type: 'text',
                          text: { content: 'Lore & History\n\n' },
                          annotations: { bold: true },
                        },
                        {
                          type: 'text',
                          text: { content: 'The weight of the past. Mythology, wars, prophecies, and the secrets buried in time.' },
                          annotations: { color: 'gray' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '💡' },
          color: 'gray_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Tip: ' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: 'Use ' },
            },
            {
              type: 'text',
              text: { content: 'Gallery view' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' for Characters with reference images. Use ' },
            },
            {
              type: 'text',
              text: { content: 'Board view' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' for Locations grouped by type.' },
            },
          ],
        },
      },
    ],
  });

  console.log('   ✓ Story Bible page created');
  return page;
}

/**
 * Creates the Romantasy Hub page
 */
export async function createRomantasyHubPage(parentPageId) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🥀' },
    cover: {
      type: 'external',
      external: { url: COVER_IMAGES.romantasy },
    },
    properties: {
      title: [{ type: 'text', text: { content: 'Romantasy Hub' } }],
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.rose },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: 'Romantasy Hub' } }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: '"He looked at her like she was the answer to a question he\'d been asking his whole life."' },
              annotations: { italic: true, color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: DIVIDERS.rose },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Tools designed specifically for the romantasy writer. Track the slow burn. Map the tension. Ensure every trope hits exactly when it should.' },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '💫 Trope Tracker' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '💘' },
          color: 'pink_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Readers come for the tropes. Make sure you deliver.\n\n' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Macro Tropes' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — Enemies to Lovers, Fated Mates, Forbidden Love\n' },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Micro Tropes' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — "Who did this to you?", The Hand Necklace, Injury Care\n' },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'BookTok Hooks' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — Capture the moments that go viral' },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🖤 Relationship Tracker' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '💕' },
          color: 'purple_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Map the journey from hate to love.\n\n' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Tension Level' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — From "barely tolerating" to "breaking point"\n' },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Chemistry Score' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — Sparks to Inferno\n' },
            },
            {
              type: 'text',
              text: { content: '• ' },
            },
            {
              type: 'text',
              text: { content: 'Stage' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: ' — First Encounter → Antagonistic → Falling → HEA' },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🔥 Spice Tracker' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '🌶️' },
          color: 'red_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Pace your heat. Build the anticipation.\n\n' },
              annotations: { bold: true },
            },
            {
              type: 'text',
              text: { content: 'Track every romantic scene from sweet tension to explicit heat. Know where each moment falls in your manuscript. Ensure the slow burn actually burns.' },
            },
          ],
        },
      },

      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: '\n' + DIVIDERS.rose },
              annotations: { color: 'gray' },
            },
          ],
        },
      },
    ],
  });

  console.log('   ✓ Romantasy Hub page created');
  return page;
}

export default {
  createDashboardPage,
  createMobileWritingRoom,
  createStoryBiblePage,
  createRomantasyHubPage,
};
