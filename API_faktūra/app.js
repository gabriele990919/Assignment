console.log("Sąskaitos faktūros programa veikia!");

const invoiceDiv = document.querySelector('invoice-container');

const printInformationList = info => {
    info.forEach(item => {
        const li = document.createElement('li') // tuščias li elementas
        const pavadinimas = item.pavadinimas; // paimu iš struktūros name
        const kaina = item.kaina; // paimu frazę
        li.innerText = pavadinimas + ': ' + kaina + ' EUR' // į li dedu paimtą name ir frazę
        li.classList.add('info');
        invoiceUL.appendChild(li);
    });
}

fetch('https://in3.dev/inv/') // siunčia užklausa
    .then(res => res.json()) // laukiam tada JSON gautą rezultatą
    .then(users => {
        console.log(users);
        
    });