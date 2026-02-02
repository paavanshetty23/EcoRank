# EcoRank - Recycling Production Line Manager Selection System

A complete local system for evaluating and ranking production line manager candidates using AI-powered scoring across three dimensions: Crisis Management, Sustainability, and Team Motivation.

## 🎯 Project Overview

This system provides:
- **MySQL Database Schema** with automated scoring triggers and ranking system
- **Fake Data Generator** using Faker.js to create 40 realistic candidates
- **AI Evaluation Prompts** with detailed rubrics for three assessment dimensions
- **React Dashboard** (Vite + Mantine) for visualizing candidate rankings and scores

## 📁 Project Structure

```
recycling-manager-selection-system/
├── database/
│   ├── schema.sql          # MySQL tables, indexes, and triggers
│   └── seed.sql            # Auto-generated INSERT statements
├── faker/
│   ├── generateCandidates.js   # Node script to generate test data
│   └── package.json
├── ai-prompts/
│   └── prompts.md          # Three AI prompts with rubrics and mock evaluator
├── frontend/
│   └── dashboard/          # React + Vite + Mantine dashboard
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
│           ├── main.jsx
│           ├── App.jsx
│           ├── components/
│           │   ├── Leaderboard.jsx
│           │   ├── CandidateCard.jsx
│           │   └── SkillHeatmap.jsx
│           └── data/
│               └── candidates.json
├── README.md
└── validation.md
```

## 🚀 Quick Start

### Step 1: Generate Candidate Data

**Option A: Use the UI Button (Easiest)**

1. Start the dashboard: `cd frontend/dashboard && npm install && npm run dev`
2. Click the "Regenerate Data" button in the top-right corner
3. New data is generated instantly and files are downloaded automatically
4. The dashboard updates with the new candidates immediately

**Option B: Use Command Line**

```bash
# Navigate to faker directory
cd faker

# Install dependencies
npm install

# Generate seed data
node generateCandidates.js
```

This creates:
- `database/seed.sql` - SQL INSERT statements for 40 candidates
- `frontend/dashboard/src/data/candidates.json` - JSON data for the dashboard

### Step 2: Set Up Database (Optional)

If you have MySQL installed locally:

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE recycling_manager_selection;"

# Apply schema
mysql -u root -p recycling_manager_selection < database/schema.sql

# Load seed data
mysql -u root -p recycling_manager_selection < database/seed.sql

# Verify data
mysql -u root -p recycling_manager_selection -e "SELECT * FROM rankings ORDER BY rank_position LIMIT 10;"
```

**Note:** The frontend works with the JSON file, so MySQL is optional for demo purposes.

### Step 3: Run Frontend Dashboard

```bash
# Navigate to frontend
cd frontend/dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will open at `http://localhost:3000`.

## 🎨 UI Improvements (Updated Feb 2026)

The dashboard has been enhanced with production-ready features:

