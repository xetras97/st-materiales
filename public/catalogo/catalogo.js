window.onload = async () => {
    await traerProductos();
    setPagActual();
    displayPagination(productsList);
}
displayCatalogo(parseInt(sessionStorage.getItem("pagActual")));

function setPagActual(){
    if (isNaN((sessionStorage.getItem("pagActual")))) {
        sessionStorage.setItem("pagActual", 1);
    }
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
}

function displayPagination(array) {
    let paginationHTML = `
    <li class="page-item">
        <a id="flecha-atras" class="page-link text-dark" href="#" aria-label="Previous" onclick="displayCatalogo(${parseInt(sessionStorage.getItem("pagActual")) - 1})">
            <span aria-hidden="true">&laquo;</span>
        </a>
    </li>
    `;
    for (let p = 0; p < (array.length / 16); p++) {
        paginationHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="displayCatalogo(${p + 1})">${p + 1}</a></li>`
    };
    paginationHTML += `
    <li class="page-item">
        <a id="flecha-adelante" class="page-link text-dark" href="#" aria-label="Next" onclick="displayCatalogo(${parseInt(sessionStorage.getItem("pagActual")) + 1})">
            <span aria-hidden="true">&raquo;</span>
        </a>
    </li>
    `;
    document.getElementById("pagination-container").innerHTML = paginationHTML;
}