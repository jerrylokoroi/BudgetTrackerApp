document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://localhost:5001/api/transactions";
    const entriesContainer = document.querySelector(".entries");
    const newEntryButton = document.querySelector(".new-entry");
    const exportCsvButton = document.querySelector(".export-csv");
    const totalElement = document.querySelector(".total");
    const entryTemplate = document.querySelector(".entry-template").cloneNode(true);
    entryTemplate.classList.remove("entry-template");

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
        entry.querySelector(".input-date").value = new Date(transaction.date).toISOString().split("T")[0];
        entry.querySelector(".input-description").value = transaction.description;
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
            entry.remove();
            updateTotal();
        } catch (error) {
            console.error(error);
        }
    }

    async function saveTransaction(entry) {
        const transaction = {
            date: entry.querySelector(".input-date").value,
            description: entry.querySelector(".input-description").value,
            type: entry.querySelector(".input-type").value,
            amount: parseFloat(entry.querySelector(".input-amount").value)
        };

        const id = entry.dataset.id;
        let method = 'POST';
        let url = API_URL;

        if (id) {
            method = 'PUT';
            url = `${API_URL}/${id}`;
            transaction.id = parseInt(id);
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            const savedTransaction = await response.json();
            if (!id) {
                entry.dataset.id = savedTransaction.id;
            }
        } catch (error) {
            console.error(error);
        }
    }

    function updateTotal() {
        let total = 0;
        document.querySelectorAll(".entries tr:not(.entry-template)").forEach(entry => {
            const amount = parseFloat(entry.querySelector(".input-amount").value) || 0;
            const type = entry.querySelector(".input-type").value;
            if (type === "income") {
                total += amount;
            } else {
                total -= amount;
            }
        });
        totalElement.textContent = `Ksh ${total.toFixed(2)}`;
    }

    async function addNewTransaction() {
        const entry = entryTemplate.cloneNode(true);
        entry.querySelector(".delete-entry").addEventListener("click", () => {
            entry.remove();
            updateTotal();
        });
        entriesContainer.appendChild(entry);

        await saveTransaction(entry);
        updateTotal();
    }

    async function exportToCsv() {
        try {
            const response = await fetch(`${API_URL}/export/csv`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error(error);
        }
    }

    newEntryButton.addEventListener("click", addNewTransaction);
    exportCsvButton.addEventListener("click", exportToCsv);

    fetchTransactions();
});
