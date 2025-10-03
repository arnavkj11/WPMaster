# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN stack typing speed test application that measures typing speed (WPM), accuracy, and tracks user progress. The project is split into a React frontend (Vite + Tailwind CSS) and an Express backend (MongoDB + Mongoose).

**Current Status**: Phase 3 complete - Full-stack application with authentication, data persistence, and leaderboard functionality.

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
  - `TypingTest.jsx` - Main test component with character tracking, timer, WPM logic, and backend integration
  - `Results.jsx` - Enhanced results display with WPM chart, error analysis, and performance rating
  - `WPMChart.jsx` - SVG-based WPM progression chart component
  - `Leaderboard.jsx` - Global leaderboard with duration filtering
- **pages/** - Page-level components
  - `AuthPage.jsx` - Combined login/register page with tab switcher
  - `StatsPage.jsx` - Personal statistics dashboard with history and charts
- **hooks/** - Custom React hooks
  - `useTypingStats.js` - Advanced stats tracking (WPM history, error patterns, accuracy)
- **utils/** - Helper functions and data
  - `calculations.js` - WPM/accuracy calculations (5 chars = 1 word standard)
  - `sampleTexts.js` - Sample text pool and random text generator
- **services/** - API integration layer
  - `api.js` - Axios-based API service with auth interceptors
- **context/** - React Context
  - `AuthContext.jsx` - Global authentication state management
- **App.jsx** - React Router setup with routes: `/`, `/auth`, `/stats`

### Backend Structure (`server/`)
- **models/** - Mongoose schemas
  - `User.js` - User model with password hashing (bcrypt)
  - `TestResult.js` - Test result model with user reference
- **routes/** - API route definitions
  - `authRoutes.js` - Authentication routes
  - `testResultRoutes.js` - Test result routes
- **controllers/** - Route handler logic
  - `authController.js` - Register, login, profile handlers with JWT generation
  - `testResultController.js` - Save results, get user stats, leaderboard
- **middleware/** - Custom middleware
  - `authMiddleware.js` - JWT verification and route protection
- **config/** - Configuration files
  - `db.js` - MongoDB connection with Mongoose
- **server.js** - Express server entry point
- **.env** - Environment variables (MONGODB_URI, PORT, JWT_SECRET)

### Key Technical Details

**WPM Calculation**: Standard formula where 5 characters = 1 word
```javascript
WPM = (correctChars / 5) / (timeInSeconds / 60)
```

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

**Timer System**: Uses `setInterval` with cleanup in `useEffect`. Countdown starts on first keypress.

**Test Flow**:
1. User selects duration (30s/60s/120s)
2. Typing starts timer and WPM tracking
3. Live stats update: WPM, accuracy, errors
4. Test ends when time expires OR user completes text
5. If authenticated: Result auto-saved to MongoDB
6. Results screen shows: WPM chart, accuracy, peak WPM, error analysis, performance rating

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

## Future Enhancement Ideas

**Phase 4 (Optional)**:
- Multiple difficulty levels (beginner, intermediate, advanced)
- Different text categories (programming, quotes, random words)
- Dark/Light theme toggle
- Typing sound effects
- Keyboard heatmap visualization
- Practice mode with specific problem characters
- Social features (follow users, challenges)

## Configuration Notes

### Environment Variables

**Backend** (`server/.env`):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_secret_key_here
```

**Frontend** (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### Other Configuration
- **Tailwind**: Configured in `tailwind.config.js` with content paths set
- **Vite**: Standard React setup with HMR
- **CORS**: Configured in `server.js` to allow all origins (configure for production)
- **React Router**: BrowserRouter with 3 routes: `/`, `/auth`, `/stats`

## Development Guidelines

- Follow RESTful conventions for API routes
- All protected routes must use `protect` middleware
- JWT tokens expire after 30 days
- User passwords are hashed with bcrypt before storage
- API service in `client/src/services/api.js` handles all backend communication
- Test results automatically save to MongoDB when user is authenticated
- Leaderboard groups by user (shows best score per user per duration)
