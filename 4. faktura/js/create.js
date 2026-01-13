let invoiceData = null;

// Gauti sąskaitą iš API
document.getElementById("load").onclick = async () => {
  const res = await fetch("https://in3.dev/inv/");
  invoiceData = await res.json();
  renderInvoice(invoiceData);
};

// Atvaizdavimas
function renderInvoice(inv) {
  let html = `<h2>${inv.number}</h2>`;
  html += `<p>Data: ${inv.date}</p>`;
  html += `<ul>`;

  inv.items.forEach(item => {
    html += `
      <li>
        ${item.title} – ${item.price} € × ${item.quantity}
        (nuolaida ${item.discount}%)
      </li>
    `;
  });

  html += `</ul>`;
  document.getElementById("invoice").innerHTML = html;
}

// Perskaičiavimas
function recalc(inv) {
  inv.subtotal = inv.items.reduce((sum, item) => {
    return sum + item.price * item.quantity * (1 - item.discount / 100);
  }, 0);

  inv.vat = inv.subtotal * inv.vatRate / 100;
  inv.total = inv.subtotal + inv.vat;
}

// Išsaugojimas
document.getElementById("save").onclick = () => {
  if (!invoiceData) {
    alert("Pirma gauk sąskaitą");
    return;
  }

  let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  recalc(invoiceData);
  invoiceData.id = crypto.randomUUID();
  invoices.push(invoiceData);

  localStorage.setItem("invoices", JSON.stringify(invoices));
  alert("Išsaugota");
};
