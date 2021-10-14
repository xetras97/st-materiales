// Variables para slider de novedades //
const contenedorNovedades = document.getElementById("novedades-container");
const contenedorPromociones = document.getElementById("promo-container");

function desplazarDerecha(contenedor) {
    let width = contenedor.offsetWidth;
    contenedor.scrollLeft += width;
}

function desplazarIzquierda(contenedor) {
    let width = contenedor.offsetWidth;
    contenedor.scrollLeft -= width;
}