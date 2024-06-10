import { inputField, timeField, mistakesField, wpmField, accuracyField, timestamp } from './domElements.js';
import { updateTable, writeResultsToStorage } from './storage.js';
import { tableData, tableArray } from './domElements.js';

let timer;
const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let characterIndex = 0;
let mistakes = 0;
let isTyping = false;

export function handleTyping() {
    const characters = textArea.querySelectorAll('letter');
    handleEnterRestart();
    inputField.addEventListener('input', (event) => {
        processInput(event, characters);
    });
}

export function handleEnterRestart() {
    document.addEventListener('keydown', function(event) {
        if (event.code == 'Enter') {
            restartButton.click();
        }
    });
}

export function setInitialFocus() {
    inputField.disabled = false;
    document.addEventListener('keydown', () => inputField.focus());
    document.addEventListener('click', () => inputField.focus());
}

export function processInput(event, characters) {
    calculateAccuracy();

    if (!isTyping && timeLeft > 0) {
        timer = setInterval(updateTimer, 1000);
        isTyping = true;
    }

    const typedChar = event.target.value.split('')[characterIndex];

    if (typedChar == null) {
        handleBackspace(characters);
    } else {
        handleCharacterInput(typedChar, characters);
    }

    if (characterIndex >= characters.length || timeLeft <= 0) {
        endTyping();
    }
}

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

function handleBackspace(characters) {
    characterIndex--;
    if (characters[characterIndex].classList.contains('incorrect')) {
        mistakes--;
    }
    characters[characterIndex].classList.remove('correct', 'incorrect');
    updateActiveCharacter(characters);
}

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

function updateActiveCharacter(characters) {
    characters.forEach(letter => letter.classList.remove('active'));
    if (characterIndex < characters.length) {
        characters[characterIndex].classList.add('active');
    }
}

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

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeField.innerText = timeLeft;
    } else {
        clearInterval(timer);
    }
}

function calculatePerformance(wpm) {
    if (!tableData) {
        return '–';
    }
    let previousWpmIndex = tableArray.length - 1;
    let finalScore = wpm - tableArray[previousWpmIndex].wpm;
    return finalScore;
}

export function calculateDate(timestamp) {
    return new Date(timestamp).toLocaleString('lt');
}

function calculateAccuracy() {
    let correct = document.querySelectorAll('.correct');
    let correctCount = correct.length;
    return Math.round((correctCount / characterIndex) * 100);
}

function calculateWPM() {
    const elapsedMinutes = (MAX_TIME - timeLeft) / 60;
    const typedWords = (characterIndex - mistakes) / 5;
    return Math.round(typedWords / elapsedMinutes) || 0;
}
