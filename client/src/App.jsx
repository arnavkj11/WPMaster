import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import TypingTest from './components/TypingTest';
import AuthPage from './pages/AuthPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test" element={<TypingTest />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
