import { useState, useEffect, useRef } from 'react';
import { getRandomText } from '../utils/sampleTexts';
import { calculateWPM, formatTime } from '../utils/calculations';
import { useTypingStats } from '../hooks/useTypingStats';
import Results from './Results';

const TypingTest = () => {
  const [text, setText] = useState('');
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

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const wpmTrackingRef = useRef(null);

  // Use advanced stats tracking hook
  const stats = useTypingStats(isStarted, isFinished);

  // Initialize with random text
  useEffect(() => {
    setText(getRandomText());
  }, []);

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

        // Check if user finished typing the text
        if (currentIndex + 1 === text.length) {
          handleFinish();
        }
      } else {
        setErrors((prev) => prev + 1);
        setErrorCharPositions((prev) => new Set([...prev, currentIndex]));

        // Record error with character details
        stats.recordError(currentIndex, expectedChar, typedChar);
      }

      // Update accuracy in real-time
      stats.updateAccuracy(correctChars + (typedChar === expectedChar ? 1 : 0), totalChars + 1);
    }

    setUserInput(value);
  };

  // Handle test finish
  const handleFinish = () => {
    setIsFinished(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Reset test
  const handleReset = (duration = null) => {
    const resetDuration = duration || selectedDuration;
    setText(getRandomText());
    setUserInput('');
    setCurrentIndex(0);
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(resetDuration);
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

  // Calculate current WPM
  const currentWPM = calculateWPM(correctChars, selectedDuration - timeLeft);

  // Render character with styling
  const renderCharacters = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-400';

      if (index < currentIndex) {
        // Character already typed
        if (errorCharPositions.has(index)) {
          className = 'text-red-500 bg-red-100'; // Error - show in red
        } else {
          className = 'text-green-500'; // Correct
        }
      } else if (index === currentIndex) {
        className = 'text-gray-900 bg-yellow-300'; // Current character
      }

      return (
        <span key={index} className={className}>
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
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Typing Speed Test</h1>
          <p className="text-gray-600">Test your typing speed and accuracy</p>
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
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${isStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {duration}s
            </button>
          ))}
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

        {/* Text Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 min-h-32 border-2 border-gray-200">
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
            className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Start typing here..."
            autoFocus
          />
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Reset Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
