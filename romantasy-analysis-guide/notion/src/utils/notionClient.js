import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NOTION_API_KEY) {
  console.error('Error: NOTION_API_KEY not found in environment variables');
  console.error('Please create a .env file with your Notion API key');
  process.exit(1);
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default notion;
