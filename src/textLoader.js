import { textArea } from './domElements.js';

/// Loads the text from the Metaphorsum project
export async function loadText() {
    try {
        const response = await fetch('http://metaphorpsum.com/paragraphs/1');
        return await response.text();
    } catch (error) {
        console.error('Error fetching text:', error);
    }
}

/// Displays the text by splitting the received paragraph
/// into separate letters and surrounding them with a <letter> tag
export function displayText(data) {
    const characters = data.split('');
    textArea.innerHTML = characters.map(character => `<letter>${character}</letter>`).join('');
    setTimeout(() => {
        textArea.querySelector('letter').classList.add('active');
    }, 10);
}
