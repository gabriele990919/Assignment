export async function loadFromApi() {
  const res = await fetch("https://in3.dev/inv/");
  const data = await res.json();

  return {
    id: crypto.randomUUID(),
    number: data.number,
    date: data.date,
    seller: data.seller,
    buyer: data.buyer,
    items: data.items.map(i => ({
      title: i.description,
      price: i.price,
      quantity: i.quantity,
      discount: 0,
      vat: i.vat
    })),
    vatSum: 0,
    total: 0
  };
}