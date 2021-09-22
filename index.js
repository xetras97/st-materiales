//Inicializar ToolTips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Variables para slider de novedades //
const contenedorNovedades = document.getElementById("novedades-container");
const contenedorPromociones = document.getElementById("promo-container");

// Funciones para slider de novedades //
function desplazarDerecha(contenedor) {
    let width = contenedor.offsetWidth;
    contenedor.scrollLeft += width;
}

function desplazarIzquierda(contenedor) {
    let width = contenedor.offsetWidth;
    contenedor.scrollLeft -= width;
}
