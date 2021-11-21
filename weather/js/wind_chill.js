function setWindChill() {
    let temp = parseInt(document.getElementById('temperature').innerHTML)

    let speed = parseInt(document.getElementById('wind').innerHTML)
    
    var chill = 35.74 + (.6215 * temp) - (35.75 * speed ** .16) + (.4275 * temp * speed ** .16)
    
    document.getElementById('chill').innerText = chill.toFixed(1)
}
window.onload(setWindChill())