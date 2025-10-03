export const sampleTexts = [
  "The quick brown fox jumps over the lazy dog near the riverbank while the sun sets in the distance.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "Practice makes perfect when it comes to improving your typing speed and accuracy over time.",
  "The beauty of nature lies in its simplicity and the harmony it brings to our daily lives.",
  "Technology has revolutionized the way we communicate, work, and interact with the world around us.",
  "Success is not final, failure is not fatal, it is the courage to continue that counts in life.",
  "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
  "The only way to do great work is to love what you do and keep pushing your boundaries every single day.",
  "In the world of programming, there are no shortcuts to mastery, only dedication and continuous learning.",
  "Typing speed is an essential skill in the modern digital age where efficiency and productivity matter most."
];

export const getRandomText = () => {
  return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
};
