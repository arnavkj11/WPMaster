# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN stack typing speed test application that measures typing speed (WPM), accuracy, and tracks user progress. The project is split into a React frontend (Vite + Tailwind CSS) and an Express backend (MongoDB + Mongoose).

**Current Status**: Phase 4 complete - Enhanced typing experience with AI features, dark mode, sound effects, and advanced visualizations.

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
npm run dev      # Start dev server with nodemon on http://localhost:5000
npm start        # Start production server
```

**Important**: Both frontend and backend servers must be running concurrently for full functionality.

## Architecture

### Frontend Structure (`client/src/`)

- **components/** - React components
  - `TypingTest.jsx` - Main test component with character tracking, timer, WPM logic, backend integration, difficulty/category selection, AI text generation, and auto-scrolling text display
  - `Results.jsx` - Enhanced results display with WPM chart, error analysis, performance rating, keyboard heatmap, and AI feedback
  - `WPMChart.jsx` - SVG-based WPM progression chart component
  - `KeyboardHeatmap.jsx` - Interactive keyboard visualization showing key press frequency and accuracy
  - `Leaderboard.jsx` - Global leaderboard with duration filtering
- **pages/** - Page-level components
  - `AuthPage.jsx` - Combined login/register page with tab switcher
  - `StatsPage.jsx` - Personal statistics dashboard with history and charts
- **hooks/** - Custom React hooks
  - `useTypingStats.js` - Advanced stats tracking (WPM history, error patterns, accuracy, key press data for heatmap)
  - `useTypingSounds.js` - Sound effects management with Web Audio API (keystroke, error, and completion sounds)
- **utils/** - Helper functions and data
  - `calculations.js` - WPM/accuracy calculations with NaN protection and safety checks (5 chars = 1 word standard)
  - `sampleTexts.js` - Categorized text library with difficulty levels (beginner, intermediate, advanced) and categories (general, quotes, programming)
- **services/** - API integration layer
  - `api.js` - Axios-based API service with auth interceptors and AI endpoints
- **context/** - React Context
  - `AuthContext.jsx` - Global authentication state management
  - `ThemeContext.jsx` - Dark/light theme management with localStorage persistence
- **styles/** - Styling
  - `index.css` - Global styles with custom scrollbar styling for typing text display
- **App.jsx** - React Router setup with routes: `/`, `/auth`, `/stats`

### Backend Structure (`server/`)

- **models/** - Mongoose schemas
  - `User.js` - User model with password hashing (bcrypt)
  - `TestResult.js` - Test result model with user reference
- **routes/** - API route definitions
  - `authRoutes.js` - Authentication routes
  - `testResultRoutes.js` - Test result routes
  - `aiRoutes.js` - AI text generation and error analysis routes
- **controllers/** - Route handler logic
  - `authController.js` - Register, login, profile handlers with JWT generation
  - `testResultController.js` - Save results, get user stats, leaderboard
  - `aiController.js` - AI text generation and personalized error analysis using Anthropic API (claude-3-7-sonnet-20250219) with comprehensive error handling and logging
- **middleware/** - Custom middleware
  - `authMiddleware.js` - JWT verification and route protection
- **config/** - Configuration files
  - `db.js` - MongoDB connection with Mongoose
- **server.js** - Express server entry point
- **.env** - Environment variables (MONGODB_URI, PORT, JWT_SECRET)

### Key Technical Details

**WPM Calculation**: Standard formula where 5 characters = 1 word

```javascript
WPM = correctChars / 5 / (timeInSeconds / 60);
```

- Includes NaN protection and validation checks
- Returns 0 for invalid inputs instead of NaN
- Prevents display issues when resetting or switching tests

**Character Tracking**: Real-time comparison between user input and expected text

- Green: correct characters
- Red with red background: error characters
- Yellow highlight: current character position
- Error positions tracked in Set for visual feedback

**Advanced Stats Tracking** (`useTypingStats` hook):

- WPM recorded every second for progression chart
- Character-level error tracking with mistake patterns
- Real-time accuracy calculation
- Peak WPM tracking
- Common mistakes analysis (character substitutions)
- Key press frequency tracking for keyboard heatmap

**Scrollable Text Display**:

- Fixed-height container (h-64 / 256px) with auto-scroll functionality
- Current character automatically scrolls into view as user types
- Custom-styled scrollbar with theme-aware colors
- Smooth scrolling behavior for better UX
- Wider layout (max-w-6xl) to accommodate longer AI-generated texts

**Timer System**: Uses `setInterval` with cleanup in `useEffect`. Countdown starts on first keypress.

**Test Flow**:

1. User selects difficulty (beginner/intermediate/advanced), category (general/quotes/programming), and duration (30s/60s/120s)
2. User can optionally generate AI-customized text based on preferences and past mistakes
3. Typing starts timer and WPM tracking
4. Live stats update: WPM, accuracy, errors
5. Text auto-scrolls to keep current character visible
6. Test ends when time expires OR user completes text
7. If authenticated: Result auto-saved to MongoDB
8. Results screen shows: WPM chart, accuracy, peak WPM, error analysis, keyboard heatmap, and optional AI coaching feedback

**Authentication Flow**:

- JWT-based authentication with 30-day expiration
- Token stored in localStorage
- Axios interceptor adds Bearer token to requests
- AuthContext provides global auth state
- Protected routes redirect to `/auth` if not logged in

## API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/profile` - Get current user profile (Protected)

### Test Results

