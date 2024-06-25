//This file will handle all event listeners and their callbacks.

import { fetchTransactions, deleteTransaction, saveTransaction, exportCsv } from './api.js';
import { getElement, createElement, updateElementText } from './dom.js';
import { updateTotal } from './utils.js';

export function handleNewEntry(entriesContainer, entryTemplate) {
    const entry = entryTemplate.cloneNode(true);
    entry.classList.add("new-entry-row");
    const deleteButton = entry.querySelector(".delete-entry");
    deleteButton.addEventListener("click", () => entry.remove());
    entriesContainer.appendChild(entry);
}

export async function handleSave(entriesContainer, saveButton) {
    const entries = entriesContainer.querySelectorAll("tr.new-entry-row");
    for (const entry of entries) {
        const transaction = {
            date: entry.querySelector(".input-date").value,
            description: entry.querySelector(".input-description").value,
            category: entry.querySelector(".input-category").value,
            type: entry.querySelector(".input-type").value,
            amount: parseFloat(entry.querySelector(".input-amount").value),
        };
        const id = entry.dataset.id;
        await saveTransaction(transaction, id);
    }
    await fetchTransactions();
    saveButton.classList.remove("save-saving");
}

export async function handleDeleteTransaction(id, entry) {
    await deleteTransaction(id);
    entry.classList.add("fade-out");
    entry.addEventListener("animationend", () => {
        entry.remove();
        updateTotal();
    });
}

export async function handleExportCsv() {
    try {
        const blob = await exportCsv();
        const url = window.URL.createObjectURL(blob);
        const a = createElement('a', [], { href: url, download: 'transactions.csv' });
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error("Error exporting CSV:", error);
    }
}

export function handleThemeToggle() {
    document.body.classList.toggle("dark-mode");
}

export async function handleFetchTransactions(entriesContainer, entryTemplate) {
    const transactions = await fetchTransactions();
    entriesContainer.innerHTML = "";
    transactions.forEach(transaction => {
        const entry = entryTemplate.cloneNode(true);
        entry.classList.add("new-entry-row");
        entry.querySelector(".input-date").value = new Date(transaction.date).toISOString().split("T")[0];
        entry.querySelector(".input-description").value = transaction.description;
        entry.querySelector(".input-category").value = transaction.category.toLowerCase();
        entry.querySelector(".input-type").value = transaction.type.toLowerCase();
        entry.querySelector(".input-amount").value = transaction.amount;
        entry.dataset.id = transaction.id;

        const deleteButton = entry.querySelector(".delete-entry");
        deleteButton.addEventListener("click", () => handleDeleteTransaction(transaction.id, entry));

        entriesContainer.appendChild(entry);
    });
    updateTotal();
}
