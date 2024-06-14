import { inputField, textArea } from './domElements.js';
import { loadText } from './textLoader.js';
import { handleTyping } from './helpers.js';
import { populateTable } from './storage.js';
import { MAX_TIME } from './config.js';
import { timeField } from './domElements.js';

/// Initial function
async function initialize() {
    timeField.innerText = MAX_TIME;
    textArea.innerText = 'Please wait...';
    if (inputField !== '') {
        clearTextInput();
    }
    setInitialFocus();
    await loadText();
    populateTable();
    handleTyping();
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
}

/// Initializes once DOM content is loaded
document.addEventListener("DOMContentLoaded", initialize);