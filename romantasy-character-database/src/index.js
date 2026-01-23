/**
 * Romantasy Character Database - Main Entry Point
 * Generates a complete character database system in Notion
 */

import {
  validateEnvironment,
  getParentPageId,
  logSuccess,
  logInfo,
  logError,
  logProgress,
  delay,
} from './utils/notion.js';

import { createDashboard, createGettingStartedPage } from './pages/dashboard.js';
import { createCharactersDatabase, addLoveInterestRelation, addSampleCharacters } from './databases/characters.js';
import { createRelationshipsDatabase, addSampleRelationships } from './databases/relationships.js';
import { createTropesDatabase, addSampleTropes } from './databases/tropes.js';
import { createScenesDatabase, addSampleScenes } from './databases/scenes.js';

/**
 * Main function to generate the complete template
 */
async function generateTemplate() {
  console.log('\n');
  console.log('✦ ═══════════════════════════════════════════════════════ ✦');
  console.log('       ROMANTASY CHARACTER DATABASE GENERATOR');
  console.log('       For authors who write swoon-worthy fantasy');
  console.log('✦ ═══════════════════════════════════════════════════════ ✦');
  console.log('\n');

  // Validate environment
  validateEnvironment();
  const parentPageId = getParentPageId();

  try {
    // ============================================
    // PHASE 1: Create Dashboard
    // ============================================
    logProgress('Phase 1/6: Creating main dashboard...');
    const dashboardId = await createDashboard(parentPageId);
    logSuccess('Dashboard created');
    await delay(300);

    // ============================================
    // PHASE 2: Create Characters Database
    // ============================================
    logProgress('Phase 2/6: Creating Characters database...');
    const charactersDbId = await createCharactersDatabase(dashboardId);
    logSuccess('Characters database created');
    await delay(300);

    // Add self-referential relation for Love Interest
    logInfo('Adding Love Interest self-relation...');
    await addLoveInterestRelation(charactersDbId);
    logSuccess('Love Interest relation added');
    await delay(300);

    // ============================================
    // PHASE 3: Create Relationships Database
    // ============================================
    logProgress('Phase 3/6: Creating Relationships database...');
    const relationshipsDbId = await createRelationshipsDatabase(dashboardId, charactersDbId);
    logSuccess('Relationships database created');
    await delay(300);

    // ============================================
    // PHASE 4: Create Tropes Database
    // ============================================
    logProgress('Phase 4/6: Creating Trope Library...');
    const tropesDbId = await createTropesDatabase(dashboardId, charactersDbId, relationshipsDbId);
    logSuccess('Trope Library created');
    await delay(300);

    // ============================================
    // PHASE 5: Create Spice Scenes Database
    // ============================================
    logProgress('Phase 5/6: Creating Spice & Romance Scenes database...');
    const scenesDbId = await createScenesDatabase(dashboardId, charactersDbId, relationshipsDbId);
    logSuccess('Spice & Romance Scenes database created');
    await delay(300);

    // ============================================
    // PHASE 6: Add Sample Data
    // ============================================
    logProgress('Phase 6/6: Adding sample data...');

    // Add sample characters
    logInfo('Creating sample characters (Seraphina & Kaelan)...');
    const { fmcId, mmcId, sideId } = await addSampleCharacters(charactersDbId);
    logSuccess('Sample characters created');
    await delay(300);

    // Add sample relationships
    logInfo('Creating sample relationships...');
    await addSampleRelationships(relationshipsDbId, fmcId, mmcId, sideId);
    logSuccess('Sample relationships created');
    await delay(300);

    // Add sample tropes
    logInfo('Creating sample tropes...');
    await addSampleTropes(tropesDbId);
    logSuccess('Sample tropes created');
    await delay(300);

    // Add sample scenes
    logInfo('Creating sample scenes...');
    await addSampleScenes(scenesDbId, fmcId, mmcId, null);
    logSuccess('Sample scenes created');
    await delay(300);

    // Create Getting Started page
    logInfo('Creating Getting Started guide...');
    await createGettingStartedPage(dashboardId);
    logSuccess('Getting Started guide created');

    // ============================================
    // COMPLETE!
    // ============================================
    console.log('\n');
    console.log('✦ ═══════════════════════════════════════════════════════ ✦');
    console.log('           🎉 TEMPLATE GENERATION COMPLETE! 🎉');
    console.log('✦ ═══════════════════════════════════════════════════════ ✦');
    console.log('\n');
    console.log('Your Romantasy Character Database has been created with:');
    console.log('');
    console.log('  📚 Characters Database');
    console.log('     - Dual POV tracking');
    console.log('     - Romantasy archetypes (Morally Gray Hero, etc.)');
    console.log('     - Lie/Truth character arcs');
    console.log('     - Magic & species fields');
    console.log('');
    console.log('  💕 Relationships Database');
    console.log('     - Chemistry & tension scores');
    console.log('     - Romance stage tracking');
    console.log('     - Trope tagging');
    console.log('');
    console.log('  📖 Trope Library');
    console.log('     - Macro tropes (Enemies to Lovers, Fated Mates...)');
    console.log('     - Micro tropes (Who Did This To You?, Touch Her and Die...)');
    console.log('     - BookTok moments');
    console.log('');
    console.log('  🔥 Spice & Romance Scenes');
    console.log('     - Heat level tracking (0-5)');
    console.log('     - Tension before/after');
    console.log('     - Emotional context');
    console.log('');
    console.log('Sample data has been added to help you get started.');
    console.log('Feel free to edit or delete the sample entries!');
    console.log('\n');
    console.log('Happy writing! ✨');
    console.log('\n');

  } catch (error) {
    logError('Template generation failed');
    console.error('\nError details:', error.message);

    if (error.code === 'unauthorized') {
      console.log('\n💡 This usually means:');
      console.log('   1. Your API key is invalid or expired');
      console.log('   2. You haven\'t shared the parent page with your integration');
      console.log('\n   Go to your Notion page → Share → Add your integration');
    }

    if (error.code === 'object_not_found') {
      console.log('\n💡 This usually means:');
      console.log('   1. The NOTION_PAGE_ID is incorrect');
      console.log('   2. You haven\'t shared the page with your integration');
      console.log('\n   Make sure to share the page with your Notion integration!');
    }

    process.exit(1);
  }
}

// Run the generator
generateTemplate();
