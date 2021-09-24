//Inicializar ToolTips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
//Al cargar pantalla se hace un fetch de la base de datos
window.onload = async() => {
  const productsList = await (await fetch ("/api/products")).json();
  console.log(productsList);
  displayProducts(productsList);
}
//Funcion para mostrar productos en el html desde base de datos
function displayProducts (productsList) {
  let productsHTML = ``;
  productsList.forEach(element => {
    productsHTML += 
    `<div class="col-6 col-md-4 col-lg-3 mt-2 card-container">
      <div class="card">
        <img src="${element.image}" class="img-fluid card-img-top" alt="...">
        <div class="card-body">
          <span class="badge text-dark badge-price">$${element.price}</span>
          <h5 class="card-title">${element.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
        </div>
      </div>
    </div>`
  });
  document.getElementById("novedades-container").innerHTML += productsHTML;
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
