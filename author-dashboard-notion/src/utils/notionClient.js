import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

export default notion;
