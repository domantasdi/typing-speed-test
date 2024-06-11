import { table } from './domElements.js';
import { tableData, tableArray } from './domElements.js';
import { calculateDate } from './helpers.js';

/// Populates the data table with the results
/// from the data array function
export function populateTable() {
    if (!tableData) return;
    tableArray.forEach(row => {
        const { timestamp, mistakes, wpm, accuracy, performance } = row;
        updateTable(calculateDate(timestamp), mistakes, wpm, accuracy, performance);
    });
}

/// Updates the table with the results
export function updateTable(timestamp, mistakes, wpm, accuracy, performance) {
    let row = table.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.innerText = calculateDate(timestamp);
    cell2.innerText = mistakes;
    cell3.innerText = wpm;
    cell4.innerText = accuracy;
    cell5.innerText = performance;

    if (performance === '–') {
        cell5.innerText = '–';
    } else if (performance === 0) {
        cell5.classList.add('even');
        cell5.innerText = `Even`;
    } else if (performance < 0) {
        cell5.classList.add('worse');
        cell5.innerText = `Worse by ${Math.abs(performance)}`;
    } else {
        cell5.classList.add('better');
        cell5.innerText = `Better by ${performance}`;
    }
}

/// Writes the results to the local storage. If the storage is
/// empty (i.e. the first attempt), the value is set to an
/// empty array.
export function writeResultsToStorage(testResults) {
    let localResults = localStorage.getItem('tableData');
    if (localResults === null) {
        localResults = [];
    } else {
        localResults = JSON.parse(localResults);
    }
    localResults.push(testResults);
    localStorage.setItem('tableData', JSON.stringify(localResults));
}
