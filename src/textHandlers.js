import { textArea } from './domElements.js';
import { WORD_COUNT } from './config.js';

const FALLBACK_WORDS = ['Hello', 'world', 'this', 'is', 'a', 'typing', 'test', 'please', 'try', 'again'];

/// Loads and displays the text
export async function loadText() {
  try {
    const words = await fetchWords();
    const formattedText = formatWords(words);
    displayText(formattedText);
  } catch (error) {
    console.error('Error fetching text:', error);
    // Use fallback text if API fails
    const formattedText = formatWords(FALLBACK_WORDS);
    displayText(formattedText);
  }
}

/// Fetches words from the API with timeout and validation
async function fetchWords() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${WORD_COUNT}&length=5`, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate response
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid API response format');
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

/// Formats an array of words into display text
function formatWords(words) {
  if (words.length === 0) return '';

  // Capitalize first word and join all words in one efficient operation
  return words.map((word, index) => (index === 0 ? capitalizeWord(word) : word)).join(' ');
}

/// Capitalizes a single word
function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/// Displays the text with character elements
function displayText(text) {
  if (!text) {
    textArea.innerHTML = '<letter class="error">Error loading text. Please refresh the page.</letter>';
    return;
  }

  const characters = text.split('');
  textArea.innerHTML = characters.map(char => `<letter>${char}</letter>`).join('');

  // Add active class to first letter after a brief delay
  requestAnimationFrame(() => {
    const firstLetter = textArea.querySelector('letter');
    if (firstLetter) {
      firstLetter.classList.add('active');
    }
  });
}
