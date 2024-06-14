// Constants for all the necessary DOM elements
export const textArea = document.querySelector('#textArea');
export const inputField = document.querySelector('.input-field');
export const mistakesField = document.querySelector('.mistakes span');
export const timeField = document.querySelector('.time span b');
export const wpmField = document.querySelector('.wpm span');
export const accuracyField = document.querySelector('.accuracy span');

/// This shouldn't be here because it won't return the CURRENT time
export const timestamp = Date.now();
export const table = document.querySelector('#data-grid .table-contents');
export const restartButton = document.querySelector('button');

/// These don't really belong here as well
export const tableData = localStorage.getItem('tableData');
export const tableArray = JSON.parse(tableData);