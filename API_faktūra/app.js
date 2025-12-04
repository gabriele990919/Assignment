console.log("Sąskaitos faktūros programa veikia!");

/*fetch('https://in3.dev/inv/')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const informationList = document.getElementById('information');
        data.forEach(invoice => {
            const listItem = document.createElement('li');
            listItem.textContent = `Sąskaitos numeris: ${invoice.number}, Data: ${invoice.date}, Viso su PVM: ${invoice.totalWithVat} EUR`;
            informationList.appendChild(listItem);
        });
    })*/

async function loadInvoice() {
    try {
        const response = await fetch("https://in3.dev/inv/");
        const data = await response.json();

        // Sąskaitos info
        document.getElementById("invoiceNumber").textContent = data.number;
        document.getElementById("invoiceDate").textContent = data.date;
        document.getElementById("dueDate").textContent = data.due_date;

        // Pardavėjas
        document.getElementById("sellerName").textContent = data.company.seller.name;
        document.getElementById("sellerAddress").textContent = data.company.seller.address;
        document.getElementById("sellerCode").textContent = data.company.seller.code;
        document.getElementById("sellerVat").textContent = data.company.seller.vat;

        // Pirkėjas
        document.getElementById("buyerName").textContent = data.company.buyer.name;
        document.getElementById("buyerAddress").textContent = data.company.buyer.address;
        document.getElementById("buyerCode").textContent = data.company.buyer.code;
        document.getElementById("buyerVat").textContent = data.company.buyer.vat;

        // Prekės
        const itemsBody = document.getElementById("itemsBody");
        itemsBody.innerHTML = "";

        let subtotal = 0;

        data.items.forEach(item => {
            const qty = item.quantity;
            const price = item.price;

            let discountAmount = 0;

            if (item.discount?.type === "percentage") {
                discountAmount = price * (item.discount.value / 100);
            } 
            if (item.discount?.type === "fixed") {
                discountAmount = item.discount.value;
            }

            const final = (price - discountAmount) * qty;
            subtotal += final;

            const row = `
                <tr>
                    <td>${item.description}</td>
                    <td>${qty}</td>
                    <td>${price.toFixed(2)} €</td>
                    <td>${discountAmount ? "-" + discountAmount.toFixed(2) + " €" : "-"}</td>
                    <td>${final.toFixed(2)} €</td>
                </tr>
            `;
            itemsBody.insertAdjacentHTML("beforeend", row);
        });

        // Transportas (tikras API key: shipping_price)
        subtotal += data.shippingPrice || 0;

        // PVM 21%
        const vat = subtotal * 0.21;
        const total = subtotal + vat;

        document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " €";
        document.getElementById("vat").textContent = vat.toFixed(2) + " €";
        document.getElementById("total").textContent = total.toFixed(2) + " €";

        document.getElementById("shippingPrice").textContent = (data.shipping_price || 0).toFixed(2) + " €";

    } catch (err) {
        console.error("Klaida gaunant API duomenis:", err);
    }
}

window.onload = loadInvoice;
