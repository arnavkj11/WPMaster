/**
 * Calculate Words Per Minute (WPM)
 * Standard: 5 characters = 1 word
 * @param {number} characters - Number of correctly typed characters
 * @param {number} timeInSeconds - Time elapsed in seconds
 * @returns {number} WPM rounded to nearest integer
 */
export const calculateWPM = (characters, timeInSeconds) => {
  if (!characters || !timeInSeconds || timeInSeconds === 0 || isNaN(characters) || isNaN(timeInSeconds)) return 0;
  const minutes = timeInSeconds / 60;
  const words = characters / 5;
  const wpm = Math.round(words / minutes);
  return isNaN(wpm) ? 0 : wpm;
};

/**
 * Calculate typing accuracy percentage
 * @param {number} correctChars - Number of correct characters typed
 * @param {number} totalChars - Total characters typed (including errors)
 * @returns {number} Accuracy percentage (0-100)
 */
export const calculateAccuracy = (correctChars, totalChars) => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

/**
 * Format time display (MM:SS)
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || seconds === undefined) {
    return '00:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
