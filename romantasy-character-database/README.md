# Romantasy Character Database

A Notion template generator designed specifically for **Romantasy authors** — comprehensive character development with romance-specific features like dual POV tracking, chemistry scores, spice levels, and trope management.

## Features

### 📚 Characters Database
- **Romantasy-specific archetypes**: Morally Gray Hero, Shadow Daddy, Empowered Heroine, and more
- **Dual POV support**: Track primary and secondary POV characters
- **Supernatural species**: Fae, Vampires, Shifters, Demons, and custom options
- **Magic systems**: Multiple magic types with power level tracking
- **Lie/Truth character arcs**: Track internal journeys with dedicated fields
- **Romance psychology**: Love languages, romantic baggage, views on love
- **Self-referential relations**: Link characters as love interests

### 💕 Relationships Database
- **Chemistry scores** (1-6): Track the spark between characters
- **Tension levels** (1-6): Monitor building romantic tension
- **Romance stages**: From Pre-Meeting to HEA (Happily Ever After)
- **Trope tagging**: Enemies to Lovers, Fated Mates, Forced Proximity, etc.
- **Dynamic tracking**: How the relationship evolves through your story

### 📖 Trope Library
- **Macro tropes**: Enemies to Lovers, Forbidden Love, Fake Dating, etc.
- **Micro tropes**: "Who Did This To You?", "Touch Her and Die", Hand Necklace
- **BookTok moments**: Track those viral-worthy scenes
- **Linked to characters and relationships**: See which tropes you're using where

### 🔥 Spice & Romance Scenes
- **Heat levels** (0-5): From Clean/Sweet to Very Explicit
- **Scene types**: First Meeting, First Kiss, Black Moment, Resolution
- **Tension tracking**: Before and after each scene
- **Emotional context**: What changes, what's at stake
- **Mood/tone tags**: Tender, Desperate, Forbidden, Healing, etc.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- A Notion account
- A Notion integration (API key)

### Installation

1. **Clone or download this folder**

2. **Install dependencies**
   ```bash
   cd romantasy-character-database
   npm install
   ```

3. **Create a Notion Integration**
   - Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Name it (e.g., "Romantasy Character Database")
   - Copy the API key

4. **Create your .env file**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your credentials:
   ```
   NOTION_API_KEY=your_api_key_here
   NOTION_PAGE_ID=your_page_id_here
   ```

5. **Share your Notion page with the integration**
   - Open the Notion page where you want the template
   - Click "Share" in the top right
   - Click "Invite"
   - Select your integration
   - The page ID is the 32-character string in the URL

6. **Generate your template**
   ```bash
   npm start
   ```

## What Gets Created

```
Your Notion Page
└── Romantasy Character Database (Dashboard)
    ├── Characters (Database)
    │   ├── Seraphina Ashford (Sample FMC)
    │   ├── Kaelan Nighthollow (Sample MMC)
    │   └── Thalia Sunfire (Sample Side Character)
    ├── Relationships (Database)
    │   ├── Seraphina & Kaelan (Main Romance)
    │   └── Seraphina & Thalia (Found Family)
    ├── Trope Library (Database)
    │   ├── Enemies to Lovers
    │   ├── Who Did This To You?
    │   ├── Fated Mates / Soulmates
    │   └── ...more tropes
    ├── Spice & Romance Scenes (Database)
    │   ├── The Assassination Attempt (First Meeting)
    │   ├── War Room Confession (First Kiss)
    │   └── The Truth Revealed (Black Moment)
    └── Getting Started (Guide)
```

## Sample Characters

The template comes with sample characters to demonstrate how to use each field:

**Seraphina Ashford** (FMC)
- Archetype: Assassin with a Heart
- Species: Half-Blood (Human/Fae)
- The Lie She Believes: "I am unworthy of love"
- Arc: Learning to Trust

**Kaelan Nighthollow** (MMC)
- Archetype: Morally Gray Hero
- Species: High Fae
- The Lie He Believes: "I am already damned"
- Arc: Redemption

Feel free to edit or delete these samples!

## Customization

### Adding New Archetypes
Edit `src/utils/constants.js` and add to the `CHARACTER_ARCHETYPES` array.

### Adding New Tropes
Edit `src/utils/constants.js` and add to `MACRO_TROPES` or `MICRO_TROPES`.

### Changing the Aesthetic
Edit `src/utils/aesthetics.js` to change:
- Cover images (Unsplash URLs)
- Icons (emojis)
- Dividers and decorative elements
- Inspirational quotes

## Pricing Guidance (For Sellers)

Based on market research, similar templates are priced:
- Standalone character database: $4-9
- With relationships + tropes: $12-19
- Full bundle with scenes: $15-25

## Technical Notes

- Built with the official Notion API (`@notionhq/client`)
- Uses ES modules (type: module)
- Minimal dependencies for fast setup
- Optimized for Notion performance (avoids heavy rollups)

## Support

If you encounter issues:
1. Make sure your integration has access to the page
2. Check that your API key is correct
3. Ensure Node.js 18+ is installed

## License

MIT License - Feel free to modify and sell the generated templates!

---

*Built for authors who write swoon-worthy fantasy with morally gray heroes and fierce heroines.* ✨
