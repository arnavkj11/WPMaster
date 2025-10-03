import { useState, useEffect, useRef } from 'react';
import { calculateWPM } from '../utils/calculations';

/**
 * Custom hook for tracking detailed typing statistics
 * Tracks WPM progression, errors, accuracy over time
 */
export const useTypingStats = (isStarted, isFinished) => {
  const [wpmHistory, setWpmHistory] = useState([]);
  const [errorPositions, setErrorPositions] = useState([]);
  const [mistakeMap, setMistakeMap] = useState({}); // { expectedChar: { typedChar: count } }
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const [peakWPM, setPeakWPM] = useState(0);

  const statsIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Start tracking when test begins
  useEffect(() => {
    if (isStarted && !isFinished) {
      startTimeRef.current = Date.now();

      // Track WPM every second
      statsIntervalRef.current = setInterval(() => {
        // This will be populated by external calls to updateStats
      }, 1000);
    }

    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, [isStarted, isFinished]);

  // Record WPM at current moment
  const recordWPM = (correctChars, timeElapsed) => {
    const wpm = calculateWPM(correctChars, timeElapsed);
    setWpmHistory(prev => [...prev, { time: timeElapsed, wpm }]);

    if (wpm > peakWPM) {
      setPeakWPM(wpm);
    }
  };

  // Record an error with position and characters
  const recordError = (position, expectedChar, typedChar) => {
    setErrorPositions(prev => [...prev, position]);

    // Track mistake patterns
    setMistakeMap(prev => {
      const key = expectedChar;
      const mistakes = prev[key] || {};
      mistakes[typedChar] = (mistakes[typedChar] || 0) + 1;
      return { ...prev, [key]: mistakes };
    });
  };

  // Update current accuracy
  const updateAccuracy = (correctChars, totalChars) => {
    if (totalChars === 0) {
      setCurrentAccuracy(100);
    } else {
      setCurrentAccuracy(Math.round((correctChars / totalChars) * 100));
    }
  };

  // Get most common mistakes
  const getCommonMistakes = (limit = 5) => {
    const mistakes = [];

    Object.entries(mistakeMap).forEach(([expected, typed]) => {
      Object.entries(typed).forEach(([typedChar, count]) => {
        mistakes.push({ expected, typed: typedChar, count });
      });
    });

    return mistakes
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  // Reset all stats
  const resetStats = () => {
    setWpmHistory([]);
    setErrorPositions([]);
    setMistakeMap({});
    setCurrentAccuracy(100);
    setPeakWPM(0);
    startTimeRef.current = null;
  };

  return {
    wpmHistory,
    errorPositions,
    mistakeMap,
    currentAccuracy,
    peakWPM,
    recordWPM,
    recordError,
    updateAccuracy,
    getCommonMistakes,
    resetStats
  };
};