- `POST /api/results` - Save test result (Protected)
- `GET /api/results/user?page=1&limit=10` - Get user's test history (Protected)
- `GET /api/results/stats` - Get user statistics (Protected)
- `GET /api/results/leaderboard?duration=60&limit=10` - Get leaderboard (Public)

### AI Features

- `POST /api/ai/generate-text` - Generate custom typing practice text based on difficulty, category, and user's error patterns (Public)
- `POST /api/ai/analyze-errors` - Generate personalized coaching feedback based on performance data (Public)

**Request Example** (Save Result):

```json
{
  "wpm": 75,
  "accuracy": 95,
  "correctChars": 150,
  "errors": 8,
  "timeElapsed": 60,
  "duration": 60,
  "peakWPM": 82
}
```

## Implemented Features

✅ **Phase 1**: Frontend UI with WPM calculation
✅ **Phase 2**: Accuracy metrics, WPM progression chart, error analysis
✅ **Phase 3**: Backend integration, JWT authentication, MongoDB persistence, leaderboard
✅ **Phase 4**: Advanced features and AI integration
  - **Multiple difficulty levels**: Beginner, intermediate, and advanced text options
  - **Text categories**: General, programming, and quotes categories
  - **AI-generated practice texts**: Custom typing passages generated using Anthropic API based on user's difficulty, category preferences, and error patterns
  - **Dark/Light theme toggle**: Persistent theme preference with smooth transitions
  - **Typing sound effects**: Audio feedback for correct keystrokes, errors, and completion with toggle control
  - **Keyboard heatmap visualization**: Visual representation showing key press frequency and accuracy
  - **AI-powered error analysis**: Personalized coaching feedback with actionable tips to improve typing performance
  - **Scrollable text display**: Auto-scrolling text container for long AI-generated content

## Recent Improvements & Bug Fixes

**UI/UX Enhancements**:
- Implemented fixed-height scrollable text container (256px) with auto-scroll to keep current character visible
- Widened main layout from `max-w-4xl` to `max-w-6xl` for better readability with long texts
- Added custom scrollbar styling with theme-aware colors (indigo for light mode, lighter indigo for dark mode)
- Smooth scrolling behavior when typing through long passages

**Bug Fixes**:
- Fixed NaN display issues in WPM and time calculations after test completion
- Added comprehensive validation in `calculateWPM()` and `formatTime()` functions
- Improved state initialization to prevent undefined values on component mount
- Enhanced reset functionality with fallback duration (60s) to prevent state errors
- Added debug logging to identify and prevent calculation issues

**Backend Improvements**:
- Upgraded to Claude 3.7 Sonnet model (`claude-3-7-sonnet-20250219`) for improved AI text generation
- Added comprehensive error handling in AI controller with detailed logging
- Implemented API key validation checks before making Anthropic API calls
- Enhanced error responses with specific error details for debugging

**Performance**:
- Optimized character tracking with refs for better scroll performance
- Improved re-render efficiency with proper React hooks dependencies

## Configuration Notes

### Environment Variables

**Backend** (`server/.env`):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_secret_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Frontend** (`client/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

### Other Configuration

- **Tailwind**: Configured in `tailwind.config.js` with content paths set and dark mode enabled (`darkMode: 'class'`)
- **Custom CSS**: `index.css` includes custom scrollbar styling for `.typing-text-scroll` class
- **Vite**: Standard React setup with HMR
- **CORS**: Configured in `server.js` to allow all origins (configure for production)
- **React Router**: BrowserRouter with 3 routes: `/`, `/auth`, `/stats`
- **Anthropic SDK**: `@anthropic-ai/sdk` package for AI text generation and error analysis

## Development Guidelines

- Follow RESTful conventions for API routes
- All protected routes must use `protect` middleware
- JWT tokens expire after 30 days
- User passwords are hashed with bcrypt before storage
- API service in `client/src/services/api.js` handles all backend communication
- Test results automatically save to MongoDB when user is authenticated
- Leaderboard groups by user (shows best score per user per duration)
- Always validate inputs and handle edge cases (NaN, null, undefined) in utility functions
- Use refs for DOM manipulation (scrolling, focus management) instead of direct DOM access
- Implement proper cleanup in useEffect hooks (timers, intervals, event listeners)

## Troubleshooting

### NaN Display Issues
**Symptom**: WPM or time showing "NaN" after completing or resetting a test
**Solution**:
- Check that all state variables are properly initialized with valid default values
- Verify `selectedDuration` and `timeLeft` are numbers before calculations
- Use the enhanced `calculateWPM()` and `formatTime()` functions with NaN protection

### AI Text Generation Fails
**Symptom**: 500 Internal Server Error when clicking "Generate AI Text"
**Solution**:
- Verify `ANTHROPIC_API_KEY` is set in `server/.env`
- Restart the backend server after adding/changing environment variables
- Check server console for detailed error messages
- Ensure you have a valid Anthropic API key from https://console.anthropic.com/settings/keys

### Text Not Auto-Scrolling
**Symptom**: Long texts don't scroll as you type
**Solution**:
- Ensure the text display div has the `typing-text-scroll` class
- Verify `textDisplayRef` and `currentCharRef` are properly attached
- Check that the auto-scroll useEffect has `currentIndex` in dependencies

### Dark Mode Not Persisting
**Symptom**: Theme resets to light mode on page reload
**Solution**:
- ThemeContext automatically saves to localStorage
- Check browser console for localStorage errors
- Verify ThemeProvider wraps the entire app in App.jsx
