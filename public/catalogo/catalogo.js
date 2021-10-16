// EJECUCIONES AL CARGAR PAGINA
window.onload = async () => {
    await traerProductos();
    await document.addEventListener("DOMContentLoaded", displayPagination(JSON.parse(sessionStorage.getItem("productsDisplaying"))));
    await displayCatalogo(setPagActual(), sessionStorage.getItem("order"), sessionStorage.getItem("category"));
    cambiarTitulo(sessionStorage.getItem("category"));
}

// DECLARACION DE VARIABLES
const menor = "menor";
const mayor = "mayor";
const unorder = "unorder";
const deportes = "deportes";
const funcional = "funcional";
const yoga = "yoga";
const barrasydiscos = "barrasydiscos";
const promociones = "promociones";
let pages = 0;
let order;
let category;
let productsDefault;
let productsList = 0;
let categoryDisplaying;
let orderDisplaying;

// FUNCIONES
function setPagActual() {
    if (sessionStorage.getItem("pagActual") >= 1) {
    } else {
        sessionStorage.setItem("pagActual", 1);
    }
    return parseInt(sessionStorage.getItem("pagActual"));
}

async function traerProductos() {
    productsList = await (await fetch("/api/products")).json();
    if (!sessionStorage.getItem("productsDisplaying")) {
        sessionStorage.setItem("productsDisplaying", JSON.stringify(productsList));
    }
    productsDefault = productsList;
    return productsList;
}

