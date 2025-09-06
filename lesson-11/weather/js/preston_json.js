const requestURL = 'https://mmickelson5.github.io/weather/json/index.json';

fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonObject) {
        console.table(jsonObject); // temporary checking for valid response and data parsing
        const towns = jsonObject['towns'];
        for (let i = 0; i < towns.length; i++) {
            if (i == 2) {
                let card = document.createElement('article');
                let h2 = document.createElement('h2');
                let div = document.createElement('div');
                div.setAttribute("class", 'data')
                let br = document.createElement('br')

                h2.textContent = towns[i].name + ' Local Events:';
                div.appendChild(h2);

                document.querySelector('div.events-container').appendChild(card);

                let event1 = document.createElement("li");
                event1.textContent = towns[i].events[0];
                div.appendChild(event1);

                let event2 = document.createElement("li");
                event2.textContent = towns[i].events[1];
                div.appendChild(event2);

                let event3 = document.createElement("li");
                event3.textContent = towns[i].events[2];
                div.appendChild(event3);

                let event4 = document.createElement("li");
                event4.textContent = towns[i].events[3];
                div.appendChild(event4);

                card.appendChild(div)
            }
        }
    });