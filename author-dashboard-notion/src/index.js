#!/usr/bin/env node

/**
 * Author Dashboard - Notion Template Generator
 *
 * A comprehensive hub for romantasy/fiction writers to manage their
 * projects, goals, and writing life.
 *
 * Based on extensive market research of the Notion author template ecosystem.
 */

import notion, { PARENT_PAGE_ID } from './utils/notionClient.js';

// Database creators
import { createManuscriptsDatabase, addSampleManuscripts } from './databases/manuscripts.js';
import { createCharactersDatabase, addSampleCharacters } from './databases/characters.js';
import {
  createLocationsDatabase,
  createMagicSystemsDatabase,
  createLoreDatabase,
  addSampleWorldbuilding
} from './databases/worldbuilding.js';
import { createScenesDatabase, addSampleScenes } from './databases/scenes.js';
import {
  createTropesDatabase,
  createRelationshipsDatabase,
  createSpiceTrackerDatabase,
  addSampleTropes
} from './databases/romantasy.js';
import {
  createWritingSessionsDatabase,
  createWritingGoalsDatabase,
  addSampleWritingSessions
} from './databases/wordcount.js';
import {
  createSubmissionsDatabase,
  createBetaReadersDatabase,
  addSampleQuery
} from './databases/submissions.js';
import {
  createContentCalendarDatabase,
  createMarketingIdeasDatabase,
  createLaunchChecklistDatabase,
  addSampleContent
} from './databases/marketing.js';
import {
  createTasksDatabase,
  createResearchDatabase,
  addSampleTasks
} from './databases/tasks.js';

// Page creators
import { createDashboardPage, createMobileWritingRoom } from './pages/dashboard.js';

/**
 * Main function to create the entire Author Dashboard
 */
