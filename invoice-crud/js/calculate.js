export function calculate(inv) {
  let vatSum = 0;
  let total = 0;

  inv.items.forEach(i => {
    const sum = i.price * i.quantity * (1 - i.discount / 100);
    vatSum += sum * i.vat / 100;
    total += sum;
  });

  inv.vatSum = vatSum;
  inv.total = total + vatSum;
}