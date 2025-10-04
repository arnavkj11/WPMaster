import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomText, difficulties, categories } from '../utils/sampleTexts';
import { calculateWPM, formatTime } from '../utils/calculations';
import { useTypingStats } from '../hooks/useTypingStats';
import { useTypingSounds } from '../hooks/useTypingSounds';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { resultsAPI, aiAPI } from '../services/api';
import Results from './Results';

const TypingTest = () => {
  const [difficulty, setDifficulty] = useState('intermediate');
  const [category, setCategory] = useState('general');
  const [text, setText] = useState(() => getRandomText('intermediate', 'general'));
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [errors, setErrors] = useState(0);
  const [errorCharPositions, setErrorCharPositions] = useState(new Set());
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const wpmTrackingRef = useRef(null);
  const textDisplayRef = useRef(null);
  const currentCharRef = useRef(null);

  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound, playKeystroke, playError, playComplete } = useTypingSounds();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Use advanced stats tracking hook
  const stats = useTypingStats(isStarted, isFinished);

  // Initialize with random text based on preferences
  useEffect(() => {
    setText(getRandomText(difficulty, category));
  }, [difficulty, category]);

  // Auto-scroll to keep current character visible
  useEffect(() => {
    if (currentCharRef.current && textDisplayRef.current) {
      const charElement = currentCharRef.current;
      const containerElement = textDisplayRef.current;

      // Get positions
      const charRect = charElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      // Check if character is out of view
      if (charRect.bottom > containerRect.bottom - 50 || charRect.top < containerRect.top + 50) {
        // Scroll to keep the character in view
        charElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIndex]);

  // Timer logic
  useEffect(() => {
    if (isStarted && !isFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isFinished, timeLeft]);

  // Track WPM every second
  useEffect(() => {
    if (isStarted && !isFinished) {
      wpmTrackingRef.current = setInterval(() => {
        const timeElapsed = selectedDuration - timeLeft;
        if (timeElapsed > 0) {
          stats.recordWPM(correctChars, timeElapsed);
          stats.updateAccuracy(correctChars, totalChars);
        }
      }, 1000);
    }

    return () => {
      if (wpmTrackingRef.current) {
        clearInterval(wpmTrackingRef.current);
      }
    };
  }, [isStarted, isFinished, timeLeft, correctChars, totalChars, selectedDuration]);

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isStarted) {
      setIsStarted(true);
    }

    // Get the last character typed
    const typedChar = value[value.length - 1];
    const expectedChar = text[currentIndex];

    if (value.length > userInput.length) {
      // User typed a new character
      setTotalChars((prev) => prev + 1);

      if (typedChar === expectedChar) {
        setCorrectChars((prev) => prev + 1);
        setCurrentIndex((prev) => prev + 1);
        playKeystroke(true); // Correct keystroke sound
        stats.recordCorrect(expectedChar); // Track correct keystroke

        // Check if user finished typing the text
        if (currentIndex + 1 === text.length) {
          handleFinish();
          playComplete(); // Test completion sound
        }
      } else {
        setErrors((prev) => prev + 1);
        setErrorCharPositions((prev) => new Set([...prev, currentIndex]));
        playError(); // Error sound

        // Record error with character details
        stats.recordError(currentIndex, expectedChar, typedChar);
      }

      // Update accuracy in real-time
      stats.updateAccuracy(correctChars + (typedChar === expectedChar ? 1 : 0), totalChars + 1);
    }

    setUserInput(value);
  };

  // Handle test finish
  const handleFinish = async () => {
    setIsFinished(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save result to backend if user is authenticated
    if (isAuthenticated) {
      try {
        const timeElapsed = selectedDuration - timeLeft;
        const finalWPM = calculateWPM(correctChars, timeElapsed);
        const accuracy = Math.round((correctChars / totalChars) * 100) || 100;

        await resultsAPI.saveResult({
          wpm: finalWPM,
          accuracy,
          correctChars,
          errors,
          timeElapsed,
          duration: selectedDuration,
          peakWPM: stats.peakWPM
        });
      } catch (error) {
        console.error('Failed to save result:', error);
      }
    }
  };

  // Reset test
  const handleReset = (duration = null) => {
    const resetDuration = duration || selectedDuration || 60; // Fallback to 60 if undefined
    console.log('Resetting test with duration:', resetDuration);
    setText(getRandomText(difficulty, category));
    setUserInput('');
    setCurrentIndex(0);
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(resetDuration);
    setSelectedDuration(resetDuration); // Ensure selectedDuration is set
    setCorrectChars(0);
    setTotalChars(0);
    setErrors(0);
    setErrorCharPositions(new Set());
    stats.resetStats();
    inputRef.current?.focus();
  };

  // Change duration
  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    handleReset(duration);
  };

  // Generate AI text
  const handleGenerateAIText = async () => {
    if (isStarted) return;

    setIsGeneratingAI(true);
    try {
      const commonMistakes = stats.getCommonMistakes(5);
      const response = await aiAPI.generateText(difficulty, category, commonMistakes);

      if (response.success && response.text) {
        setText(response.text);
        setUserInput('');
        setCurrentIndex(0);
        setCorrectChars(0);
        setTotalChars(0);
        setErrors(0);
        setErrorCharPositions(new Set());
        stats.resetStats();
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Failed to generate AI text:', error);
      alert('Failed to generate AI text. Please try again or check your API key.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Calculate current WPM with safety check
  const timeElapsed = selectedDuration - timeLeft;
  const currentWPM = calculateWPM(correctChars, timeElapsed);

  // Debug logging
  if (isNaN(currentWPM) || isNaN(timeLeft)) {
    console.warn('NaN detected:', { currentWPM, timeLeft, selectedDuration, correctChars, timeElapsed });
  }

  // Render character with styling
  const renderCharacters = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-400 dark:text-gray-600';

      if (index < currentIndex) {
        // Character already typed
        if (errorCharPositions.has(index)) {
          className = 'text-red-500 bg-red-100 dark:bg-red-900/30'; // Error - show in red
        } else {
          className = 'text-green-500 dark:text-green-400'; // Correct
        }
      } else if (index === currentIndex) {
        className = 'text-gray-900 dark:text-gray-100 bg-yellow-300 dark:bg-yellow-600'; // Current character
      }

      return (
        <span
          key={index}
          className={className}
          ref={index === currentIndex ? currentCharRef : null}
        >
          {char}
        </span>
      );
    });
  };

  if (isFinished) {
    return (
      <Results
        wpm={currentWPM}
        accuracy={Math.round((correctChars / totalChars) * 100) || 100}
        correctChars={correctChars}
        errors={errors}
        timeElapsed={selectedDuration - timeLeft}
        onRestart={handleReset}
        wpmHistory={stats.wpmHistory}
        commonMistakes={stats.getCommonMistakes(5)}
        peakWPM={stats.peakWPM}
        keyPressData={stats.keyPressData}
        difficulty={difficulty}
        category={category}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            ← Home
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Typing Speed Test</h2>
        </div>
        <div className="flex gap-3 items-center">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title={`${soundEnabled ? 'Disable' : 'Enable'} sound effects`}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-yellow-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Hello, {user?.username}!</span>
              <button
                onClick={() => navigate('/stats')}
                className="px-4 py-2 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                My Stats
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Test Your Speed</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isAuthenticated ? 'Your progress is being tracked!' : 'Login to save your results'}
            </p>
          </div>

        {/* Difficulty & Category Selectors */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  disabled={isStarted}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all capitalize ${
                    difficulty === diff
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } ${isStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Category</label>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  disabled={isStarted}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all capitalize ${
                    category === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } ${isStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Duration Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {[30, 60, 120].map((duration) => (
            <button
              key={duration}
              onClick={() => handleDurationChange(duration)}
              disabled={isStarted}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedDuration === duration
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${isStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {duration}s
            </button>
          ))}
        </div>

        {/* AI Text Generation Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerateAIText}
            disabled={isStarted || isGeneratingAI}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              isGeneratingAI
                ? 'bg-gray-400 text-white cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            } ${isStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGeneratingAI ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating AI Text...
              </>
            ) : (
              <>
                ✨ Generate AI Text
              </>
            )}
          </button>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Time Left</p>
            <p className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">WPM</p>
            <p className="text-2xl font-bold text-green-600">{currentWPM}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-orange-600">{stats.currentAccuracy}%</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Errors</p>
            <p className="text-2xl font-bold text-purple-600">{errors}</p>
          </div>
        </div>

        {/* Text Display - Fixed height with scroll */}
        <div
          ref={textDisplayRef}
          className="typing-text-scroll bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6 h-64 overflow-y-auto border-2 border-gray-200 dark:border-gray-700 transition-colors scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          <p className="text-2xl leading-relaxed font-mono select-none">
            {renderCharacters()}
          </p>
        </div>

        {/* Input Field */}
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
            placeholder="Start typing here..."
            autoFocus
          />
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Reset Test
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
