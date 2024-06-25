//This file will include utility functions such as updating totals.

export function updateTotal() {
    const entries = document.querySelectorAll(".entries tr.new-entry-row");
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

    const totalElement = document.querySelector(".total");
    totalElement.classList.add("total-update");
    totalElement.textContent = `Ksh ${total.toFixed(2)}`;
    setTimeout(() => totalElement.classList.remove("total-update"), 500);
}
