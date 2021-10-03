window.onload = async () => {
    await traerProductos();
    await document.addEventListener("DOMContentLoaded", displayPagination(productsList));
    displayCatalogo(setPagActual());
}
let pages = 0;

function setPagActual(){
    if (sessionStorage.getItem("pagActual") >= 1) {
        console.log("tiene valor");
    } else {
        sessionStorage.setItem("pagActual", 1);
    }
    return parseInt(sessionStorage.getItem("pagActual"));
}

async function traerProductos() {
    productsList = await (await fetch("/api/products")).json();
    return productsList;
}

async function displayCatalogo(page) {
    productsListPagination = await (await fetch(`/api/products/pages?page=${page}&limit=16/`)).json();
    sessionStorage.setItem("pagActual", page);
    let productsHTML = ``;
    productsListPagination.results.forEach(product => {
        productsHTML += `
        <div class="col-12 col-md-4 col-lg-3 mt-2 card-container">
            <a href="#" class="text-dark" style="text-decoration: none;">
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
    actualizarFlechas();
}

function actualizarFlechas () {
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
    for (i = 0; i < itemsPaginas.length; i++){
        if (itemsPaginas[i].innerText == sessionStorage.getItem("pagActual")) {
            itemsPaginas[i].style.backgroundColor = "var(--celeste-color)";
        } else {
            itemsPaginas[i].style.backgroundColor = "#fff";
        }
    };
    document.getElementById("flecha-atras").setAttribute("onclick", `displayCatalogo(${pagina - 1})`);
    document.getElementById("flecha-adelante").setAttribute("onclick", `displayCatalogo(${pagina + 1})`);
}

function displayPagination(array) {
    let paginationHTML = `
    <li id="flecha-atras" class="page-item">
        <a  class="page-link text-dark" href="#" aria-label="Previous" >
            <span aria-hidden="true">&laquo;</span>
        </a>
    </li>
    `;
    for (let p = 0; p < (array.length / 16); p++) {
        paginationHTML += `<li class="page-item" onclick="displayCatalogo(${p + 1})"><a id="p-${p + 1}" class="page-link text-dark item-focus" href="#" >${p + 1}</a></li>`;
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
    console.log("se ejecuto");
}