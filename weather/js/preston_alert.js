function showAlert() {
    const date = new Date();
    let day = date.getDate();

    if (day == 5 || 6){
        document.getElementById('heads-up').style.display = 'block';
        document.getElementById('heads-up').style.fontWeight = 'bold';
    }
}
window.addEventListener('load', showAlert)