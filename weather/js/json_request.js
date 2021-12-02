const requestURL = 'https://mmickelson5.github.io/weather/json/index.json';

fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonObject) {
        console.table(jsonObject); // temporary checking for valid response and data parsing
        const towns = jsonObject['towns'];
        for (let i = 0; i < towns.length; i++) {
            let card = document.createElement('article');
            let h2 = document.createElement('h2');

            h2.textContent = towns[i].name;
            card.appendChild(h2);

            document.querySelector('div.main-container').appendChild(card);

            let data = document.createElement("p");
            data.textContent = 'Moto: ' + towns[i].moto + '<br>Year Founded: ' + towns[i].yearFounded + '<br>Population: ' + towns[i].currentPopulation + '<br>Average Rainfall: ' + towns[i].averageRainfall + '<br>Events: ' + towns[i].events;
            card.appendChild(data);
        }
    });