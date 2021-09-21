// Variables para slider de novedades //
const contenedorNovedades = document.getElementById("novedades-container");

// Funciones para slider de novedades //
function desplazarDerecha() {
    let novedadesWidth = document.getElementById('novedades-container').offsetWidth;
    contenedorNovedades.scrollLeft += novedadesWidth;
}

function desplazarIzquierda() {
    let novedadesWidth = document.getElementById('novedades-container').offsetWidth;
    contenedorNovedades.scrollLeft -= novedadesWidth;
}