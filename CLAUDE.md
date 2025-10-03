# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN stack typing speed test application that measures typing speed (WPM), accuracy, and tracks user progress. The project is split into a React frontend (Vite + Tailwind CSS) and an Express backend (MongoDB + Mongoose).

**Current Status**: Phase 1 complete (Frontend UI with WPM calculation). Backend integration pending.

## Development Commands

### Frontend (React + Vite)
```bash
cd client
npm run dev      # Start dev server on http://localhost:5173
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (Express + MongoDB)
```bash
cd server
# Note: Backend server script needs to be configured in package.json
# Add: "dev": "nodemon server.js" or similar
```

## Architecture

### Frontend Structure (`client/src/`)
- **components/** - React components
  - `TypingTest.jsx` - Main test component with character tracking, timer, and WPM logic
  - `Results.jsx` - Results display with performance rating
- **utils/** - Helper functions and data
  - `calculations.js` - WPM/accuracy calculations (5 chars = 1 word standard)
  - `sampleTexts.js` - Sample text pool and random text generator
- **hooks/** - Custom React hooks (placeholder)
- **pages/** - Page-level components (placeholder)
- **services/** - API integration layer (placeholder)

### Backend Structure (`server/`)
- **models/** - Mongoose schemas
- **routes/** - API route definitions
- **controllers/** - Route handler logic
- **middleware/** - Custom middleware
- **config/** - Configuration files (DB connection, etc.)
- **.env** - Environment variables (MongoDB URI, PORT, etc.)

### Key Technical Details

**WPM Calculation**: Standard formula where 5 characters = 1 word
```javascript
WPM = (correctChars / 5) / (timeInSeconds / 60)
```

**Character Tracking**: Real-time comparison between user input and expected text
- Green: correct characters
- Yellow highlight: current character position
- Error tracking increments on mismatch

**Timer System**: Uses `setInterval` with cleanup in `useEffect`. Countdown starts on first keypress.

**Test Flow**:
1. User selects duration (30s/60s/120s)
2. Typing starts timer
3. Test ends when time expires OR user completes the text
4. Results screen shows WPM, accuracy, correct chars, and error count

## Planned Features (Future Phases)

**Phase 2**: Accuracy metrics, WPM graph, error analysis
**Phase 3**: Backend integration, user auth (JWT), score persistence, leaderboard
**Phase 4**: Difficulty levels, text categories, themes, keyboard heatmap

## Configuration Notes

- **Tailwind**: Configured in `tailwind.config.js` with content paths set
- **Vite**: Standard React setup with HMR
- **MongoDB**: Connection string in `server/.env` (not committed)
- **CORS**: Will need to be configured for local dev (typically `http://localhost:5173`)

## Development Guidelines

- Backend server entry point needs to be created (`server.js` or `index.js`)
- When adding backend routes, follow RESTful conventions
- API service calls should go in `client/src/services/`
- Custom hooks for state management should go in `client/src/hooks/`