async function displayCatalogo(page, order = unorder, category) {
    document.getElementById("catalogo-row").innerHTML = `<div id="catalogo-loading" class="col mt-4">
    <div class="d-flex justify-content-center text-info">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;
    let productsListPagination = await (await fetch(`/api/products/pages?page=${page}&limit=16&order=${order}&category=${category}`)).json();
    sessionStorage.setItem("pagActual", page);
    let productsHTML = ``;
    productsListPagination.results.forEach(product => {
        productsHTML += `
        <div class="col-12 col-md-4 col-lg-3 mt-2 card-container">
            <a href="./${product.id}" class="text-dark" style="text-decoration: none;">
                <div class="card h-100">
                    <img src="../${product.image}" class="img-fluid card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <span class="badge text-dark badge-price">$${product.price}</span>
                        <h5 class="card-title">${product.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${product.description}</h6>
                    </div>
                </div>
            </a>
        </div>
        `;
    });
    document.getElementById("catalogo-row").innerHTML = productsHTML;
    actualizarFlechas(`${order}, ${category}`);
    sessionStorage.setItem("category", category);
    sessionStorage.setItem("order", order);
    categoryDisplaying = sessionStorage.getItem("category");
    orderDisplaying = sessionStorage.getItem("order");
}

function actualizarFlechas(order, category) {
    let pagina = parseInt(sessionStorage.getItem("pagActual"));
    if ((pagina - 1) <= 0) {
        document.getElementById("flecha-atras").style.display = "none";
    } else {
        document.getElementById("flecha-atras").style.display = "block";
    }
    if (pagina >= pages) {
        document.getElementById("flecha-adelante").style.display = "none";
    } else {
        document.getElementById("flecha-adelante").style.display = "block";
    };

    let itemsPaginas = document.getElementsByClassName("page-link");
    for (i = 0; i < itemsPaginas.length; i++) {
        if (itemsPaginas[i].innerText == sessionStorage.getItem("pagActual")) {
            itemsPaginas[i].style.backgroundColor = "var(--celeste-color)";
        } else {
            itemsPaginas[i].style.backgroundColor = "#fff";
        }
    };
    document.getElementById("flecha-atras").setAttribute("onclick", `displayCatalogo(${pagina - 1}, ${order}, ${category})`);
    document.getElementById("flecha-adelante").setAttribute("onclick", `displayCatalogo(${pagina + 1}, ${order}, ${category})`);
}

function displayPagination(array, order = unorder, category) {
    pages = 0;
    let paginationHTML = `
    <li id="flecha-atras" class="page-item">
        <a  class="page-link text-dark" href="#" aria-label="Previous" >
            <span aria-hidden="true">&laquo;</span>
        </a>
    </li>
    `;
    for (let p = 0; p < (array.length / 16); p++) {
        paginationHTML += `<li class="page-item" onclick="displayCatalogo(${p + 1}, ${order}, ${category})"><a id="p-${p + 1}" class="page-link text-dark item-focus" href="#" >${p + 1}</a></li>`;
        pages += 1;
    };
    paginationHTML += `
    <li id="flecha-adelante" class="page-item">
        <a  class="page-link text-dark" href="#" aria-label="Next" >
            <span aria-hidden="true">&raquo;</span>
        </a>
    </li>
    `;
    document.getElementById("pagination-container").innerHTML = paginationHTML;
}

function ordenarCatalogo(order, category) {
    displayPagination(JSON.parse(sessionStorage.getItem("productsDisplaying")), order, category);
    displayCatalogo(1, order, category);
    agregarEtiqueta(order);
};

function filtrarCatalogo(category, order) {
    let filtro = productsList.filter(producto => producto.category == `${category}`);
    sessionStorage.setItem("productsDisplaying", JSON.stringify(filtro));
    displayPagination(filtro, order = unorder, category);
    displayCatalogo(1, order, category);
    cambiarTitulo(category);
    agregarEtiqueta(order);
}

function cambiarTitulo(category = "productos") {
    let listaHTML = "";
    let tituloHTML = "";
    let pagInicio = "productos";
    if (category == "productos" || category == 'null' || category == "undefined") {
        tituloHTML = "todos los productos";
        listaHTML = `<li class="breadcrumb-item"><a href="../index.html" class="text-dark">Inicio</a></li>
        <li class="breadcrumb-item active" aria-current="page">Productos</li>`
    } else if (category == "barrasydiscos") {
        tituloHTML = "barras y discos";
        listaHTML = `<li class="breadcrumb-item"><a href="../index.html" class="text-dark">Inicio</a></li>
        <li class="breadcrumb-item" aria-current="page"><a href="#" class="text-dark" onclick="ordenarCatalogo(unorder); cambiarTitulo(); displayPagination(productsDefault, unorder); setDefault();">Productos</a></li>
        <li class="breadcrumb-item" aria-current="page">Barras y discos</li>`
    } else {
        tituloHTML = category;
        listaHTML = `<li class="breadcrumb-item"><a href="../index.html" class="text-dark">Inicio</a></li>
        <li class="breadcrumb-item" aria-current="page"><a href="#" class="text-dark" onclick="ordenarCatalogo(unorder); cambiarTitulo(); displayPagination(productsDefault, unorder); setDefault();">Productos</a></li>
        <li class="breadcrumb-item text-capitalize" aria-current="page">${category}</li>`
    }
    document.getElementById("titulo-catalogo").innerText = tituloHTML;
    document.getElementById("lista-acumulable").innerHTML = listaHTML;
}

function setDefault() {
    sessionStorage.setItem("productsDisplaying", JSON.stringify(productsDefault));
}

function agregarEtiqueta(order) {
    let texto = "";
    if (order == "menor") {
        texto = "Precio: menor a mayor"
    }
    if (order == "mayor") {
        texto = "Precio: mayor a menor"
    }
    document.getElementById("etiquetas-container").innerHTML = `
    <div id="etiquetas" class="text-dark">
        <span>${texto}</span>
        <button type="button" class="btn-close" aria-label="Close" onclick="ordenarCatalogo(unorder, categoryDisplaying)"></button>
    </div>
    `
    if (order == unorder) {
        document.getElementById("etiquetas-container").innerHTML = ""
    }
}
function eliminarEtiqueta() {
    document.getElementById("etiquetas-container").innerHTML = "";
}