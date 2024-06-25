//This file will initialize the app and add event listeners.


import { handleNewEntry, handleSave, handleExportCsv, handleThemeToggle, handleFetchTransactions } from './eventHandlers.js';
import { getElement } from './dom.js';

document.addEventListener("DOMContentLoaded", () => {
    const entriesContainer = getElement(".entries");
    const newEntryButton = getElement(".new-entry");
    const saveButton = getElement(".save");
    const exportCsvButton = getElement(".export-csv");
    const entryTemplate = getElement(".entry-template").cloneNode(true);
    entryTemplate.classList.remove("entry-template");
    const themeToggle = getElement("#theme-toggle");

    newEntryButton.addEventListener("click", () => handleNewEntry(entriesContainer, entryTemplate));
    saveButton.addEventListener("click", () => handleSave(entriesContainer, saveButton));
    exportCsvButton.addEventListener("click", handleExportCsv);
    themeToggle.addEventListener("change", handleThemeToggle);

    handleFetchTransactions(entriesContainer, entryTemplate);
});
