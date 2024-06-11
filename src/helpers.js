import { inputField, timeField, mistakesField, wpmField, accuracyField, timestamp, restartButton } from './domElements.js';
import { updateTable, writeResultsToStorage } from './storage.js';
import { tableData, tableArray } from './domElements.js';

let timer;
const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let characterIndex = 0;
let mistakes = 0;
let isTyping = false;

/// A function, hanling typing itself.
/// The input field here listens to events and processes them
export function handleTyping() {
    const characters = textArea.querySelectorAll('letter');
    handleEnterRestart();
    inputField.addEventListener('input', (event) => {
        processInput(event, characters);
    });
}

/// Handles the restart button using the Enter key
export function handleEnterRestart() {
    document.addEventListener('keydown', function(event) {
        if (event.code == 'Enter') {
            restartButton.click();
        }
    });
}

/// Re-enables the input field and focuses on it on a click or a keydown event
export function setInitialFocus() {
    inputField.disabled = false;
    document.addEventListener('keydown', () => inputField.focus());
    document.addEventListener('click', () => inputField.focus());
}


/// Processes the input event
export function processInput(event, characters) {
    calculateAccuracy();

    /// Updates the timer every second if the user has started typing
    if (!isTyping && timeLeft > 0) {
        timer = setInterval(updateTimer, 1000);
        isTyping = true;
    }

    const typedChar = event.target.value.split('')[characterIndex];

    /// Handles backspace or other character inputs
    if (typedChar == null) {
        handleBackspace(characters);
    } else {
        handleCharacterInput(typedChar, characters);
    }

    /// Ends the handling process if there are no more characters to type
    /// or if the time left is less or equal to zero.
    if (characterIndex >= characters.length || timeLeft == 0) {
        endTyping();
    }
}

/// Ends the typing by clearing out the input field and disabling it, clearing the
/// interval, calculating wpm, accuracy, performance the moment the typing ends,
/// saves the results to the storage and updates the table
export function endTyping() {
    inputField.value = '';
    inputField.disabled = true;
    clearInterval(timer);
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    const performance = calculatePerformance(wpm);
    const testResults = {
        'timestamp': timestamp,
        'mistakes': mistakes,
        'wpm': wpm,
        'accuracy': accuracy,
        'performance': performance,
    };
    writeResultsToStorage(testResults);
    updateTable(timestamp, mistakes, wpm, accuracy, performance);
}

/// Handles the backspace
function handleBackspace(characters) {
    characterIndex--;
    if (characters[characterIndex].classList.contains('incorrect')) {
        mistakes--;
    }
    characters[characterIndex].classList.remove('correct', 'incorrect');
    updateActiveCharacter(characters);
}

/// Checks the character to check and compares it to the typed character
/// If they match, adds the 'correct' class to it;
/// If they don't, adds the 'incorrect' class and increases the mistakes counter
function handleCharacterInput(typedChar, characters) {
    const charToCheck = characters[characterIndex].innerText;
    if (charToCheck === typedChar) {
        characters[characterIndex].classList.add('correct');
    } else {
        characters[characterIndex].classList.add('incorrect');
        mistakes++;
    }
    characterIndex++;
    updateActiveCharacter(characters);
    updateStats();
}

/// Updates the active character by adding the blinker
function updateActiveCharacter(characters) {
    characters.forEach(letter => letter.classList.remove('active'));
    if (characterIndex < characters.length) {
        characters[characterIndex].classList.add('active');
    }
}

/// Updates the stats by calculating WPM, Accuracy and mistakes
function updateStats() {
    const wpm = calculateWPM();
    mistakesField.innerText = mistakes;
    if (wpm === Infinity || !wpm) {
        wpmField.innerText = 0;
    } else {
        wpmField.innerText = wpm;
    }
    const accuracy = calculateAccuracy();
    accuracyField.innerText = `${accuracy} %`;
}

/// Keeps decrementing the timer and updating the DOM timer field
/// or ends typing if the timer reaches 0
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeField.innerText = timeLeft;
    } else {
        clearInterval(timer);
        endTyping();
    }
}

/// Calucaltes the performance by comparing the current WPM with
/// the previous attempt WPM. The first attempt will always have
/// the performance value equal to '–'
function calculatePerformance(wpm) {
    if (!tableData) {
        return '–';
    }
    let previousWpmIndex = tableArray.length - 1;
    let finalScore = wpm - tableArray[previousWpmIndex].wpm;
    return finalScore;
}

/// Calculates the date based on the timestamp
export function calculateDate(timestamp) {
    return new Date(timestamp).toLocaleString('lt');
}


/// Calculates the accuracy by checking how many characters were
/// typed correctly, dividing it by the current character index and
/// expressing the value in %
function calculateAccuracy() {
    let correct = document.querySelectorAll('.correct');
    let correctCount = correct.length;
    return Math.round((correctCount / characterIndex) * 100);
}

/// Calculates the words per minute by calculating the elapsed time in minutes,
/// typed words (disregarding the mistakes) and rounding it up.
function calculateWPM() {
    const elapsedMinutes = (MAX_TIME - timeLeft) / 60;
    const typedWords = (characterIndex - mistakes) / 5;
    return Math.round(typedWords / elapsedMinutes) || 0;
}

/// Handles the ESC key reset
export function handleEscReset() {
    document.addEventListener('keydown', function (event) {
        if (event.code == 'Escape') {
            resetText();
        }
    });
}

/// Resets the text by plugging in the default values once again
export function resetText() {
    clearInterval(timer);
    timeLeft = MAX_TIME;
    characterIndex = 0;
    mistakes = 0;
    isTyping = false;
    inputField.value = '';
    inputField.disabled = false;
    timeField.innerText = timeLeft;
    mistakesField.innerText = mistakes;
    wpmField.innerText = 0;
    accuracyField.innerText = '0 %';
    const characters = textArea.querySelectorAll('letter');
    characters.forEach(letter => letter.classList.remove('correct', 'incorrect', 'active'));
    if (characters.length > 0) {
        characters[0].classList.add('active');
    }
}