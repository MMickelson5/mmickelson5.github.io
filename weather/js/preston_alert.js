const date = new Date();
let day = date.getDate();

function showAlert() {
    document.getElementById('heads-up').style.display = 'block';
}

if ([5,6].includes(parseInt(day))){
    window.addEventListener('load', showAlert)
    console.log('You did something wrong!')
}
else {
    document.getElementById('heads-up').style.display = 'none';
}