const contenedorNovedades = document.getElementById("novedades-container");
const flechaDerechaNovedades = document.getElementById("flecha-derecha");
const flechaIzquierdaNovedades = document.getElementById("flecha-izquierda");
const novedadesWidth = document.getElementById('novedades-container').offsetWidth;

flechaDerechaNovedades.addEventListener("click", desplazarDerecha);
flechaIzquierdaNovedades.addEventListener("click", desplazarIzquierda);


function desplazarDerecha() {
    contenedorNovedades.scrollLeft += novedadesWidth;
}

function desplazarIzquierda() {
    contenedorNovedades.scrollLeft -= novedadesWidth;
}