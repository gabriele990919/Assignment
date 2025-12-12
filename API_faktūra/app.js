console.log("Sąskaitos faktūros programa veikia!");

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
    else console.warn(`DOM elementas nerastas: #${id}`);
}

function detectShippingKey(obj) {
    // Tikriname dažniausiai sutinkamus pavadinimus
    const keys = ['shipping', 'shipping_price', 'shippingPrice', 'transport', 'transport_price'];
    for (const k of keys) {
        if (k in obj && obj[k] != null) return k;
    }
    // jei nieko neradom, grąžinam null
    return null;
}

async function loadInvoice() {
    try {
        const response = await fetch("https://in3.dev/inv/");
        // check HTTP status
        if (!response.ok) {
            throw new Error(`HTTP klaida: ${response.status} ${response.statusText}`);
        }

        // pabandome nuskaityti body kaip JSON
        const dataRaw = await response.text();
        let data;
        try {
            data = JSON.parse(dataRaw);
        } catch (jsonErr) {
            // jeigu ne JSON - loginam gautą tekstą ir metame aiškesnę klaidą
            console.error("Gautas ne JSON body:", dataRaw);
            throw new Error("Nepavyko parse'inti JSON: " + jsonErr.message);
        }

        console.log("Gauti API duomenys:", data);

        // Jeigu API grąžina masyvą, imame pirmą elementą
        const inv = Array.isArray(data) ? data[0] : data;
        if (!inv) throw new Error("API negrąžino sąskaitos objekto (inv === undefined/null).");

        console.log("Naudojamas invoice objektas:", inv);

        // Sąskaitos info (saugiai)
        safeSetText("invoiceNumber", inv.number ?? "-");
        safeSetText("invoiceDate", inv.date ?? "-");
        safeSetText("dueDate", inv.due_date ?? inv.dueDate ?? "-");

        // Pardavėjas - saugiai
        safeSetText("sellerName", inv.company?.seller?.name ?? "-");
        safeSetText("sellerAddress", inv.company?.seller?.address ?? "-");
        safeSetText("sellerCode", inv.company?.seller?.code ?? "-");
        safeSetText("sellerVat", inv.company?.seller?.vat ?? "-");

        // Pirkėjas - saugiai
        safeSetText("buyerName", inv.company?.buyer?.name ?? "-");
        safeSetText("buyerAddress", inv.company?.buyer?.address ?? "-");
        safeSetText("buyerCode", inv.company?.buyer?.code ?? "-");
        safeSetText("buyerVat", inv.company?.buyer?.vat ?? "-");

        // Prekės - patikrinam, ar yra inv.items
        const itemsBody = document.getElementById("itemsBody");
        if (!itemsBody) {
            console.warn("itemsBody elementas nerastas. Prekės nebus atvaizduotos.");
        } else {
            itemsBody.innerHTML = "";
        }

        let subtotal = 0;
        if (Array.isArray(inv.items)) {
            let index = 1;
            for (const item of inv.items) {
                const qty = Number(item.quantity) || 0;
                const price = Number(item.price) || 0;

                let discountAmount = 0;
                if (item.discount?.type === "percentage" && typeof item.discount.value === "number") {
                    discountAmount = price * (item.discount.value / 100);
                } else if (item.discount?.type === "fixed" && typeof item.discount.value === "number") {
                    discountAmount = item.discount.value;
                }

                const final = (price - discountAmount) * qty;
                subtotal += final;

                if (itemsBody) {
                    const row = `
                        <tr>
                            <td>${index++}</td>
                            <td>${item.description ?? ""}</td>
                            <td>${qty}</td>
                            <td>${price.toFixed(2)} €</td>
                            <td>${discountAmount ? "-" + discountAmount.toFixed(2) + " €" : "-"}</td>
                            <td>${final.toFixed(2)} €</td>
                        </tr>
                    `;
                    itemsBody.insertAdjacentHTML("beforeend", row);
                }
            }
        } else {
            console.warn("inv.items nėra masyvas arba neegzistuoja:", inv.items);
        }

        // Rasti teisingą transporto lauką
        const shippingKey = detectShippingKey(inv);
        const shipping = shippingKey ? Number(inv[shippingKey]) || 0 : 0;
        subtotal += shipping;

        // atvaizduojame shipping (saugiai)
        safeSetText("shippingPrice", shipping.toFixed(2) + " €");

        // PVM 21%
        const vat = subtotal * 0.21;
        const total = subtotal + vat;

        safeSetText("subtotal", subtotal.toFixed(2) + " €");
        safeSetText("vat", vat.toFixed(2) + " €");
        safeSetText("total", total.toFixed(2) + " €");

        // diagnostika: kokį shipping rado
        console.log("Shipping key used:", shippingKey, "value:", shipping);

    } catch (error) {
        // rodom pilną klaidos stack'ą ir tekstą - tai labai padeda debug'inti
        console.error("Klaida gaunant API duomenis:", error);
        if (error && error.stack) console.error("Pilna klaidos stack:", error.stack);
    }
}

window.addEventListener("load", loadInvoice);