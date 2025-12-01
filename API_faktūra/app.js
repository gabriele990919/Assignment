console.log("Sąskaitos faktūros programa veikia!");

const infoUl = document.querySelector('#information');

const printInformationList = information => {
    
    information.forEaxh(info => {
        const li = document.createElement('li')
        const userName = info.name;
        const id = info.id;
        const phrase = info.company.catchPhrase
        li.innerText = userName + ': ' + phrase
        li.classList.add('info');
        usersUl.appendChild(li);
        const liVat = document.createElement('li')
        liVat.innerText = info.id * 21 / 100;
        liVat.classList.add('vated');
        infoUl.appendChild(liVat);
    });
}

fetch('https://in3.dev/inv/') // siunčia užklausa
    .then(res => res.json()) // laukiam tada JSON gautą rezultatą
    .then(info => {
        console.log(info);
        printInformationList
    });