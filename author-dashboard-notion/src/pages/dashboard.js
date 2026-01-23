import notion from '../utils/notionClient.js';

/**
 * Creates the main Author Dashboard page with content blocks
 */
export async function createDashboardPage(parentPageId) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📚' },
    cover: {
      type: 'external',
      external: {
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200',
      },
    },
    properties: {
      title: [
        {
          type: 'text',
          text: { content: 'Author Dashboard' },
        },
      ],
    },
    children: [
      // Header callout
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '✨' },
          color: 'purple_background',
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Welcome to your Author Dashboard — your home base for managing your writing life, from first draft to published book.',
              },
            },
          ],
        },
      },
      // Divider
      { object: 'block', type: 'divider', divider: {} },

      // Quick Actions Section
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
                      icon: { type: 'emoji', emoji: '✍️' },
                      color: 'blue_background',
                      rich_text: [{ type: 'text', text: { content: 'Log Writing Session' } }],
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
                      icon: { type: 'emoji', emoji: '📝' },
                      color: 'green_background',
                      rich_text: [{ type: 'text', text: { content: 'Add New Scene' } }],
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
                      icon: { type: 'emoji', emoji: '👤' },
                      color: 'pink_background',
                      rich_text: [{ type: 'text', text: { content: 'New Character' } }],
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
                      rich_text: [{ type: 'text', text: { content: 'Capture Idea' } }],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // Main Navigation Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📖 Your Writing Hub' } }],
        },
      },

      // Two column layout for databases
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
                    type: 'heading_3',
                    heading_3: {
                      rich_text: [{ type: 'text', text: { content: '📚 Manuscripts' } }],
                    },
                  },
                  {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                      rich_text: [{ type: 'text', text: { content: 'Track all your WIPs from idea to published. Use Kanban view to visualize your pipeline.' } }],
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
                    type: 'heading_3',
                    heading_3: {
                      rich_text: [{ type: 'text', text: { content: '🎬 Scenes & Chapters' } }],
                    },
                  },
                  {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                      rich_text: [{ type: 'text', text: { content: 'Plot structure with Three-Act and Save the Cat beats. Track every scene.' } }],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // Story Bible Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📜 Story Bible' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Everything about your world, characters, and lore in one connected wiki.' },
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
                      icon: { type: 'emoji', emoji: '👤' },
                      color: 'pink_background',
                      rich_text: [{ type: 'text', text: { content: 'Characters\nProfiles, arcs, relationships' } }],
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
                      icon: { type: 'emoji', emoji: '🏰' },
                      color: 'purple_background',
                      rich_text: [{ type: 'text', text: { content: 'Locations\nPlaces, cultures, maps' } }],
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
                      icon: { type: 'emoji', emoji: '✨' },
                      color: 'blue_background',
                      rich_text: [{ type: 'text', text: { content: 'Magic Systems\nPowers, rules, costs' } }],
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
                      icon: { type: 'emoji', emoji: '📜' },
                      color: 'brown_background',
                      rich_text: [{ type: 'text', text: { content: 'Lore & Rules\nHistory, politics, mythology' } }],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // Romantasy Tools Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '💕 Romantasy Tools' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Genre-specific tools for tracking romance arcs, tropes, and spice levels.' },
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
                      icon: { type: 'emoji', emoji: '💘' },
                      color: 'red_background',
                      rich_text: [{ type: 'text', text: { content: 'Trope Tracker\nMacro & micro tropes, BookTok hooks' } }],
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
                      icon: { type: 'emoji', emoji: '💞' },
                      color: 'pink_background',
                      rich_text: [{ type: 'text', text: { content: 'Relationships\nTension, chemistry, stages' } }],
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
                      rich_text: [{ type: 'text', text: { content: 'Spice Tracker\nHeat levels, pacing, scenes' } }],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // Progress & Goals Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📊 Progress & Goals' } }],
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
                      icon: { type: 'emoji', emoji: '📈' },
                      color: 'green_background',
                      rich_text: [{ type: 'text', text: { content: 'Writing Sessions\nTrack words, time, and pace' } }],
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
                      color: 'blue_background',
                      rich_text: [{ type: 'text', text: { content: 'Goals\nDaily, weekly, project targets' } }],
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
                      icon: { type: 'emoji', emoji: '✅' },
                      color: 'yellow_background',
                      rich_text: [{ type: 'text', text: { content: 'Tasks\nYour writing to-do list' } }],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // Business Section
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '💼 Author Business' } }],
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
                      icon: { type: 'emoji', emoji: '📬' },
                      color: 'purple_background',
                      rich_text: [{ type: 'text', text: { content: 'Query Tracker\nAgents, submissions, status' } }],
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
                      icon: { type: 'emoji', emoji: '📖' },
                      color: 'brown_background',
                      rich_text: [{ type: 'text', text: { content: 'Beta/ARC Readers\nManage feedback & reviews' } }],
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
                      icon: { type: 'emoji', emoji: '📅' },
                      color: 'pink_background',
                      rich_text: [{ type: 'text', text: { content: 'Content Calendar\nSocial media planning' } }],
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
                      icon: { type: 'emoji', emoji: '🚀' },
                      color: 'red_background',
                      rich_text: [{ type: 'text', text: { content: 'Launch Checklist\nBook release planning' } }],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      { object: 'block', type: 'divider', divider: {} },

      // Footer
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '💡' },
          color: 'gray_background',
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Tip: Use the sidebar to navigate between databases. Each database can be filtered by manuscript to show only relevant entries.',
              },
            },
          ],
        },
      },
    ],
  });

  console.log('Created Dashboard page:', page.id);
  return page;
}

/**
 * Creates the Mobile Writing Room - a simplified quick-action page
 */
export async function createMobileWritingRoom(parentPageId) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '📱' },
    properties: {
      title: [
        {
          type: 'text',
          text: { content: 'Mobile Writing Room' },
        },
      ],
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '📱' },
          color: 'blue_background',
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'A simplified view optimized for mobile. Quick capture and writing on the go.',
              },
            },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📝 Quick Note Capture' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Jot down ideas, dialogue snippets, or scene notes here:' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: '' } }],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '✍️ Today\'s Writing Focus' } }],
        },
      },
      {
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: 'What scene am I working on?' } }],
          checked: false,
        },
      },
      {
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: 'Today\'s word count goal:' } }],
          checked: false,
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '💭 Where I Left Off' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Update this before ending each session:' } }],
        },
      },
      {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: 'Last scene: [Scene name]\nLast line written: [Your last line]\nNext: [What happens next]' } }],
        },
      },
    ],
  });

  console.log('Created Mobile Writing Room:', page.id);
  return page;
}

export default {
  createDashboardPage,
  createMobileWritingRoom,
};
