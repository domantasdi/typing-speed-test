import { textArea } from './domElements.js';
import { WORD_COUNT } from './config.js'

/// Loads and displays the text
export async function loadText() {
    try {
        const response = await fetch(`https://random-word-form.herokuapp.com/random/noun?count=${WORD_COUNT}`);
        const formattedResponse = await response.text();
        let parsedText = parseText(formattedResponse)
        let uppercasedText = capitalizeFirstLetter(parsedText);
        let formattedText = formatText(uppercasedText)
        displayText(formattedText);
    } catch (error) {
        console.error('Error fetching text:', error);
    }
}

function parseText(str) {
    return JSON.parse(str);
}

function formatText (array) {
    return array.join(' ');
}

function capitalizeFirstLetter(array) {
    let firstItem = array[0];
    array[0] = firstItem.charAt(0).toUpperCase() + firstItem.slice(1)
    return array
}

/// Displays the text
function displayText(data) {
    const characters = data.split('');
    textArea.innerHTML = characters.map(character => `<letter>${character}</letter>`).join('');
    setTimeout(() => {
        textArea.querySelector('letter').classList.add('active');
    }, 10);
}
