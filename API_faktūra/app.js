console.log("Sąskaitos faktūros programa veikia!");

fetch('https://in3.dev/inv/')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const informationList = document.getElementById('information');
        data.forEach(invoice => {
            const listItem = document.createElement('li');
            listItem.textContent = `Sąskaitos numeris: ${invoice.number}, Data: ${invoice.date}, Viso su PVM: ${invoice.totalWithVat} EUR`;
            informationList.appendChild(listItem);
        });
    })

