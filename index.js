// Variables para slider de novedades //
const contenedorNovedades = document.getElementById("novedades-container");
const flechaDerechaNovedades = document.getElementById("flecha-derecha");
const flechaIzquierdaNovedades = document.getElementById("flecha-izquierda");

// Listeners para slider de novedades //
flechaDerechaNovedades.addEventListener("click", desplazarDerecha);
flechaIzquierdaNovedades.addEventListener("click", desplazarIzquierda);

// Funciones para slider de novedades //
function desplazarDerecha() {
    let novedadesWidth = document.getElementById('novedades-container').offsetWidth;
    contenedorNovedades.scrollLeft += novedadesWidth;
}

function desplazarIzquierda() {
    let novedadesWidth = document.getElementById('novedades-container').offsetWidth;
    contenedorNovedades.scrollLeft -= novedadesWidth;
}