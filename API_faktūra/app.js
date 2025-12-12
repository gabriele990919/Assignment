console.log("Sąskaitos faktūros programa veikia!");

async function loadInvoice() {
    try {
        const response = await fetch("https://in3.dev/inv/");
        const data = await response.json();

        // Sąskaitos pagrindinė informacija
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

        data.items.forEach((item, index) => {
            const qty = item.quantity;
            const price = item.price;

            // Nuolaida
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
                    <td>${index + 1}</td>
                    <td>${item.description}</td>
                    <td>${qty}</td>
                    <td>${price.toFixed(2)} €</td>
                    <td>${discountAmount ? "-" + discountAmount.toFixed(2) + " €" : "-"}</td>
                    <td>${final.toFixed(2)} €</td>
                </tr>
            `;
            itemsBody.insertAdjacentHTML("beforeend", row);
        });

        //Transportavimas
        const shipping = data.shipping ?? 0;

        subtotal += shipping;

        document.getElementById("shippingPrice").textContent = shipping.toFixed(2) + " €";

        // PVM
        const vat = subtotal * 0.21;
        const total = subtotal + vat;

        // Galutinės sumos
        document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " €";
        document.getElementById("vat").textContent = vat.toFixed(2) + " €";
        document.getElementById("total").textContent = total.toFixed(2) + " €";

    } 
    catch (error) {
        console.error("Klaida gaunant API duomenis:", error);
    }
}

window.onload = loadInvoice;
