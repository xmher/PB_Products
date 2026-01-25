/**
 * Romantasy Analysis Guide - Notion Template Generator
 *
 * This script programmatically creates a complete Notion template
 * for analyzing romantasy books using the "Read Like a Writer" methodology.
 *
 * Usage:
 *   1. Create a .env file with your NOTION_API_KEY and NOTION_PAGE_ID
 *   2. Run: npm start
 */

import dotenv from 'dotenv';
import notion from './utils/notionClient.js';
import { createBooksDatabase, addSampleBook } from './databases/books.js';
import { createChapterLogsDatabase, addSampleChapters } from './databases/chapters.js';
import {
  createRomanceBeatsDatabase,
  createFantasyBeatsDatabase,
  addSampleRomanceBeats,
  addSampleFantasyBeats,
} from './databases/beats.js';
import { createTropeTrackerDatabase, addSampleTropes } from './databases/tropes.js';
import {
  createSpiceTrackerDatabase,
  createBanterDatabase,
  addSampleSpice,
  addSampleBanter,
} from './databases/spice.js';
import {
  createCraftMovesDatabase,
  createWorldBuildingDatabase,
  createCharacterDatabase,
  addSampleCraftMoves,
} from './databases/craft.js';
import { createWelcomeContent } from './pages/welcome.js';

dotenv.config();

// Get the parent page ID from environment
const PARENT_PAGE_ID = process.env.NOTION_PAGE_ID;

if (!PARENT_PAGE_ID) {
  console.error('Error: NOTION_PAGE_ID not found in environment variables');
  console.error('Please add NOTION_PAGE_ID to your .env file');
  console.error('This should be the ID of the page where you want to create the template');
  process.exit(1);
}

/**
 * Main function to generate the complete template
 */
async function generateTemplate() {
  console.log('\n📚 Romantasy Analysis Guide - Notion Template Generator');
  console.log('=========================================================\n');

  try {
    // Step 1: Create the main template page
    console.log('📄 Creating main template page...');
    const mainPage = await notion.pages.create({
      parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
      icon: { type: 'emoji', emoji: '📚' },
      cover: {
        type: 'external',
        external: {
          url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200',
        },
      },
      properties: {
        title: [
          {
            type: 'text',
            text: { content: 'Read Like a Writer: Romantasy Analysis Guide' },
          },
        ],
      },
    });
    console.log('✅ Main page created:', mainPage.id);

    // Step 2: Add welcome content to main page
    console.log('\n📝 Adding welcome content...');
    await createWelcomeContent(mainPage.id);
    console.log('✅ Welcome content added');

    // Step 3: Create the Books database (master)
    console.log('\n📚 Creating Book Analysis Library...');
    const booksDb = await createBooksDatabase(mainPage.id);

    // Step 4: Create all related databases
    console.log('\n📝 Creating Chapter Logs database...');
    const chaptersDb = await createChapterLogsDatabase(mainPage.id, booksDb.id);

    console.log('\n💕 Creating Romance Beat Tracker...');
    const romanceBeatsDb = await createRomanceBeatsDatabase(mainPage.id, booksDb.id);

    console.log('\n⚔️ Creating Fantasy Beat Tracker...');
    const fantasyBeatsDb = await createFantasyBeatsDatabase(mainPage.id, booksDb.id);

    console.log('\n🎭 Creating Trope Tracker...');
    const tropesDb = await createTropeTrackerDatabase(mainPage.id, booksDb.id);

    console.log('\n🔥 Creating Spice & Intimacy Tracker...');
    const spiceDb = await createSpiceTrackerDatabase(mainPage.id, booksDb.id);

    console.log('\n💬 Creating Banter Collection...');
    const banterDb = await createBanterDatabase(mainPage.id, booksDb.id);

    console.log('\n✨ Creating Craft Moves to Steal...');
    const craftDb = await createCraftMovesDatabase(mainPage.id, booksDb.id);

    console.log('\n🌍 Creating World-Building Notes...');
    const worldDb = await createWorldBuildingDatabase(mainPage.id, booksDb.id);

    console.log('\n👤 Creating Character Analysis...');
    const characterDb = await createCharacterDatabase(mainPage.id, booksDb.id);

    // Step 5: Add sample data
    console.log('\n📖 Adding sample book entry...');
    const sampleBook = await addSampleBook(booksDb.id);

    console.log('\n📄 Adding sample chapters...');
    await addSampleChapters(chaptersDb.id, sampleBook.id);

    console.log('\n💗 Adding sample romance beats...');
    await addSampleRomanceBeats(romanceBeatsDb.id, sampleBook.id);

    console.log('\n🗡️ Adding sample fantasy beats...');
    await addSampleFantasyBeats(fantasyBeatsDb.id, sampleBook.id);

    console.log('\n🎭 Adding sample tropes...');
    await addSampleTropes(tropesDb.id, sampleBook.id);

    console.log('\n🔥 Adding sample spice entries...');
    await addSampleSpice(spiceDb.id, sampleBook.id);

    console.log('\n💬 Adding sample banter...');
    await addSampleBanter(banterDb.id, sampleBook.id);

    console.log('\n✨ Adding sample craft moves...');
    await addSampleCraftMoves(craftDb.id, sampleBook.id);

    // Success message
    console.log('\n=========================================================');
    console.log('🎉 Template generated successfully!');
    console.log('=========================================================\n');
    console.log('Your Romantasy Analysis Guide is ready at:');
    console.log(`https://notion.so/${mainPage.id.replace(/-/g, '')}`);
    console.log('\nDatabases created:');
    console.log('  📚 Book Analysis Library (master)');
    console.log('  📝 Chapter Logs');
    console.log('  💕 Romance Beat Tracker');
    console.log('  ⚔️ Fantasy Beat Tracker');
    console.log('  🎭 Trope Tracker');
    console.log('  🔥 Spice & Intimacy Tracker');
    console.log('  💬 Banter Collection');
    console.log('  ✨ Craft Moves to Steal');
    console.log('  🌍 World-Building Notes');
    console.log('  👤 Character Analysis');
    console.log('\nSample data has been added to help you get started.');
    console.log('Delete or modify the sample entries as needed.\n');

    return {
      mainPageId: mainPage.id,
      databases: {
        books: booksDb.id,
        chapters: chaptersDb.id,
        romanceBeats: romanceBeatsDb.id,
        fantasyBeats: fantasyBeatsDb.id,
        tropes: tropesDb.id,
        spice: spiceDb.id,
        banter: banterDb.id,
        craft: craftDb.id,
        world: worldDb.id,
        characters: characterDb.id,
      },
    };
  } catch (error) {
    console.error('\n❌ Error generating template:', error.message);

    if (error.code === 'unauthorized') {
      console.error('\nMake sure your Notion integration has access to the parent page.');
      console.error('Go to the page in Notion → ... menu → Add connections → Select your integration');
    }

    if (error.code === 'object_not_found') {
      console.error('\nThe parent page was not found. Check your NOTION_PAGE_ID.');
    }

    throw error;
  }
}

// Run the generator
generateTemplate()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
