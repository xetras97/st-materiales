const checkboxEnvio = document.getElementById('envio-check');
const checkboxRetiro = document.getElementById('retiro-check');

checkboxEnvio.addEventListener("change", displayEnvioInput, false);
checkboxRetiro.addEventListener("change", displayRetiroInput, false);
if (window.addEventListener) {
    window.addEventListener("load", displayCarritoItems, false);
} else {
    window.attachEvent("onload", displayCarritoItems);
};
let subtotal = 0;
let total = 0;
function displayCarritoItems (){
    let html = "";
    // carrito definido en carrito.js //
    carrito.forEach(element => {
        html += `
        <div class="carrito-card col-10 col-md-11 col-lg-10 offset-1 offset-md-0 card mb-3">
            <div class="row g-0">
                <div class="col-4" style="height: 100%;">
                <img src="${element.image}" class="col-12 img rounded-start" alt="${element.name}">
                </div>
                <div class="col-8" style="height: 100%;">
                <div class="card-body d-flex flex-column justify-content-center" style="height: 100%;">
                    <h5 class="card-title mb-2">${element.name}</h5>
                    <p class="price card-text fs-4 fw-bold mb-2">$${element.price}</p>
                    <p class="card-text mb-0"><small class="text-muted">Item ID: ${element.id}</small></p>
                    <button type="button" class="btn-close" aria-label="Close" data-bs-toggle="tooltip"
                    data-bs-placement="bottom" title="Eliminar del carrito"></button>
                </div>
                </div>
            </div>
        </div>
        `;
        document.getElementById("detalles-item-container").innerHTML += `
        <div class="d-flex justify-content-between mt-1 px-2">
            <p class="card-text text-muted">${element.name}</p>
            <p class="card-text text-muted">$${element.price}</p>
        </div>
        `
        subtotal += element.price;
    });
    document.getElementById("carrito-items-container").innerHTML = html;
    document.getElementById("carrito-subtotal").innerText += subtotal;
    document.getElementById("carrito-total").innerText += subtotal;
}

function displaySelectorEntrega() {
    document.getElementById("checks").classList.remove("d-none");
    document.getElementById("checks").classList.add("d-flex");
};

function displayEnvioInput() {
    const inputEnvio = document.getElementById("input-envio");
    const inputRetiro = document.getElementById("input-retiro");
    if (checkboxEnvio.checked) {
        if (inputRetiro.classList.contains("d-flex")) {
            inputRetiro.classList.remove("d-flex");
            inputRetiro.classList.add("d-none");
        }
        traerLocalidades()
        inputEnvio.classList.remove("d-none");
        inputEnvio.classList.add("d-flex");
        calcularEnvio();
    }
}

function displayRetiroInput() {
    const inputRetiro = document.getElementById("input-retiro");
    const inputEnvio = document.getElementById("input-envio");
    if (checkboxRetiro.checked) {
        if (inputEnvio.classList.contains("d-flex")) {
            inputEnvio.classList.remove("d-flex");
            inputEnvio.classList.add("d-none");
        }
        inputRetiro.classList.remove("d-none");
        inputRetiro.classList.add("d-flex");
        document.getElementById("price-envio").innerText = "RETIRO";
        document.getElementById("carrito-total").innerText = `$${subtotal}`;
    }
}

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

document.getElementById("localidad-envio").addEventListener("change", calcularEnvio, false);

async function calcularEnvio() {
    let localidades = await (await fetch("/api/envios")).json();
    let html = "";
    const inputEnvio = document.getElementById("localidad-envio");
    if (localidades.some(elem => elem.name == inputEnvio.value)) {
        let localidad = localidades.find(element => element.name == inputEnvio.value);
        total = subtotal + localidad.price;
        document.getElementById("price-envio").innerText = `$${localidad.price}`;
        document.getElementById("carrito-total").innerText = `$${total}`;
    } else {
        document.getElementById("price-envio").innerText = `El envio a ${inputEnvio.value} debe ser coordinado via WhatsApp al finalizar la compra`;
    }
};