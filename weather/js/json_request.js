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

            let motto = document.createElement("p");
            motto.textContent = 'Motto: ' + towns[i].moto;
            card.appendChild(motto);

            let founded = document.createElement("p");
            founded.textContent = 'Year Founded: ' + towns[i].yearFounded;
            card.appendChild(founded);

            let population = document.createElement("p");
            population.textContent = 'Population: ' + towns[i].currentPopulation;
            card.appendChild(population);

            let rain = document.createElement("p");
            rain.textContent = 'Average Rainfall: ' + towns[i].averageRainfall;
            card.appendChild(rain);

            let event = document.createElement("p");
            event.textContent = 'Events: ' + towns[i].events;
            card.appendChild(event);
        }
    });