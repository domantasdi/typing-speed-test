const textArea = document.querySelector('#textArea');
const inputField = document.querySelector('.input-field');
const mistakesField = document.querySelector('.mistakes span');
const timeField = document.querySelector('.time span b');
const wpmField = document.querySelector('.wpm span');
const restartButton = document.querySelector("button")

let timer
const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let characterIndex = mistakes =  0;
let isTyping = false;


document.addEventListener("DOMContentLoaded", async function() {
    const data = await loadText();
    const splitText = splitTextToCharacters(data);
    textArrayToDomElements(splitText);

    setInitialFocus(inputField);
    handleTyping(inputField);
    textArea.querySelectorAll('letter')[0].classList.add('active');
})

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
function setInitialFocus(inputField) {
    document.addEventListener('keydown', () => inputField.focus());
    document.addEventListener('click', () => inputField.focus())
}

function handleTyping(inputField) {
    const characters = textArea.querySelectorAll('letter');
    let typedChar;

    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    inputField.addEventListener('input', (event) => {
        typedChar = event.target.value.split('')[characterIndex];
        if (characterIndex < characters.length && timeLeft > 0) {
            if(typedChar == null) {
                characterIndex--;

                if (characters[characterIndex].classList.contains('incorrect')) {
                    mistakes--;
                }

                characters[characterIndex].classList.remove('correct', 'incorrect');
                characters.forEach(letter => letter.classList.remove('active'));
                characters[characterIndex].classList.add('active');
            } else {
                let charToCheck = characters[characterIndex].innerText;

                if(charToCheck === typedChar) {
                    characters[characterIndex].classList.add('correct')
                    console.log('correct');
                } else {
                    characters[characterIndex].classList.add('incorrect')
                    mistakes++;
                    console.log(mistakes);
                    console.log('incorrect');
                }

                characterIndex++;
                characters.forEach(letter => letter.classList.remove('active'));
                characters[characterIndex].classList.add('active');

                // The total number of characters typed is divided by five, as the average English word consists of five characters.
                let wpm = Math.round(((characterIndex - mistakes) / 5) / (MAX_TIME - timeLeft) * 60)

                // If the value of WPM is 0, empty or is equal to Infinity, setting its value to 0.
                wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                mistakesField.innerText = mistakes;
                wpmField.innerText = wpm;
                // wpmField.innerText = characterIndex - mistakes;
            }
        } else {
            inputField.value = '';
            clearInterval(timer)
        }
    })
}

function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        timeField.innerText = timeLeft;
    } else {
        clearInterval(timer);
    }
}

function selectCharacters(textArea) {
    return textArea.querySelectorAll('letter');
}

// Splits the text into an array
function splitTextToCharacters(data) {
    return data.split('')
}

function displayText(data) {
    const characters = data.split('');
    textArea.innerHTML = characters.map(character => `<letter>${character}</letter>`).join('');
    textArea.querySelector('.letter').classList.add('active');
}

function endTyping() {
    inputField.value = '';
    clearInterval(timer);
}

// Converts the given text to letters and encloses each one
// into a <letter> tag
function textArrayToDomElements(data) {
    const textArea = document.querySelector('#textArea')
    data.forEach(letter => {
        let letterTag = `<letter>${letter}</letter>`;
        textArea.innerHTML += letterTag;
    })
}

// This function clears the text area
function clearTextArea() {
    textArea.innerHTML = '';
}

// This function restarts the text
async function restart() {
    clearTextArea()
    const data = await loadText();
    const splitText = splitTextToCharacters(data);
    textArrayToDomElements(splitText);
    inputField.value = '';
    textArea.querySelectorAll('letter')[0].classList.add('active');
    let timer, MAX_TIME = 60;
    timer = setInterval(initTimer, 1000);
    clearInterval(timer);
    resetFields()
    setInitialFocus()
}

function resetFields() {
    timeLeft = MAX_TIME;
    characterIndex = 0;
    mistakes = 0;
    isTyping = false;
    timeField.innerText = timeLeft;
    mistakesField.innerText = 0;
    wpmField.innerText = 0;
}