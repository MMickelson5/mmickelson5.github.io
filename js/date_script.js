let date = new Date();
document.getElementById("getYear").textContent = date.getFullYear();

var string = document.lastModified;
let oLastModif = new Date(document.lastModified);
let day = (oLastModif.getMonth() + 1) + "/" + oLastModif.getDate() + "/" + oLastModif.getFullYear();
let hour = oLastModif.getHours() + ":" + oLastModif.getMinutes() + ":" + oLastModif.getSeconds();
document.getElementById("lastModified").textContent = day + " " + hour;
