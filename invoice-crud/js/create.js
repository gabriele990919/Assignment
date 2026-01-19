import { loadFromApi } from "./api.js";
import { save } from "./storage.js";
import { calculate } from "./calculate.js";

let invoice = null;

document.getElementById("load").onclick = async () => {
  invoice = await loadFromApi();
  render();
};

document.getElementById("save").onclick = () => {
  calculate(invoice);
  save(invoice);
  location.href = "list.html";
};

function render() {
  let html = `<h2>${invoice.number}</h2>`;
  invoice.items.forEach(i => {
    html += `<p>${i.title} – ${i.quantity} x ${i.price} €</p>`;
  });
  document.getElementById("out").innerHTML = html;
}