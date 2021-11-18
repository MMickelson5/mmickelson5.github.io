// function to toggle menu in small screen mode
function toggleMenu() {
    document
        .getElementsByClassName('navigation') [0]
        .classList.toggle('responsive')
}

function setDate() {
    const date = new Date();
    let weekdays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

    let today = weekdays[date.getDay()];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    document.getElementById('getYear').textContent = year;
    document.getElementById('date').innerHTML = today + ', ' + day + ' ' + month + ' ' + year

    if (day == 5){
        document.querySelector('#heads-up').style.display = "block";
        document.querySelector('#heads-up').style.fontWeight = 'bold';
    }
}
window.onload(setDate())