//This file will handle all the API interactions.

const API_URL = "https://localhost:7006/api/transactions";

export async function fetchTransactions() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

export async function deleteTransaction(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error("Error deleting transaction:", error);
    }
}

export async function saveTransaction(transaction, id) {
    let method = 'POST';
    let url = API_URL;

    if (id) {
        method = 'PUT';
        url = `${API_URL}/${id}`;
    }

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to save transaction', response.statusText);
        }
    } catch (error) {
        console.error("Error saving transaction:", error);
    }
}

export async function exportCsv() {
    try {
        const response = await fetch(`${API_URL}/export/csv`);
        if (response.ok) {
            return await response.blob();
        } else {
            console.error('Failed to export CSV', response.statusText);
        }
    } catch (error) {
        console.error("Error exporting CSV:", error);
    }
}
