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
            let div = document.createElement('div');
            div.setAttribute("class", 'data')

            h2.textContent = towns[i].name;
            div.appendChild(h2);

            document.querySelector('div.main-container').appendChild(card);

            let motto = document.createElement("li");
            motto.textContent = 'Motto: ' + towns[i].motto;
            div.appendChild(motto);

            let founded = document.createElement("li");
            founded.textContent = 'Year Founded: ' + towns[i].yearFounded;
            div.appendChild(founded);

            let population = document.createElement("li");
            population.textContent = 'Population: ' + towns[i].currentPopulation;
            div.appendChild(population);

            let rain = document.createElement("li");
            rain.textContent = 'Average Rainfall: ' + towns[i].averageRainfall;
            div.appendChild(rain);

            card.appendChild(div)

            let image = document.createElement("img");
            image.setAttribute("src", towns[i].photo);
            image.setAttribute("alt", towns[i].name + " " + towns[i].motto)
            card.appendChild(image)
        }
    });