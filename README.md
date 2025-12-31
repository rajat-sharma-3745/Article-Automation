# Article Automation System

A complete end-to-end system for scraping, enhancing, and displaying blog articles using AI. This project automatically fetches articles, improves them using Google search results and LLM rewriting, and displays them in a modern React interface.

## 🎯 Project Overview

This system consists of three main phases:
1. **Phase 1**: Web scraping and CRUD API backend
2. **Phase 2**: AI-powered article enhancement pipeline
3. **Phase 3**: React frontend for article display

Frontend link: https://article-automation.vercel.app \
Backend link: https://article-automate.vercel.app/

---

## 📊 Architecture Diagram

```mermaid
graph TB
    subgraph "Phase 1: Backend & Scraping"
        A[BeyondChats Blog] -->|Scrape| B[Article Scraper]
        B -->|Store| C[(MongoDB Atlas)]
        C <-->|CRUD| D[Express API]
    end
    
    subgraph "Phase 2: Article Enhancement"
        D -->|Fetch Original| E[Article Updater Script]
        E -->|Search Title| F[Google Search API]
        F -->|Top 2 Results| G[Content Scraper]
        G -->|Extract Content| H[Readability + JSDOM]
        H -->|Original + References| I[Gemini LLM]
        I -->|Enhanced Article| J[Update via API]
        J -->|Save| C
    end
    
    subgraph "Phase 3: Frontend"
        D -->|Fetch All| K[React Frontend]
        K -->|Display| L[Article Grid]
        L -->|Click| M[Article Detail View]
        M -->|Show| N[Original + Enhanced Content]
    end
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: SCRAPING                           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
            ┌───────────────────────────────────────┐
            │  BeyondChats Blog (Last Pages)        │
            └───────────────────────────────────────┘
                                    │
                        ┌───────────┴───────────┐
                        │   Article Scraper     │
                        │   • Find last page    │
                        │   • Scrape metadata   │
                        │   • Fetch full content│
                        └───────────┬───────────┘
                                    │
                                    ▼
            ┌───────────────────────────────────────┐
            │         MongoDB Atlas                 │
            │  Articles Collection:                 │
            │  • title, url, author, date           │
            │  • description, image, tags           │
            │  • content (scraped),updatedContnt    │
            │  • status: "original"                 │
            └───────────────────────────────────────┘
                                    │
                                    ▼
            ┌───────────────────────────────────────┐
            │      Express CRUD API                 │
            │  GET    /api/articles                 │
            │  GET    /api/articles/:id             │
            │  POST   /api/articles/scrape          │
            │  PUT    /api/articles/:id             │
            │  DELETE /api/articles/:id             │
            └───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    PHASE 2: AI ENHANCEMENT                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
            ┌───────────────────────────────────────┐
            │   Article Updater Script              │
            │   (Automated Enhancement Pipeline)    │
            └───────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌──────────────┐ ┌────────────────┐
        │ Fetch Original  │ │Google Search │ │Content Scraper │
        │ Articles from   │ │API (Title)   │ │(Top 2 Results) │
        │ MongoDB         │ │              │ │                │
        └─────────────────┘ └──────────────┘ └────────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                        ┌───────────────────────┐
                        │  Gemini LLM API       │
                        │  Prompt:              │
                        │  • Original article   │
                        │  • Reference 1        │
                        │  • Reference 2        │
                        │  → Rewrite & enhance  │
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │  Updated Article      │
                        │  • updatedContent     │
                        │  • status: "updated"  │
                        │  • references[]       │
                        └───────────────────────┘
                                    │
                                    ▼
            ┌───────────────────────────────────────┐
            │    PUT /api/articles/:id              │
            │    Save to MongoDB                    │
            └───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      PHASE 3: FRONTEND                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
            ┌───────────────────────────────────────┐
            │        React Frontend (Vite)          │
            └───────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌──────────────┐ ┌────────────────┐
        │  Fetch Articles │ │ Article Grid │ │ Article Detail │
        │  from API       │ │ View         │ │ Modal          │
        └─────────────────┘ └──────────────┘ └────────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                        ┌───────────────────────┐
                        │   Display:            │
                        │   • Original content  │
                        │   • Enhanced content  │
                        │   • References        │
                        │   • Metadata          │
                        └───────────────────────┘
```

---

## 🛠️ Technology Stack

### Phase 1: Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Scraping**: Axios, Cheerio, @mozilla/readability, jsdom
- **ODM**: Mongoose

### Phase 2: Enhancement Script
- **Search**: Google Custom Search API
- **Content Extraction**: Readability, JSDOM
- **AI**: Google Gemini API
- **HTTP Client**: Axios

### Phase 3: Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Markdown**: react-markdown, remark-gfm
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: lucide-react

---

## 📁 Project Structure

```
article-automation/
├── Article-scraping-backend/      # Phase 1: Backend API
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── article.controller.js
│   │   ├── middlewares/
│   │   │   └── error.js
│   │   ├── models/
│   │   │   └── Article.js
│   │   ├── routes/
│   │   │   ├── article.routes.js
│   │   │   └── scrape.routes.js
│   │   ├── scrapers/
│   │   │   └── article.scraper.js
│   │   └── utils/
│   │       ├── asyncHandler.js
│   │       └── errorHandler.js
│   └── package.json
│
├── article-updater-script/        # Phase 2: Enhancement Pipeline
│   ├── src/
│   │   ├── index.js
│   │   └── services/
│   │       ├── articleFetcher.js
│   │       ├── articleUpdate.js
│   │       ├── contentScraper.js
│   │       ├── googleSearch.js
│   │       └── llmRewriter.js
│   └── package.json
│
└── frontend/                      # Phase 3: React UI
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── api/
    │   │   └── article.api.js
    │   ├── components/
    │   │   ├── ArticleCard.jsx
    │   │   ├── ArticleDetail.jsx
    │   │   ├── MarkdownRenderer.jsx
    │   │   └── Navbar.jsx
    │   └── pages/
    │       └── ArticlesPage.jsx
    └── package.json
```

