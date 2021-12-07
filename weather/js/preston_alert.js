const date = new Date();
let day = date.getDate();

function showAlert() {
    document.getElementById('heads-up').style.display = 'block';
}

if (day === 5 || 6){
    window.addEventListener('load', showAlert)
}
else {
    document.getElementById('heads-up').style.display = 'none';
    break
}