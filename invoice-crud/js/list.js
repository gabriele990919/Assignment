import { getAll, remove } from "./storage.js";

const ul = document.getElementById("list");

getAll().forEach(i => {
  const li = document.createElement("li");
  li.innerHTML = `
    ${i.number} – ${i.total.toFixed(2)} €
    <a href="edit.html?id=${i.id}">Edit</a>
    <button>Delete</button>
  `;
  li.querySelector("button").onclick = () => {
    remove(i.id);
    location.reload();
  };
  ul.appendChild(li);
});