const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
const tbody = document.getElementById("list");

if (invoices.length === 0) {
  tbody.innerHTML = `<tr><td colspan="4">Sąskaitų nėra</td></tr>`;
} else {
  invoices.forEach(inv => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${inv.number}</td>
      <td>${inv.date}</td>
      <td>${Number(inv.total).toFixed(2)} €</td>
      <td>
        <button onclick="view('${inv.id}')">Žiūrėti</button>
        <button onclick="editInv('${inv.id}')">Redaguoti</button>
        <button onclick="removeInv('${inv.id}')">Trinti</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Veiksmai
function view(id) {
  alert("Peržiūra bus STEP 6 (view.html)");
}

function editInv(id) {
  alert("Redagavimas bus STEP 7 (edit.html)");
}

function removeInv(id) {
  if (!confirm("Ar tikrai trinti?")) return;

  const filtered = invoices.filter(inv => inv.id !== id);
  localStorage.setItem("invoices", JSON.stringify(filtered));
  location.reload();
}