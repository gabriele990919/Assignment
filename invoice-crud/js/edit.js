import { getById, update } from "./storage.js";
import { calculate } from "./calculate.js";

const id = new URLSearchParams(location.search).get("id");
const inv = getById(id);

const out = document.getElementById("out");

inv.items.forEach((i, idx) => {
  out.innerHTML += `
    <p>${i.title}
    <input type="number" value="${i.quantity}"
      onchange="updateQty(${idx}, this.value)">
    </p>
  `;
});

window.updateQty = (i, v) => {
  inv.items[i].quantity = Number(v);
};

document.getElementById("save").onclick = () => {
  calculate(inv);
  update(inv);
  location.href = "list.html";
};