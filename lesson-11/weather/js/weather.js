const apiURL = "https://api.openweathermap.org/data/2.5/weather?id=5604473&appid=6eaba2f545c31bd8f0b0bef8e9c804d2";
const apiURLforecast = "https://api.openweathermap.org/data/2.5/forecast?id=5604473&appid=6eaba2f545c31bd8f0b0bef8e9c804d2";

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function convertToFahrenheit(temperature) {
    fahrenheit = (temperature - 273.15) * 9 / 5 + 32
    return fahrenheit
}

function getCurrentDate() {
    const date = new Date();
    year = date.getYear() + 1900;
    month = date.getMonth() + 1;
    day = date.getDate();
    if (day < 10) {
        day = "0" + day
    }
    today = year + "-" + month + "-" + day;
    return today
}

function getDayOfWeek(day) {
    switch (day) {
        case 0:
            return "Sunday";
            break;
        case 1:
            return "Monday";
            break;
        case 2:
            return "Tuesday";
            break;
        case 3:
            return "Wednesday";
            break;
        case 4:
            return "Thursday";
            break;
        case 5:
            return "Friday";
            break;
        case 6:
            return "Saturday";
            break;
        default:
            return "";
            }
}

fetch(apiURL)
    .then((response) => response.json())
    .then((jsObject) => {
        document.getElementById('current').innerHTML = capitalize(jsObject.weather[0].description) + ' ';

        document.getElementById('temperature').innerHTML = convertToFahrenheit(jsObject.main.temp).toFixed(0);

        document.getElementById('high').innerHTML = convertToFahrenheit(jsObject.main.temp_max).toFixed(0);

        document.getElementById('humidity').innerHTML = jsObject.main.humidity;

        let speed = jsObject.wind.speed * 2.237;
        document.getElementById('wind').innerHTML = speed.toFixed(1);


        let temp = convertToFahrenheit(jsObject.main.temp);
        
        let chill = 35.74 + (.6215 * temp) - (35.75 * speed ** .16) + (.4275 * temp * speed ** .16)
        
        document.getElementById('chill').innerText = chill.toFixed(0)
    });

var temperatures = []
var icons = []

var index = 1;
var day_of_week = new Date().getDay()


date = getCurrentDate()
console.log(date)
fetch(apiURLforecast)

.then((response) => response.json())
.then((jsObject) => {
    console.log(jsObject);
    jsObject.list.forEach((entry) => {
        if (String(entry.dt_txt).includes('18:00:00')) {
            document.getElementById('day' + index).textContent = getDayOfWeek(day_of_week);

            document.getElementById('day' + index + '-value').textContent = Math.round(convertToFahrenheit(parseFloat(entry.main.temp)))

            const imagesrc = 'https://openweathermap.org/img/w/' + entry.weather[0].icon + '.png';
            const desc = entry.weather[0].description;

            document.getElementById('day'+ index +'-img').textContent = imagesrc;
            document.getElementById('day' + index + '-img').setAttribute('src', imagesrc);
            document.getElementById('day' + index + '-img').setAttribute('alt', desc);
        
            if (day_of_week == 6) {
                day_of_week = 0;
            }
            else {
                day_of_week += 1
            }
            index += 1;
        }
    })

});