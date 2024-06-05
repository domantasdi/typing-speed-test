const textArea = document.querySelector('#textArea');
const inputField = document.querySelector('.input-field');
const mistakesField = document.querySelector('.mistakes span');
const timeField = document.querySelector('.time span b');
const wpmField = document.querySelector('.wpm span');

let timer
const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let characterIndex = 0;
let mistakes = 0;
let isTyping = false;


document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {
    if (inputField !== '') {
        clearTextInput();
    }
    setInitialFocus();
    const data = await loadText();
    displayText(data);
    handleTyping();
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
    wpmField.innerText = wpm;
}


function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeField.innerText = timeLeft;
    } else {
        clearInterval(timer);
    }
}


// function calculateAccuracy() {

// }


function calculateWPM() {
    const elapsedMinutes = (MAX_TIME - timeLeft) / 60;
    // The average length of a word in EN is 5, apparently
    const typedWords = (characterIndex - mistakes) / 5;
    return Math.round(typedWords / elapsedMinutes) || 0;
}


function handleTyping() {
    const characters = textArea.querySelectorAll('letter');

    if (!isTyping) {
        timer = setInterval(updateTimer, 1000);
        isTyping = true;
    }

    inputField.addEventListener('input', (event) => {
        processInput(event, characters);
    });
}


function processInput(event, characters) {
    const typedChar = event.target.value.split('')[characterIndex];

    if (characterIndex < characters.length && timeLeft > 0) {
        if (typedChar == null) {
            handleBackspace(characters);
        } else {
            handleCharacterInput(typedChar, characters);
        }
    } else {
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

function endTyping() {
    inputField.value = '';
    clearInterval(timer);
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