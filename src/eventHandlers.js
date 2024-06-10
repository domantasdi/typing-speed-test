import { inputField } from './domElements.js';
import { loadText, displayText } from './textLoader.js';
import { handleTyping, setInitialFocus } from './helpers.js';
import { populateTable } from './storage.js';

export async function initialize() {
    if (inputField !== '') {
        clearTextInput();
    }
    setInitialFocus();
    const data = await loadText();
    displayText(data);
    populateTable();
    handleTyping();
}

function clearTextInput() {
    setTimeout(() => {
        inputField.blur();
    }, 1);
    inputField.value = '';
}
