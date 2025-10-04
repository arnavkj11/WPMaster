// Categorized texts by difficulty and category
export const textLibrary = {
  beginner: {
    general: [
      "The cat sat on the mat.",
      "I love to read books every day.",
      "The sun shines bright in the sky.",
      "She likes to play with her dog.",
      "We eat dinner at six every night."
    ],
    quotes: [
      "Be yourself; everyone else is already taken.",
      "The journey of a thousand miles begins with one step.",
      "In the middle of difficulty lies opportunity.",
      "Stay hungry. Stay foolish.",
      "Less is more."
    ],
    programming: [
      "let x = 10;",
      "function add(a, b) { return a + b; }",
      "const name = 'John';",
      "if (true) { console.log('Hello'); }",
      "for (let i = 0; i < 10; i++) { }"
    ]
  },
  intermediate: {
    general: [
      "The quick brown fox jumps over the lazy dog near the riverbank while the sun sets in the distance.",
      "Practice makes perfect when it comes to improving your typing speed and accuracy over time.",
      "The beauty of nature lies in its simplicity and the harmony it brings to our daily lives.",
      "Technology has revolutionized the way we communicate, work, and interact with the world around us.",
      "Success is not final, failure is not fatal, it is the courage to continue that counts in life."
    ],
    quotes: [
      "The only way to do great work is to love what you do.",
      "Innovation distinguishes between a leader and a follower.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "What we think, we become. What we feel, we attract. What we imagine, we create.",
      "Life is what happens when you're busy making other plans."
    ],
    programming: [
      "Programming is the art of telling another human what one wants the computer to do.",
      "const users = data.filter(user => user.active).map(user => user.name);",
      "async function fetchData() { const response = await fetch('/api/users'); return response.json(); }",
      "In the world of programming, there are no shortcuts to mastery, only dedication and continuous learning.",
      "const debounce = (fn, delay) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };"
    ]
  },
  advanced: {
    general: [
      "Quantum mechanics introduces a fundamental uncertainty principle that challenges classical deterministic physics, revealing that particles exist in superposition states until observed, fundamentally altering our understanding of reality at the subatomic level.",
      "The socioeconomic implications of artificial intelligence and machine learning technologies are multifaceted, encompassing labor market disruptions, ethical considerations regarding algorithmic bias, and profound questions about human autonomy in an increasingly automated world.",
      "Neuroplasticity demonstrates the brain's remarkable capacity to reorganize itself by forming new neural connections throughout life, challenging previously held beliefs about cognitive development and offering hope for rehabilitation following neurological injuries.",
      "The intersection of quantum computing and cryptography presents both unprecedented opportunities and existential threats to current cybersecurity paradigms, necessitating the development of quantum-resistant cryptographic algorithms to safeguard sensitive information.",
      "Biogeochemical cycles regulate the Earth's climate through complex feedback mechanisms involving atmospheric composition, oceanic circulation patterns, and terrestrial ecosystem dynamics, highlighting the delicate balance maintaining our planet's habitability."
    ],
    quotes: [
      "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
      "The reasonable man adapts himself to the world; the unreasonable one persists in trying to adapt the world to himself. Therefore all progress depends on the unreasonable man.",
      "I have not failed. I've just found ten thousand ways that won't work. Each failure taught me something I needed to know.",
      "The significant problems we face cannot be solved at the same level of thinking we were at when we created them.",
      "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change."
    ],
    programming: [
      "class EventEmitter { constructor() { this.events = {}; } on(event, listener) { if (!this.events[event]) this.events[event] = []; this.events[event].push(listener); } emit(event, ...args) { if (this.events[event]) this.events[event].forEach(listener => listener(...args)); } }",
      "The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically, promoting loose coupling between interacting objects.",
      "function* fibonacci() { let [prev, curr] = [0, 1]; while (true) { yield curr; [prev, curr] = [curr, prev + curr]; } } const fib = fibonacci(); console.log([...Array(10)].map(() => fib.next().value));",
      "const memoize = (fn) => { const cache = new Map(); return (...args) => { const key = JSON.stringify(args); if (cache.has(key)) return cache.get(key); const result = fn(...args); cache.set(key, result); return result; }; };",
      "Type systems in strongly-typed languages provide compile-time guarantees about program behavior, preventing entire categories of runtime errors through static analysis, while dynamic typing offers flexibility at the cost of potential runtime failures."
    ]
  }
};

// Legacy array for backward compatibility
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

export const difficulties = ['beginner', 'intermediate', 'advanced'];
export const categories = ['general', 'quotes', 'programming'];

export const getRandomText = (difficulty = 'intermediate', category = 'general') => {
  const texts = textLibrary[difficulty]?.[category];
  if (!texts || texts.length === 0) {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  }
  return texts[Math.floor(Math.random() * texts.length)];
};

export const getTextByPreferences = (difficulty, category) => {
  return getRandomText(difficulty, category);
};
