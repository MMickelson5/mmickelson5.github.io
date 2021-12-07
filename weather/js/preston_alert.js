const date = new Date();
let day = date.getDate();

function showAlert() {
    document.getElementById('heads-up').style.display = 'block';
}

if (day == 5){
    window.addEventListener('load', showAlert)
    console.log('You did something wrong!')
} else if (day == 6) {
    window.addEventListener('load', showAlert)
    console.log('You did something wrong!')
} else {
    document.getElementById('heads-up').style.display = 'none';
}