async function createAuthorDashboard() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           AUTHOR DASHBOARD - NOTION TEMPLATE               ║');
  console.log('║        For Romantasy & Fiction Writers                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  // Validate environment
  if (!process.env.NOTION_API_KEY) {
    console.error('❌ Error: NOTION_API_KEY is not set in .env file');
    console.log('');
    console.log('To set up:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Get your API key from https://www.notion.so/my-integrations');
    console.log('3. Add your API key to the .env file');
    process.exit(1);
  }

  if (!PARENT_PAGE_ID) {
    console.error('❌ Error: NOTION_PARENT_PAGE_ID is not set in .env file');
    console.log('');
    console.log('To set up:');
    console.log('1. Create a page in Notion where you want the dashboard');
    console.log('2. Share the page with your integration');
    console.log('3. Copy the page ID from the URL and add it to .env');
    process.exit(1);
  }

  try {
    console.log('🚀 Starting Author Dashboard creation...');
    console.log('');

    // Store all database IDs for relations
    const databases = {};

    // ═══════════════════════════════════════════════════════════════
    // PHASE 1: Create the main dashboard page
    // ═══════════════════════════════════════════════════════════════
    console.log('📄 Phase 1: Creating main dashboard page...');
    const dashboardPage = await createDashboardPage(PARENT_PAGE_ID);
    console.log('   ✓ Dashboard page created');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // PHASE 2: Create core databases (Manuscripts first - others relate to it)
    // ═══════════════════════════════════════════════════════════════
    console.log('📊 Phase 2: Creating core databases...');

    const manuscriptsDb = await createManuscriptsDatabase(dashboardPage.id);
    databases.manuscripts = manuscriptsDb.id;
    console.log('   ✓ Manuscripts database');

    const charactersDb = await createCharactersDatabase(dashboardPage.id, databases.manuscripts);
    databases.characters = charactersDb.id;
    console.log('   ✓ Characters database');

    const locationsDb = await createLocationsDatabase(dashboardPage.id, databases.manuscripts);
    databases.locations = locationsDb.id;
    console.log('   ✓ Locations database');

    const magicDb = await createMagicSystemsDatabase(dashboardPage.id, databases.manuscripts);
    databases.magic = magicDb.id;
    console.log('   ✓ Magic Systems database');

    const loreDb = await createLoreDatabase(dashboardPage.id, databases.manuscripts);
    databases.lore = loreDb.id;
    console.log('   ✓ Lore database');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // PHASE 3: Create scene/chapter database (needs characters & locations)
    // ═══════════════════════════════════════════════════════════════
    console.log('🎬 Phase 3: Creating scenes database...');
    const scenesDb = await createScenesDatabase(
      dashboardPage.id,
      databases.manuscripts,
      databases.characters,
      databases.locations
    );
    databases.scenes = scenesDb.id;
    console.log('   ✓ Scenes & Chapters database');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // PHASE 4: Create romantasy-specific databases
    // ═══════════════════════════════════════════════════════════════
    console.log('💕 Phase 4: Creating romantasy tools...');

    const tropesDb = await createTropesDatabase(dashboardPage.id, databases.manuscripts);
    databases.tropes = tropesDb.id;
    console.log('   ✓ Trope Tracker');

    const relationshipsDb = await createRelationshipsDatabase(
      dashboardPage.id,
      databases.manuscripts,
      databases.characters
    );
    databases.relationships = relationshipsDb.id;
    console.log('   ✓ Relationship Tracker');

    const spiceDb = await createSpiceTrackerDatabase(dashboardPage.id, databases.manuscripts);
    databases.spice = spiceDb.id;
    console.log('   ✓ Spice Scene Tracker');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // PHASE 5: Create progress tracking databases
    // ═══════════════════════════════════════════════════════════════
    console.log('📊 Phase 5: Creating progress tracking...');

    const sessionsDb = await createWritingSessionsDatabase(dashboardPage.id, databases.manuscripts);
    databases.sessions = sessionsDb.id;
    console.log('   ✓ Writing Sessions');

    const goalsDb = await createWritingGoalsDatabase(dashboardPage.id, databases.manuscripts);
    databases.goals = goalsDb.id;
    console.log('   ✓ Writing Goals');

    const tasksDb = await createTasksDatabase(dashboardPage.id, databases.manuscripts);
    databases.tasks = tasksDb.id;
    console.log('   ✓ Tasks');

    const researchDb = await createResearchDatabase(dashboardPage.id, databases.manuscripts);
    databases.research = researchDb.id;
    console.log('   ✓ Research');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // PHASE 6: Create business/marketing databases
    // ═══════════════════════════════════════════════════════════════
    console.log('💼 Phase 6: Creating author business tools...');

    const submissionsDb = await createSubmissionsDatabase(dashboardPage.id, databases.manuscripts);
    databases.submissions = submissionsDb.id;
    console.log('   ✓ Query Tracker');

    const betaDb = await createBetaReadersDatabase(dashboardPage.id, databases.manuscripts);
    databases.beta = betaDb.id;
    console.log('   ✓ Beta Readers & ARCs');

    const contentDb = await createContentCalendarDatabase(dashboardPage.id, databases.manuscripts);
    databases.content = contentDb.id;
    console.log('   ✓ Content Calendar');

    const ideasDb = await createMarketingIdeasDatabase(dashboardPage.id, databases.manuscripts);
    databases.ideas = ideasDb.id;
    console.log('   ✓ Marketing Ideas');

    const launchDb = await createLaunchChecklistDatabase(dashboardPage.id, databases.manuscripts);
    databases.launch = launchDb.id;
    console.log('   ✓ Launch Checklist');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // PHASE 7: Create additional pages
    // ═══════════════════════════════════════════════════════════════
    console.log('📱 Phase 7: Creating additional pages...');
    await createMobileWritingRoom(dashboardPage.id);
    console.log('   ✓ Mobile Writing Room');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // PHASE 8: Add sample data
    // ═══════════════════════════════════════════════════════════════
    console.log('📝 Phase 8: Adding sample data...');

    // Add sample manuscript first
    await addSampleManuscripts(databases.manuscripts);

    // Get the sample manuscript page ID for relations
    const manuscriptPages = await notion.databases.query({
      database_id: databases.manuscripts,
      page_size: 1,
    });
    const sampleManuscriptId = manuscriptPages.results[0]?.id;

    // Add related sample data
    await addSampleCharacters(databases.characters, sampleManuscriptId);
    await addSampleWorldbuilding(databases.locations, databases.magic, sampleManuscriptId);
    await addSampleScenes(databases.scenes, sampleManuscriptId);
    await addSampleTropes(databases.tropes, sampleManuscriptId);
    await addSampleWritingSessions(databases.sessions, sampleManuscriptId);
    await addSampleTasks(databases.tasks, sampleManuscriptId);
    await addSampleQuery(databases.submissions, sampleManuscriptId);
    await addSampleContent(databases.content, sampleManuscriptId);

    console.log('   ✓ Sample data added');
    console.log('');

    // ═══════════════════════════════════════════════════════════════
    // COMPLETE!
    // ═══════════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    ✨ SUCCESS! ✨                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Your Author Dashboard has been created with:');
    console.log('');
    console.log('📚 WRITING MANAGEMENT');
    console.log('   • Manuscripts (WIP tracker with Kanban)');
    console.log('   • Scenes & Chapters (with plot structure)');
    console.log('   • Writing Sessions (word count tracker)');
    console.log('   • Writing Goals');
    console.log('   • Tasks');
    console.log('');
    console.log('📜 STORY BIBLE');
    console.log('   • Characters (with romantasy-specific fields)');
    console.log('   • Locations');
    console.log('   • Magic Systems');
    console.log('   • Lore & World Rules');
    console.log('   • Research');
    console.log('');
    console.log('💕 ROMANTASY TOOLS');
    console.log('   • Trope Tracker (macro + micro + BookTok hooks)');
    console.log('   • Relationship Tracker (tension + chemistry)');
    console.log('   • Spice Scene Tracker');
    console.log('');
    console.log('💼 AUTHOR BUSINESS');
    console.log('   • Query Tracker');
    console.log('   • Beta Readers & ARCs');
    console.log('   • Content Calendar');
    console.log('   • Marketing Ideas');
    console.log('   • Launch Checklist');
    console.log('');
    console.log('📱 EXTRA');
    console.log('   • Mobile Writing Room (optimized for phone)');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🔗 Open your Notion workspace to see your new dashboard!');
    console.log('');
    console.log('💡 Tips:');
    console.log('   • Sample data has been added - feel free to delete it');
    console.log('   • Add linked database views to customize your views');
    console.log('   • Filter databases by manuscript to focus on one project');
    console.log('');

    return databases;

  } catch (error) {
    console.error('');
    console.error('❌ Error creating Author Dashboard:');
    console.error(error.message);

    if (error.code === 'unauthorized') {
      console.log('');
      console.log('Make sure your API key is correct and the parent page is shared with your integration.');
    }

    if (error.code === 'object_not_found') {
      console.log('');
      console.log('The parent page was not found. Make sure:');
      console.log('1. The page ID is correct');
      console.log('2. The page is shared with your integration');
    }

    process.exit(1);
  }
}

// Run the script
createAuthorDashboard();
