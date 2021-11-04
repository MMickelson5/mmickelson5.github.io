let date = new Date();
document.getElementById("getYear").textContent = date.getFullYear();

let lastModif = new Date(document.lastModified);
let day = (lastModif.getMonth() + 1) + "/" + lastModif.getDate() + "/" + lastModif.getFullYear();
let hour = lastModif.getHours() + ":" + lastModif.getMinutes() + ":" + lastModif.getSeconds();
document.getElementById("last-modified").innerHTML = day + " " + hour;