import { textArea } from './domElements.js';
import { WORD_COUNT } from './config.js'

/// Loads the text from the Metaphorsum project
export async function loadText() {
    try {
        const response = await fetch(`https://random-word-form.herokuapp.com/random/noun?count=${WORD_COUNT}`);
        const formattedResponse = await response.text()
        let formattedText = JSON.parse(formattedResponse).join(' ');
        displayText(formattedText)
    } catch (error) {
        console.error('Error fetching text:', error);
    }
}

/// Displays the text by splitting the received paragraph
/// into separate letters and surrounding them with a <letter> tag
function displayText(data) {
    const characters = data.split('');
    textArea.innerHTML = characters.map(character => `<letter>${character}</letter>`).join('');
    setTimeout(() => {
        textArea.querySelector('letter').classList.add('active');
    }, 10);
}