---

## 🚀 Local Setup Instructions

### Prerequisites

- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas Account**: ([Sign up](https://www.mongodb.com/cloud/atlas/register))
- **API Keys** (see API Setup section below)

---

### Phase 1: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Article-scraping-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   PORT=3000
   MONGO_URI=your_mongodb_atlas_connection_string
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   Server will run on `http://localhost:3000`

5. **Scrape initial articles** (Optional)
   ```bash
   # Send POST request to scrape articles
   curl -X POST http://localhost:3000/api/articles/scrape \
     -H "Content-Type: application/json" \
     -d '{"count": 5}'
   ```

---

### Phase 2: Enhancement Script Setup

1. **Navigate to script directory**
   ```bash
   cd article-updater-script
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   API_BASE_URL=http://localhost:3000/api
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CX=your_search_engine_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the enhancement script**
   ```bash
   npm start
   ```
   
   This will:
   - Fetch all original articles
   - Search Google for each title
   - Scrape top 2 results
   - Rewrite using Gemini AI
   - Update articles in database

---

### Phase 3: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

---

## 🔑 API Keys Setup

### 1. MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database user password
6. Add to `.env` as `MONGO_URI`

**Format**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

---

### 2. Google Custom Search API

**Setup Steps**:

1. **Get API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Custom Search API"
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the API key

2. **Create Custom Search Engine**:
   - Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
   - Click "Add" to create new search engine
   - In "Sites to search": Select "Search the entire web"
   - Create and get your Search Engine ID (cx)

**Cost**: Free tier includes 100 queries/day

**Add to `.env`**:
```
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_CX=your_search_engine_id
```

---

### 3. Google Gemini API

**Setup Steps**:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

**Cost**: Free tier includes:
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day

**Add to `.env`**:
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🎮 Usage Guide

### Step 1: Start Backend
```bash
cd Article-scraping-backend
npm start
```

### Step 2: Scrape Initial Articles
Visit `http://localhost:3000/api/articles/scrape` via POST request or use:
```bash
curl -X POST http://localhost:3000/api/articles/scrape -H "Content-Type: application/json" -d '{"count": 5}'
```

### Step 3: Run Enhancement Script
```bash
cd article-updater-script
npm start
```
Wait for the script to complete (may take 5-10 minutes depending on article count)

### Step 4: Start Frontend
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser

---

## 📡 API Endpoints

### Articles API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get all articles  |
| GET | `/api/articles/:id` | Get single article by ID |
| POST | `/api/articles/scrape` | Trigger scraping (body: `{count: 5}`) |
| PUT | `/api/articles/:id` | Update article by ID |
| DELETE | `/api/articles/:id` | Delete article by ID |

---

## 🗄️ Database Schema

```javascript
{
  title: String,           // Article title
  url: String,             // Original article URL
  author: String,          // Article author
  date: String,            // Publication date
  description: String,     // Full scraped content
  image: String,           // Featured image URL
  tags: [String],          // Article tags
  updatedContent: String,  // AI-enhanced content (Phase 2)
  status: String,          // "original" | "updated"
  references: [{           // Reference articles (Phase 2)
    title: String,
    url: String
  }],
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

---

## 🎨 Frontend Features

- ✅ Responsive grid layout
- ✅ Article cards with metadata
- ✅ Click to view full details
- ✅ Side-by-side original vs enhanced content
- ✅ Markdown rendering with syntax highlighting
- ✅ Copy to clipboard functionality
- ✅ External link to original source
- ✅ Reference citations at bottom
- ✅ Status badges (Original/Updated)
- ✅ Tags display
- ✅ Loading states
- ✅ Error handling

---

##  Troubleshooting

### Enhancement Script Issues

**Problem**: Google Search API quota exceeded
```
Solution: Wait 24 hours or upgrade to paid tier
- Free tier: 100 queries/day
- Check usage: https://console.cloud.google.com/
```

**Problem**: Gemini API rate limit
```
Solution: Add delays between requests or use different API key
- Free tier: 15 requests/minute
- Script includes automatic delays
```

**Problem**: Content scraping fails
```
Solution: Some websites block scrapers
- Script will skip and continue to next article
- Check console for specific errors
```

---



### API Rate Limits
| Service | Free Tier | Our Usage |
|---------|-----------|-----------|
| Google Search | 100/day | 2 per article |
| Gemini API | 1500/day | 1 per article |

---

## Important Notes

1. **Rate Limiting**: The enhancement script includes delays to respect API rate limits
2. **Costs**: All APIs used have generous free tiers sufficient for development
3. **Content Rights**: Scraped content is for educational purposes only
4. **Error Handling**: Scripts will skip problematic articles and continue

---


## Development Notes

### Adding More Articles
```bash
# Scrape more articles from BeyondChats
curl -X POST http://localhost:3000/api/articles/scrape \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

### Re-running Enhancement
```bash
# Delete all enhanced content to re-process
# Or manually update status to "original" in database
cd article-updater-script
npm start
```



