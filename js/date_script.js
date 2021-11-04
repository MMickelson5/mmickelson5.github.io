let date = new Date();
document.getElementById('getYear').textContent = date.getFullYear();

let lastModif = new Date(document.lastModified);
let day = (lastModif.getMonth() + 1) + "/" + lastModif.getDate() + "/" + lastModif.getFullYear();
let hour = String(lastModif.getHours());
let minute = String(lastModif.getMinutes());
let second = String(lastModif.getSeconds());
document.getElementById("last-modified").innerHTML = day.padStart(2, '0') + " " + hour.padStart(2, '0') + ':' + minute.padStart(2, '0') + ':' + second.padStart(2, '0');
