document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://localhost:7006/api/transactions";
    const entriesContainer = document.querySelector(".entries");
    const newEntryButton = document.querySelector(".new-entry");
    const saveButton = document.querySelector(".save");
    const exportCsvButton = document.querySelector(".export-csv");
    const totalElement = document.querySelector(".total");
    const entryTemplate = document.querySelector(".entry-template").cloneNode(true);
    entryTemplate.classList.remove("entry-template");
    const themeToggle = document.getElementById("theme-toggle");

    async function fetchTransactions() {
        try {
            const response = await fetch(API_URL);
            const transactions = await response.json();
            entriesContainer.innerHTML = "";
            transactions.forEach(transaction => addTransactionToTable(transaction));
            updateTotal();
        } catch (error) {
            console.error(error);
        }
    }

    function addTransactionToTable(transaction) {
        const entry = entryTemplate.cloneNode(true);
        entry.classList.add("new-entry-row");
        entry.querySelector(".input-date").value = new Date(transaction.date).toISOString().split("T")[0];
        entry.querySelector(".input-description").value = transaction.description;
        entry.querySelector(".input-category").value = transaction.category.toLowerCase();
        entry.querySelector(".input-type").value = transaction.type.toLowerCase();
        entry.querySelector(".input-amount").value = transaction.amount;
        entry.dataset.id = transaction.id;

        const deleteButton = entry.querySelector(".delete-entry");
        deleteButton.addEventListener("click", () => deleteTransaction(transaction.id, entry));

        entriesContainer.appendChild(entry);
    }

    async function deleteTransaction(id, entry) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            entry.classList.add("fade-out");
            entry.addEventListener("animationend", () => {
                entry.remove();
                updateTotal();
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function saveTransaction(entry) {
        const transaction = {
            date: entry.querySelector(".input-date").value,
            description: entry.querySelector(".input-description").value,
            category: entry.querySelector(".input-category").value,
            type: entry.querySelector(".input-type").value,
            amount: parseFloat(entry.querySelector(".input-amount").value),
        };

        const id = entry.dataset.id;
        let method = 'POST';
        let url = API_URL;

        if (id) {
            method = 'PUT';
            url = `${API_URL}/${id}`;
        }

        try {
            saveButton.classList.add("save-saving");
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            if (response.ok) {
                const savedTransaction = await response.json();
                if (!id) {
                    entry.dataset.id = savedTransaction.id;
                }
                updateTotal();
                saveButton.classList.remove("save-saving");
            } else {
                console.error('Failed to save transaction', response.statusText);
            }
        } catch (error) {
            console.error(error);
            saveButton.classList.remove("save-saving");
        }
    }

    function updateTotal() {
        const entries = entriesContainer.querySelectorAll("tr");
        let total = 0;

        entries.forEach(entry => {
            const amount = parseFloat(entry.querySelector(".input-amount").value) || 0;
            const type = entry.querySelector(".input-type").value;

            if (type === "income") {
                total += amount;
            } else {
                total -= amount;
            }
        });

        totalElement.classList.add("total-update");
        totalElement.textContent = `Ksh ${total.toFixed(2)}`;
        setTimeout(() => totalElement.classList.remove("total-update"), 500);
    }

    newEntryButton.addEventListener("click", () => {
        const entry = entryTemplate.cloneNode(true);
        entry.classList.add("new-entry-row");
        const deleteButton = entry.querySelector(".delete-entry");
        deleteButton.addEventListener("click", () => entry.remove());
        entriesContainer.appendChild(entry);
    });

    saveButton.addEventListener("click", async () => {
        const entries = entriesContainer.querySelectorAll("tr");
        for (const entry of entries) {
            await saveTransaction(entry);
        }
        await fetchTransactions();
    });

    exportCsvButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`${API_URL}/export/csv`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Failed to export CSV', response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    });

    themeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
    });

    fetchTransactions();
});
