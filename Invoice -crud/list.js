const tbody = document.getElementById("invoiceList");

const invoices = JSON.parse(localStorage.getItem("Sąskaita")) || [];

renderList();

function renderList() {
    tbody.innerHTML = "";

    if (invoices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Nėra išsaugotų sąskaitų</td></tr>`;
        return;
    }

    invoices.forEach(inv => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${inv.number}</td>
            <td>${inv.date}</td>
            <td>${calcTotal(inv).toFixed(2)} €</td>
            <td>
                <button onclick="viewInv('${inv.id}')">Rodyti</button>
                <button onclick="deleteInv('${inv.id}')">Trinti</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function calcTotal(inv) {
    let sum = 0;
    inv.items.forEach(i => {
        sum += i.price * i.quantity;
    });
    return sum * 1.21; // PVM
}

function deleteInv(id) {
    if (!confirm("Ar tikrai trinti sąskaitą?")) return;

    const filtered = invoices.filter(inv => inv.id !== id);
    localStorage.setItem("Sąskaita", JSON.stringify(filtered));
    location.reload();
}

function viewInv(id) {
    localStorage.setItem("viewId", id);
    window.location.href = "index.html";
}

const saveInvoice = JSON.parse(localStorage.getItem("Sąskaita")) || [];