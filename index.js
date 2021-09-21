//Inicializar ToolTips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

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