import { inputField } from './domElements.js';
import { loadText, displayText } from './textLoader.js';
import { handleTyping, setInitialFocus, handleEscReset } from './helpers.js';
import { populateTable } from './storage.js';

/// Initial function
export async function initialize() {
    if (inputField !== '') {
        clearTextInput();
    }
    setInitialFocus();
    const data = await loadText();
    displayText(data);
    populateTable();
    handleTyping();
    handleEscReset();
}

/// Clears the text input if it's not clear
function clearTextInput() {
    setTimeout(() => {
        inputField.blur();
    }, 1);
    inputField.value = '';
}
