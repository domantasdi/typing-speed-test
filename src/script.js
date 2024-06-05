const textArea = document.querySelector('#textArea');
const inputField = document.querySelector('.input-field');
const mistakesField = document.querySelector('.mistakes span');
const timeField = document.querySelector('.time span b');
const wpmField = document.querySelector('.wpm span');
const accuracyField = document.querySelector('.accuracy span');
const timestamp = Date.now();
const table = document.querySelector('#data-grid .table-contents');


let timer
const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let characterIndex = 0;
let mistakes = 0;
let isTyping = false;


document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {
    console.log(isTyping);
    if (inputField !== '') {
        clearTextInput();
    }
    setInitialFocus();
    const data = await loadText();
    displayText(data);
    handleTyping();
}


function updateTable(timestamp, mistakes, wpm, accuracy) {
    let row = table.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.innerText = calculateDate(timestamp);
    cell2.innerText = mistakes;
    cell3.innerText = wpm;
    cell4.innerText = accuracy;
    cell5.innerText = '0';
}


// Asynchronously loads the text
async function loadText() {
    try {
        const response = await fetch('http://metaphorpsum.com/paragraphs/1');
        return await response.text();
    } catch(error) {
        console.error('Error fetching text:', error);
    }
}

// Focuses the input field on any key down
function setInitialFocus() {
    document.addEventListener('keydown', () => inputField.focus());
    document.addEventListener('click', () => inputField.focus())
}


function updateStats() {
    const wpm = calculateWPM();
    mistakesField.innerText = mistakes;
    if (wpm == Infinity || !wpm) {
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

function calculateDate(timestamp) {
    return new Date(timestamp).toLocaleString('lt')
}

function calculateAccuracy() {
    let correct = document.querySelectorAll('.correct');
    let correctCount = correct.length;
    return Math.round((correctCount / characterIndex) * 100);
}


function calculateWPM() {
    const elapsedMinutes = (MAX_TIME - timeLeft) / 60;
    // The average length of a word in EN is 5, apparently
    const typedWords = (characterIndex - mistakes) / 5;
    return Math.round(typedWords / elapsedMinutes) || 0;
}


function handleTyping() {
    const characters = textArea.querySelectorAll('letter');

    inputField.addEventListener('input', (event) => {
        processInput(event, characters);
    });
}

function endTyping() {
    inputField.value = '';
    clearInterval(timer);
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy()
    updateTable(timestamp, mistakes, wpm, accuracy);
}

function processInput(event, characters) {
    calculateAccuracy();

    // Calls the updateTimer function every 1 second
    if (!isTyping && timeLeft > 0) {
        timer = setInterval(updateTimer, 1000);
        isTyping = true;
    }

    // Declares the character
    const typedChar = event.target.value.split('')[characterIndex];

    // Handles backspace or other character input
    if (typedChar == null) {
        handleBackspace(characters);
    } else {
        handleCharacterInput(typedChar, characters);
    }

    // Handles the end of the test, whichever comes first.
    if (characterIndex >= characters.length || timeLeft <= 0) {
        endTyping();
    }
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


function displayText(data) {
    const characters = data.split('');
    textArea.innerHTML = characters.map(character => `<letter>${character}</letter>`).join('');
    setTimeout(
        () => {
            textArea.querySelector('letter').classList.add('active')
        }, 10);
}




function clearTextInput() {
    setTimeout(
        () => {
            inputField.blur()
        }, 1);
    inputField.value = '';
}


// This function restarts the text
// function restart() {
//     resetFields();
//     clearInterval(timer);
//     clearTextInput();
//     clearTextArea();
//     initialize();
// }

// function resetFields() {
//     timeLeft = MAX_TIME;
//     characterIndex = 0;
//     mistakes = 0;
//     isTyping = false;
//     timeField.innerText = timeLeft;
//     mistakesField.innerText = 0;
//     wpmField.innerText = 0;
// }