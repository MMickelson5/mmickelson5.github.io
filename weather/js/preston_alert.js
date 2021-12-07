function showAlert() {
    const date = new Date();
    let day = date.getDate();

    if (day == 5){
        document.getElementById('heads-up').style.display = 'block';
        document.getElementById('heads-up').style.fontWeight = 'bold';
    }
}

if (day == 5){
    window.addEventListener('load', showAlert)
}