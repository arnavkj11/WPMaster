import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import TypingTest from './components/TypingTest';
import AuthPage from './pages/AuthPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TypingTest />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
