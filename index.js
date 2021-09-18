const contenedorNovedades = document.getElementById("novedades-container");
const flechaDerechaNovedades = document.getElementById("flecha-derecha");
const flechaIzquierdaNovedades = document.getElementById("flecha-izquierda");

flechaDerechaNovedades.addEventListener("click", desplazarDerecha);
flechaIzquierdaNovedades.addEventListener("click", desplazarIzquierda);


function desplazarDerecha() {
    let novedadesWidth = document.getElementById('novedades-container').offsetWidth;
    contenedorNovedades.scrollLeft += novedadesWidth;
}

function desplazarIzquierda() {
    let novedadesWidth = document.getElementById('novedades-container').offsetWidth;
    contenedorNovedades.scrollLeft -= novedadesWidth;
}