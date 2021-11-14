// function to toggle menu in small screen mode
function toggleMenu() {
    document
        .getElementsByClassName('navigation') [0]
        .classList.toggle('responsive')
}

function setDate() {
    var date = new Date();
    let weekdays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    let today = weekdays[date.getDay()];
    let day = date.getDay()
    let month = date.getMonth()

    document.getElementById('getYear').textContent = date.getFullYear();
    document.getElementById('date').innerHTML = today + ', ' + day + '/' + month
}
window.onload(setDate())