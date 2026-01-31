/**
 * Romantasy Character Database - Notion Client
 * Handles Notion API initialization and common operations
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Validates that required environment variables are set
 */
export function validateEnvironment() {
  if (!process.env.NOTION_API_KEY) {
    console.error('❌ Error: NOTION_API_KEY is not set in your .env file');
    console.log('\n📝 To fix this:');
    console.log('1. Go to https://www.notion.so/my-integrations');
    console.log('2. Create a new integration');
    console.log('3. Copy the API key');
    console.log('4. Add it to your .env file: NOTION_API_KEY=your_key_here\n');
    process.exit(1);
  }

  if (!process.env.NOTION_PAGE_ID) {
    console.error('❌ Error: NOTION_PAGE_ID is not set in your .env file');
    console.log('\n📝 To fix this:');
    console.log('1. Open the Notion page where you want to create the template');
    console.log('2. Click "Share" and add your integration');
    console.log('3. Copy the page ID from the URL (the 32-character string)');
    console.log('4. Add it to your .env file: NOTION_PAGE_ID=your_page_id_here\n');
    process.exit(1);
  }

  return true;
}

/**
 * Gets the parent page ID from environment
 */
export function getParentPageId() {
  return process.env.NOTION_PAGE_ID;
}

/**
 * Creates rich text content for Notion
 */
export function richText(content, annotations = {}) {
  return [{
    type: 'text',
    text: { content },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
      ...annotations,
    },
  }];
}

/**
 * Creates a title property value
 */
export function titleProperty(content) {
  return {
    title: richText(content),
  };
}

/**
 * Creates a rich text property value
 */
export function richTextProperty(content) {
  return {
    rich_text: richText(content),
  };
}

/**
 * Creates a select property value
 */
export function selectProperty(name) {
  return {
    select: { name },
  };
}

/**
 * Creates a multi-select property value
 */
export function multiSelectProperty(names) {
  return {
    multi_select: names.map(name => ({ name })),
  };
}

/**
 * Creates a number property value
 */
export function numberProperty(value) {
  return {
    number: value,
  };
}

/**
 * Creates a checkbox property value
 */
export function checkboxProperty(checked) {
  return {
    checkbox: checked,
  };
}

/**
 * Creates a relation property value
 */
export function relationProperty(pageIds) {
  return {
    relation: pageIds.map(id => ({ id })),
  };
}

/**
 * Creates a URL property value
 */
export function urlProperty(url) {
  return {
    url,
  };
}

/**
 * Creates a date property value
 */
export function dateProperty(start, end = null) {
  return {
    date: {
      start,
      end,
    },
  };
}

/**
 * Delays execution (for rate limiting)
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Logs a success message with emoji
 */
export function logSuccess(message) {
  console.log(`✅ ${message}`);
}

/**
 * Logs an info message with emoji
 */
export function logInfo(message) {
  console.log(`📝 ${message}`);
}

/**
 * Logs an error message with emoji
 */
export function logError(message) {
  console.error(`❌ ${message}`);
}

/**
 * Logs a progress message with emoji
 */
export function logProgress(message) {
  console.log(`⏳ ${message}`);
}
