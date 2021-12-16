function setDate() {
    const date = new Date();
    let weekdays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

    let today = weekdays[date.getDay()];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    document.getElementById('get-year').textContent = year;
    document.getElementById('date').innerHTML = today + ', ' + day + ' ' + month + ' ' + year
}
window.addEventListener('load', setDate)