window.onload = async () => {
    await traerItem(url);
    await document.addEventListener("DOMContentLoaded", displayItem(item));
    displayRelated(item);
    traerLocalidades();
}

// Variables //
const url = window.location.pathname.slice(10).replace(/%20/g, " ");
const contenedorNovedades = document.getElementById("novedades-container");
const inputLocalidad = document.getElementById("floatingInputValue");
let item = "";

async function traerItem(itemId) {
    let productsList = await (await fetch("/api/products")).json();
    item = productsList.find(element => element.id == itemId);
    return item;
};

async function traerLocalidades() {
    let localidades = await (await fetch("/api/envios")).json();
    let localidadesHtml = "";
    localidades.forEach(element => {
        localidadesHtml += `
        <option value="${element.name}">
        `
    });
    document.getElementById("localidades").innerHTML = localidadesHtml;
}

function displayItem(item) {
    let htmlProduct = `
    <div class="col-12 ps-3 mb-1">
        <nav aria-label="breadcrumb">
            <ol id="" class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="../index.html" class="text-dark ">Inicio</a></li>
                <li class="breadcrumb-item" aria-current="page"><a href="./catalogo.html"
                    class="text-dark">Catálogo</a></li>
                <li class="breadcrumb-item" aria-current="page">${item.name}</li>
            </ol>
        </nav>
    </div>
    <div class="col-12 col-md-7">
        <h2 class="d-block d-md-none mt-2 text-uppercase text-center border-top border-bottom fst-italic">
            ${item.name}</h2>
        <img src="../${item.image}" class="product-image img-fluid img-thumbnail" alt="${item.name}">
    </div>
    <div class="col-12 col-md-5 mt-md-4">
        <h2 class="d-none d-md-block text-uppercase text-md-start border-top border-bottom fst-italic">
            ${item.name}</h2>
        <p class="item-id mt-md-4 mb-0 fw-light">Item ID: ${item.id}</p>
        <p id="price-margin" class="price fw-bold fs-1 mt-3 mb-0">$${item.price}</p>
        <p id="stock-count" class="d-none stock fs-5">¡Últimas unidades disponibles!</p>
        <form class="form-floating d-flex">
            <div class="col-2 form-floating">
                <input id="cantidad-items" type="number" min="1" max="10" class="form-control text-center"
                    id="floatingInputValue" placeholder="1" value="1">
                <label for="floatingInputValue">Cant</label>
            </div>
            <div class="col-9 text-center">
                <button class="btn btn-st text-uppercase text-dark fw-bold" type="button" onclick="agregarAlCarrito(), notificacion()">Agregar al
                    carrito</button>
            </div>
            <a href="#" class="like col-1 text-center"><i class="bi bi-star fs-2"></i></a>
        </form>
        <div class="mt-4 d-flex align-items-center">
            <i class="bi bi-truck fs-3"></i>
            <p class="mb-0 ms-2">Envios a todo el país</p>
            <a class="calculate mb-0 ms-3" data-bs-toggle="modal" data-bs-target="#calcular-envio">¡Calcular
                envio!</a>
        </div>
        <div class="retiro mt-2 d-flex align-items-center">
            <i class="bi bi-geo-alt fs-3"></i>
            <p class="mb-0 ms-2">Retirá en <b>Ramos Mejía</b> o <b>Castelar</b></p>
        </div>
        <div class="col-12 mt-2 d-flex align-items-center justify-content-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor"
                class="bi bi-cash-coin me-4 pt-2" viewBox="0 0 16 16" data-bs-toggle="tooltip"
                data-bs-placement="left" title="Efectivo">
                <path fill-rule="evenodd"
                    d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
                <path
                    d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
                <path
                    d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
                <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
            </svg>
            <img src="../assets/icons/mercadopago-logo.png" alt="Mercado Pago" width="120">
        </div>
    </div>
    `
    let htmlDetails = `
    <div class="col">
        <h3 class="text-uppercase fs-5">Descripción</h3>
        <p>${item.description}</p>
    </div>
    <div class="col border-start">
        <h3 class="text-uppercase fs-5">Ficha técnica</h3>
        <p class="border-bottom">Marca: la marca</p>
    </div>
    `
    document.getElementById("productDisplay").innerHTML = htmlProduct;
    document.getElementById("productDetails").innerHTML = htmlDetails;
    document.getElementById("title-name").innerText += ` - ${item.name}`;
    document.getElementById("toast-body"). innerHTML = `Agregaste <b>${item.name}</b> al carrito`;

    if (item.stock <= 5) {
        document.getElementById("stock-count").classList.remove("d-none");
        document.getElementById("stock-count").classList.add("d-block");
    } else {
        document.getElementById("price-margin").classList.add("mb-3")
    }
};

async function displayRelated (item) {
    let productsList = await (await fetch("/api/products")).json();
    let relatedHtml = ``;
    productsList.forEach(element => {
        if (element.category == item.category) {
            relatedHtml += `
            <div class="col-6 col-md-4 col-lg-3 mt-2 card-container">
                <a href="./${element.id}" class="text-dark" style="text-decoration: none;">
                    <div class="card h-100">
                        <img src="../${element.image}" class="img-fluid card-img-top"
                            alt="${element.name}">
                        <div class="card-body">
                            <span class="badge text-dark badge-price">$${element.price}</span>
                            <h5 class="card-title">${element.name}</h5>
                        </div>
                    </div>
                </a>
            </div>
            `
        };
    });
    document.getElementById("novedades-container").innerHTML += relatedHtml;
};

async function calcularEnvio() {
    let localidades = await (await fetch("/api/envios")).json();
    let html = "";
    if (localidades.some(elem => elem.name == inputLocalidad.value)) {
        let localidad = localidades.find(element => element.name == inputLocalidad.value);
        document.getElementById("title-envio").classList.remove("d-none");
        document.getElementById("price-envio").innerText = `$${localidad.price}`;
    } else {
        document.getElementById("title-envio").classList.remove("d-none");
        document.getElementById("price-envio").innerText = `El envio a ${inputLocalidad.value} debe ser coordinado via WhatsApp al finalizar la compra`;
        document.getElementById("price-envio").classList.remove("fs-3");
    }
};

function desplazarDerecha(contenedor) {
    let width = contenedor.offsetWidth;
    contenedor.scrollLeft += width;
};

function desplazarIzquierda(contenedor) {
    let width = contenedor.offsetWidth;
    contenedor.scrollLeft -= width;
};

