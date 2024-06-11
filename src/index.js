import { inputField } from './domElements.js';
import { loadText, displayText } from './textLoader.js';
import { handleTyping, handleEscReset } from './helpers.js';
import { populateTable } from './storage.js';

/// Initial function
async function initialize() {
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

/// Re-enables the input field and focuses on it on a click or a keydown event
function setInitialFocus() {
    inputField.disabled = false;
    document.addEventListener('keydown', () => inputField.focus());
    document.addEventListener('click', () => inputField.focus());
}

/// Initializes once DOM content is loaded
document.addEventListener("DOMContentLoaded", initialize);