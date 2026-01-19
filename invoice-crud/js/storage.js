const KEY = "invoices";

export function getAll() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function getById(id) {
  return getAll().find(i => i.id === id);
}

export function save(invoice) {
  const list = getAll();
  list.push(invoice);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function update(invoice) {
  const list = getAll().map(i => i.id === invoice.id ? invoice : i);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function remove(id) {
  const list = getAll().filter(i => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}