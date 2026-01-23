# Author Dashboard - Notion Template Generator

A comprehensive Notion template generator for **romantasy and fiction writers**. This tool creates a fully-featured author dashboard with interconnected databases for managing your writing projects, world-building, and author business.

## Features

### Writing Management
- **Manuscripts** - Track all your WIPs with Kanban-style status tracking (Idea → Outlining → Drafting → Editing → Published)
- **Scenes & Chapters** - Plot structure support with Three-Act and Save the Cat beat sheets
- **Writing Sessions** - Log daily word counts with automatic pace calculations
- **Writing Goals** - Set and track daily, weekly, and project goals
- **Tasks** - Central task management across all projects

### Story Bible
- **Characters** - Comprehensive profiles with romantasy-specific fields (species, magic, fatal flaw, etc.)
- **Locations** - Build your world with interconnected places
- **Magic Systems** - Track rules, costs, and romance connections
- **Lore & World Rules** - History, politics, mythology, and more
- **Research** - Store links, notes, and citations

### Romantasy Tools
- **Trope Tracker** - Track macro tropes (Enemies to Lovers, Fated Mates) and micro tropes (Who Did This To You?, The Hand Necklace)
- **Relationship Tracker** - Monitor tension levels, chemistry scores, and relationship stages
- **Spice Scene Tracker** - Plan and pace your romantic scenes

### Author Business
- **Query Tracker** - Manage agent submissions with status tracking
- **Beta Readers & ARCs** - Coordinate feedback and reviews
- **Content Calendar** - Plan social media for BookTok/Bookstagram
- **Marketing Ideas** - Capture and organize promotional concepts
- **Launch Checklist** - Step-by-step book release planning

### Extra
- **Mobile Writing Room** - Simplified quick-capture page for writing on the go

## Prerequisites

- Node.js 18 or higher
- A Notion account
- A Notion integration (API key)

## Setup Instructions

### 1. Create a Notion Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "+ New integration"
3. Name it (e.g., "Author Dashboard Generator")
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Secret" (starts with `ntn_` or `secret_`)

### 2. Create a Parent Page in Notion

1. In your Notion workspace, create a new page where you want the dashboard
2. This will be the container for all your author dashboard content
3. Click the "..." menu in the top right
4. Click "Connections" → "Connect to" → Select your integration
5. Copy the page ID from the URL:
   ```
   https://notion.so/Your-Page-Title-abc123def456...
                                      ^^^^^^^^^^^^^^^^
                                      This is your page ID
   ```

### 3. Configure the Project

1. Clone or download this project
2. Install dependencies:
   ```bash
   cd author-dashboard-notion
   npm install
   ```
3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and add your credentials:
   ```env
   NOTION_API_KEY=your_integration_token_here
   NOTION_PARENT_PAGE_ID=your_page_id_here
   ```

### 4. Run the Generator

```bash
npm run create-template
```

The script will create all databases and pages, showing progress as it goes.

## What Gets Created

```
Author Dashboard (Page)
├── Manuscripts (Database)
├── Characters (Database) - linked to Manuscripts
├── Locations (Database) - linked to Manuscripts
├── Magic Systems (Database) - linked to Manuscripts
├── Lore & World Rules (Database) - linked to Manuscripts
├── Scenes & Chapters (Database) - linked to Manuscripts, Characters, Locations
├── Trope Tracker (Database) - linked to Manuscripts
├── Relationship Tracker (Database) - linked to Manuscripts, Characters
├── Spice Scene Tracker (Database) - linked to Manuscripts
├── Writing Sessions (Database) - linked to Manuscripts
├── Writing Goals (Database) - linked to Manuscripts
├── Tasks (Database) - linked to Manuscripts
├── Research (Database) - linked to Manuscripts
├── Query Tracker (Database) - linked to Manuscripts
├── Beta Readers & ARCs (Database) - linked to Manuscripts
├── Content Calendar (Database) - linked to Manuscripts
├── Marketing Ideas (Database) - linked to Manuscripts
├── Launch Checklist (Database) - linked to Manuscripts
└── Mobile Writing Room (Page)
```

## Sample Data

The generator includes sample data to help you understand how to use each database:

- A sample manuscript: "The Shadow Court" (a romantasy novel)
- Sample characters: Sera Blackwood (FMC) and Prince Caelan Nightshade (MMC)
- Sample world-building entries
- Sample scenes with plot structure
- Sample tropes with BookTok hooks
- Sample writing session
- Sample tasks and query entries

Feel free to delete the sample data once you understand the structure.

## Customization

After generating the template, you can customize it in Notion:

### Views
- Add **Kanban views** to the Manuscripts database grouped by Status
- Add **Calendar views** to Content Calendar and Writing Sessions
- Add **Gallery views** to Characters with reference images
- Create **filtered views** per manuscript to focus on one project

### Properties
- Add custom select options for genres, tropes, etc.
- Modify formulas for different word count goals
- Add new properties as needed for your workflow

### Relations
- Link databases further (e.g., Scenes to Tropes)
- Create rollups to aggregate data

## File Structure

```
author-dashboard-notion/
├── src/
│   ├── databases/
│   │   ├── manuscripts.js    # WIP/Project management
│   │   ├── characters.js     # Character profiles
│   │   ├── worldbuilding.js  # Locations, Magic, Lore
│   │   ├── scenes.js         # Scene/Chapter tracking
│   │   ├── romantasy.js      # Tropes, Relationships, Spice
│   │   ├── wordcount.js      # Sessions & Goals
│   │   ├── submissions.js    # Queries & Beta readers
│   │   ├── marketing.js      # Content & Launch
│   │   └── tasks.js          # Tasks & Research
│   ├── pages/
│   │   └── dashboard.js      # Main page layout
│   ├── utils/
│   │   ├── notionClient.js   # Notion API client
│   │   └── constants.js      # All options/colors
│   └── index.js              # Main entry point
├── .env.example
├── package.json
└── README.md
```

## Troubleshooting

### "unauthorized" error
- Check that your API key is correct in `.env`
- Make sure the parent page is shared with your integration

### "object_not_found" error
- The page ID might be incorrect
- The page might not be shared with your integration
- Go to the page → "..." → "Connections" → Add your integration

### Rate limiting
The Notion API has rate limits. If you hit them, the script will fail. Wait a minute and try again.

## Based On

This template was designed based on extensive market research of the Notion author template ecosystem, analyzing:
- Top-selling templates on Etsy, Gumroad, and the Notion Marketplace
- User feedback and pain points from Reddit and reviews
- Genre-specific needs for romantasy writers
- Professional author workflows

See `research_"Author Dashboard" Notion template.md` for the full research report.

## License

MIT
