const date = new Date();
let day = date.getDate();

function showAlert() {
    document.getElementById('heads-up').style.display = 'block';
    document.getElementById('heads-up').style.fontWeight = 'bold';
}

if (day === 5 || 6){
    window.addEventListener('load', showAlert)
}