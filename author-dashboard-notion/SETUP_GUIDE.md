# Beginner's Setup Guide

A step-by-step guide to set up the Author Dashboard, even if you've never used Notion before.

---

## What is This?

This is a **code generator** that creates a complete writing dashboard inside Notion. Instead of manually building 18+ databases and connecting them (which takes hours), this script does it in about 2 minutes.

**What you'll end up with:**
- A beautiful home base for your writing projects
- Character sheets, world-building wikis, scene trackers
- Romantasy-specific tools (trope tracking, spice levels, relationship arcs)
- Marketing and publishing tools

---

## Step 1: Create a Free Notion Account

If you don't have Notion yet:

1. Go to **[notion.so](https://notion.so)**
2. Click **"Get Notion free"**
3. Sign up with Google or email
4. You now have a Notion workspace!

---

## Step 2: Create Your API Integration

This lets the script talk to your Notion account.

1. Go to **[notion.so/my-integrations](https://www.notion.so/my-integrations)**
2. Click the **"+ New integration"** button
3. Fill in:
   - **Name:** `Author Dashboard Generator` (or whatever you want)
   - **Logo:** Skip this (optional)
   - **Associated workspace:** Select your workspace
4. Click **"Submit"**
5. You'll see a screen with **"Internal Integration Secret"**
6. Click **"Show"** then **"Copy"**

```
⚠️ SAVE THIS KEY SOMEWHERE SAFE!
It looks like: ntn_abc123xyz789...
You'll need it in Step 4.
```

---

## Step 3: Create a Parent Page in Notion

This is where your dashboard will live.

1. Open **[notion.so](https://notion.so)** (your workspace)
2. In the left sidebar, click **"+ Add a page"**
3. Name it something like **"My Author Dashboard"** (you can rename later)
4. Leave it blank for now

### Connect Your Integration to This Page

This is the step people often miss!

1. On your new page, click the **"..."** button (top right corner)
2. Scroll down and click **"Connections"**
3. Click **"Connect to"**
4. Find and select **"Author Dashboard Generator"** (the integration you made)
5. Click **"Confirm"**

### Get the Page ID

1. Look at your browser's URL bar. It looks like:
   ```
   https://www.notion.so/My-Author-Dashboard-abc123def456ghi789jkl012mno345pqr
   ```
2. The **Page ID** is the long string at the end (after the last dash):
   ```
   abc123def456ghi789jkl012mno345pqr
   ```
3. Copy this! You'll need it in Step 4.

```
💡 TIP: The page ID is 32 characters, no dashes.
   If you see dashes in the ID, that's okay - it still works!
```

---

## Step 4: Set Up the Project Files

### Install Node.js (if you don't have it)

1. Go to **[nodejs.org](https://nodejs.org)**
2. Download the **LTS** version (the green button)
3. Run the installer, click Next through everything

### Configure the Project

1. Open a terminal/command prompt:
   - **Mac:** Open "Terminal" app
   - **Windows:** Open "Command Prompt" or "PowerShell"

2. Navigate to the project folder:
   ```bash
   cd /path/to/PB_Products/author-dashboard-notion
   ```

3. Install the required packages:
   ```bash
   npm install
   ```

4. Create your config file:
   ```bash
   cp .env.example .env
   ```

5. Open the `.env` file in any text editor and fill in your values:
   ```
   NOTION_API_KEY=ntn_your_key_from_step_2
   NOTION_PARENT_PAGE_ID=your_page_id_from_step_3
   ```

---

## Step 5: Run the Generator!

```bash
npm run create-template
```

You'll see output like this:
```
╔════════════════════════════════════════════════════════════╗
║           AUTHOR DASHBOARD - NOTION TEMPLATE               ║
╚════════════════════════════════════════════════════════════╝

🚀 Starting Author Dashboard creation...

📄 Phase 1: Creating main dashboard page...
   ✓ Dashboard page created

📊 Phase 2: Creating core databases...
   ✓ Manuscripts database
   ✓ Characters database
   ...

✨ SUCCESS! ✨
```

Now go back to Notion and refresh — your dashboard is ready!

---

## Step 6: Customize Your Dashboard (Optional)

The script creates everything in "Table" view. Here's how to make it prettier:

### Add a Kanban Board for Manuscripts

1. Open the **Manuscripts** database
2. Click **"+ Add view"** (top left, next to "Table")
3. Select **"Board"**
4. In the settings, set **"Group by"** → **"Status"**
5. Now you can drag manuscripts between Idea → Drafting → Published!

### Add a Gallery for Characters

1. Open the **Characters** database
2. Click **"+ Add view"** → **"Gallery"**
3. Add reference images to your character pages
4. They'll show up as beautiful cards!

### Filter by Manuscript

Every database links to Manuscripts. To see only one project:

1. Click **"Filter"** at the top of any database
2. Add filter: **"Manuscript"** → **"is"** → **[Your Book]**
3. Save the view with a name like "Shadow Court Only"

---

## Troubleshooting

### "unauthorized" Error
- Double-check your API key in `.env`
- Make sure you connected the integration to your page (Step 3)

### "object_not_found" Error
- Your page ID might be wrong
- The integration might not be connected to the page
- Go to page → "..." → "Connections" → Add your integration

### "NOTION_API_KEY is not set"
- Make sure you created the `.env` file (not `.env.example`)
- Make sure there are no spaces around the `=` sign

### It Worked But I Don't See Anything
- Refresh Notion (Cmd+R or Ctrl+R)
- Check inside your parent page — the dashboard is created as a child page

---

## What's Next?

1. **Delete the sample data** once you understand how things work
2. **Add your own manuscript** to the Manuscripts database
3. **Create characters** for your WIP
4. **Start tracking scenes** with the plot structure tools
5. **Explore the Romantasy tools** for tropes and relationship tracking

Happy writing! 🖤

---

## Quick Reference

| What You Need | Where to Get It |
|---------------|-----------------|
| Notion Account | [notion.so](https://notion.so) |
| API Key | [notion.so/my-integrations](https://notion.so/my-integrations) |
| Node.js | [nodejs.org](https://nodejs.org) |
| Page ID | From your Notion page URL |
