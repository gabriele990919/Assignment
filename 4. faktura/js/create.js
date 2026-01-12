let invoiceData = null;

document.getElementById("load").onclick = async () => {
  const res = await fetch("https://in3.dev/inv/");
  invoiceData = await res.json();
  renderInvoice(invoiceData);
};

function renderInvoice(inv) {
  let html = `<h2>${inv.number}</h2>`;
  html += `<p>Data: ${inv.date}</p>`;

  inv.items.forEach(item => {
    html += `
      <div>
        ${item.title} –
        ${item.price} € × ${item.quantity}
      </div>
    `;
  });

  document.getElementById("invoice").innerHTML = html;
}

document.getElementById("save").onclick = () => {
  if (!invoiceData) {
    alert("Pirma gauk sąskaitą");
    return;
  }

  let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  invoiceData.id = crypto.randomUUID();
  invoices.push(invoiceData);

  localStorage.setItem("invoices", JSON.stringify(invoices));
  alert("Išsaugota");
};