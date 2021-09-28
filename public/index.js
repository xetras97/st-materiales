//Inicializar ToolTips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
//Al cargar pantalla se hace un fetch de la base de datos
window.onload = async() => {
  const productsList = await (await fetch ("/api/products")).json();
  console.log(productsList);
  displayNovedades(productsList);
  displayPromociones(productsList);
}
//Funcion para mostrar productos en el html desde base de datos
function displayNovedades (productsList) {
  let productsHTML = ``;
  productsList.forEach(element => {
    if (element.new === "Novedad") {
      productsHTML +=
        `<div class="col-6 col-md-4 col-lg-3 mt-2 card-container">
          <div class="card">
            <img src="${element.image}" class="img-fluid card-img-top" alt="${element.name}">
            <div class="card-body">
              <span class="badge text-dark badge-price">$${element.price}</span>
              <h5 class="card-title">${element.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${element.description}</h6>
            </div>
          </div>
        </div>`
    }
  });
  document.getElementById("novedades-container").innerHTML += productsHTML;
}

function displayPromociones (productsList) {
  let promocionesHTML = ``;
  productsList.forEach(element => {
    if (element.category === "Promociones") {
      promocionesHTML +=
        `<div class="col-8 offset-2 col-sm-6 offset-sm-0 col-md-4">
            <a href="#">
              <div class="card bg-dark text-white">
                <img src="${element.image}" class="card-img" alt="${element.name}">
                <div class="card-img-overlay d-flex flex-column justify-content-end">
                  <h5 class="card-title">${element.name}</h5>
                  <p class="card-text">${element.description}</p>
                </div>
              </div>
            </a>
          </div>
        `
    }
  });
  document.getElementById("promo-container").innerHTML += promocionesHTML;
}

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