### Visual & UX Enhancements
- **Consistent Color Scheme**: Crisis Management (red #d9534f), Sustainability (green #28a745), Team Motivation (blue #2b7be4) across all components
- **Rank Badges**: Top-left corner badges on candidate cards with special styling for top 3 (gold/silver/bronze)
- **Score Tier Colors**: Total scores color-coded by performance (≥85 green, 70-84 yellow, <70 red)
- **Compact Skill Badges**: Smaller, more readable skill tags
- **Improved Typography**: Stronger headings, better hierarchy, reduced padding

### Professional UI Polish (Latest - Feb 2026)
- **White Background Theme**: Clean, corporate white backgrounds throughout all components
- **Subtle Borders & Shadows**: Professional depth with minimal visual noise (1px borders, subtle box shadows)
- **Compact Spacing**: Reduced padding and margins for information density (py="md" instead of "xl")
- **Consistent Metric Colors**: CSS variables for centralized color management
  - Crisis Management: `#d9534f` (red)
  - Sustainability: `#28a745` (green)
  - Team Motivation: `#2b7be4` (blue)
  - Accent Blue: `#0f62fe` (primary actions)
- **Custom Mantine Theme**: 
  - Inter font family
  - Deep blue primary color (#0f62fe)
  - Reduced border radius (6px)
  - Custom heading weights
- **Thin Progress Bars**: 8-10px height bars with exact metric colors instead of heavy colored blocks
- **Tier-Based Total Scores**: Pills with white background and colored borders based on performance tier
- **Circular Rank Badges**: Absolute positioned badges for top 3 (gold #ffc107, silver #9e9e9e, bronze #cd7f32)
- **Professional Table Styling**: Compact cells (10px/12px padding), hover effects, rank badges with special top-3 styling
- **Action Buttons**: Footer buttons (Details/Share) with modal for JSON view and clipboard copy
- **Horizontal Skill Bars**: Labeled bars with percentage-based widths and metric-colored badges
- **Compact Legend**: Inline legend with colored dots and uppercase labels
- **Automated Data Generation**: One-click button to regenerate 40 new candidates with automatic file downloads (no terminal commands needed!)

### Filtering & Search
- **Name Search**: Real-time text filter on leaderboard
- **Multi-Skill Filter**: Dropdown to filter by one or more skills
- **Column Sorting**: Click headers to sort by name, experience, or total score
- **Pagination**: 10 candidates per page with page controls

### Data & Code Quality
- **Centralized Data Loading**: New `dataLoader.js` utility handles all calculations
- **Memoization**: Expensive operations cached for performance
- **Consistent Metrics**: Single source of truth for colors and tier thresholds

### Accessibility
- **ARIA Labels**: Screen reader support on all interactive elements
- **Keyboard Navigation**: Full keyboard support with focus indicators
- **Semantic HTML**: Proper article/section tags for candidate cards

### New Features
- **Details Modal**: View full candidate JSON profile
- **Share Button**: Copy minimal candidate info to clipboard with toast feedback
- **Color Legend**: Visual guide for metric interpretation
- **Dev Helper**: Quick command to regenerate seed data (dev mode only)

---

## 🗄️ Database Architecture

### Tables

1. **candidates** - Basic candidate information
   - `id`, `name`, `years_experience`, `skills` (JSON), `created_at`

2. **evaluations** - AI scoring results
   - `candidate_id`, `crisis_management_score`, `sustainability_score`, `team_motivation_score`, `total_score`

3. **rankings** - Computed rankings
   - `candidate_id`, `rank_position`, `total_score`, `updated_at`

### Automatic Triggers

**How it works:**

1. When an evaluation is `INSERT`ed or `UPDATE`d:
   - Trigger `before_evaluation_insert/update` computes `total_score = (crisis + sustainability + team) / 3`
   
2. After the evaluation is saved:
   - Trigger `after_evaluation_insert/update` upserts the candidate into `rankings` table
   - All `rank_position` values are recalculated in descending order by `total_score`

**Why triggers?**
- Ensures data consistency (total_score always accurate)
- Auto-updates rankings without manual queries
- Simplifies application logic

## 🤖 AI Evaluation Prompts

See `ai-prompts/prompts.md` for three complete prompts:

1. **Crisis Management** - Evaluates operational resilience and problem-solving
2. **Sustainability** - Assesses environmental leadership and resource management
3. **Team Motivation** - Measures leadership and people development skills

Each prompt includes:
- Evaluator role definition
- Detailed rubric with scoring factors
- Required JSON output format
- Mock evaluator implementation for testing

### Mock Evaluator Usage

For local testing without AI API costs:

```javascript
// See ai-prompts/prompts.md for full implementation
const result = mockEvaluate(candidate, 'crisis');
// Returns: { score: 78.5, reason: "...", breakdown: {...} }
```

## 🎨 Frontend Features

### Leaderboard Tab
- Top 10 candidates ranked by total score
- Visual indicators for top 3 positions
- Search/filter by name (bonus feature)
- Click rows to view details

### All Candidates Tab
- Full list of all 40 candidates
- Detailed cards with scores and skill badges
- "Share" button to copy candidate JSON (bonus feature)

### Skill Analytics Tab
- Average scores grouped by skill category
- Visual bar charts for each metric
- Overall statistics dashboard

### Tech Stack
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Mantine 7** - Component library
- **Tabler Icons** - Icon set

## 📊 Sample Commands

```bash
# Generate new candidate data
cd faker && node generateCandidates.js

# Build frontend for production
cd frontend/dashboard && npm run build

# Preview production build
cd frontend/dashboard && npm run preview

# Check SQL syntax (if MySQL client available)
mysql --help
mysqldump --help
```

## 🧪 Validation

See [validation.md](validation.md) for:
- Commands executed during development
- Output logs and results
- Known limitations and environment constraints

## 🔧 Customization

### Changing Number of Candidates

Edit `faker/generateCandidates.js`:

```javascript
const NUM_CANDIDATES = 100; // Change from 40 to desired number
```

### Adding New Skills

Edit skill pool in `faker/generateCandidates.js`:

```javascript
const SKILL_POOL = [
    'Operations',
    'Your New Skill',
    // ... existing skills
];
```

### Connecting to Real API

Replace static import in `frontend/dashboard/src/App.jsx`:

```javascript
// Current (static):
import candidatesData from './data/candidates.json'

// Replace with API call:
const [candidatesData, setCandidatesData] = useState([])
useEffect(() => {
  fetch('http://your-api.com/candidates')
    .then(res => res.json())
    .then(setCandidatesData)
}, [])
```

## 📝 License

This is a demonstration project created for educational purposes.

## 🤝 Contributing

This is a standalone local project. For production use:
1. Replace mock AI evaluator with real AI API calls
2. Add authentication and authorization
3. Implement backend API with proper validation
4. Add automated tests
5. Set up proper error handling and logging
