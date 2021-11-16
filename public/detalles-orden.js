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
    let selectCantidad = "";
    let valor = 0;
    // carrito definido en carrito.js //
    carrito.forEach(element => {
        valor = 0;
        selectCantidad = "";
        for (let i = 0; i < element.cantidad; i++) {
            valor += 1;
            selectCantidad += `<li><a class="dropdown-item" onclick="cambiarCantidad(${valor}, '${element.id}')">${valor}</a></li>`
        }; 
        html += `
        <div class="carrito-card col-10 col-md-11 col-lg-10 offset-1 offset-md-0 card mb-3">
            <div class="row g-0">
                <div class="col-4" style="height: 100%;">
                <a href="./catalogo/${element.id}"><img src="${element.image}" class="col-12 img rounded-start" alt="${element.name}"></a>
                </div>
                <div class="col-8" style="height: 100%;">
                <div class="card-body d-flex flex-column justify-content-center" style="height: 100%;">
                    <a href="./catalogo/${element.id}" class="text-dark" style="text-decoration: none;"><h5 class="card-title mb-2">${element.name}</h5></a>
                    <p class="price card-text fs-4 fw-bold mb-2">$${element.price}</p>
                    <p class="card-text mb-0"><small class="text-muted">Item ID: ${element.id}</small></p>
                    <div class="btn-group col-2 mt-2 mb-0 dropend">
                        <button type="button" class="btn btn-outline-info dropdown-toggle text-dark" data-bs-toggle="dropdown" aria-expanded="false">
                        ${element.cantidad}
                        </button>
                        <ul class="dropdown-menu" style="max-height: 350%; overflow-y: scroll; overflow-x: hidden;">
                        ${selectCantidad}
                        </ul>
                    </div>
                    <button id="btn-elminar-carrito" type="button" class="btn-close" aria-label="Close" data-bs-toggle="tooltip"
                    data-bs-placement="bottom" title="Eliminar del carrito" value="${carrito.indexOf(element)}" onclick="eliminarDelCarrito()"></button>
                </div>
                </div>
            </div>
        </div>
        `;
        document.getElementById("detalles-item-container").innerHTML += `
        <div class="d-flex justify-content-between mt-1 px-2">
            <p class="card-text text-muted">${element.cantidad + " x " + element.name}</p>
            <p class="card-text text-muted">$${element.price * element.cantidad}</p>
        </div>
        `
        subtotal += (element.price * element.cantidad);
    });
    if (carrito.length === 0){
        html = `<h6 class="mt-4 fst-italic">Tu carrito está vacio</h6>`
        document.getElementById("btn-gradient").setAttribute("disabled", "");
    }
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
    }
};

function eliminarDelCarrito () {
    const boton = document.getElementById("btn-elminar-carrito");
    carrito.splice(boton.value, 1);
    guardarCarrito();
    location.reload();
};

function cambiarCantidad (cantidad, itemId) {
    carrito.forEach(element => {
        if (element.id == itemId) {
            element.stock = element.stock + (element.cantidad - cantidad);
            element.cantidad = cantidad;
            guardarCarrito();
            location.reload();
        };
    });
};

async function chequearStock() {
    let productsList = await (await fetch("/api/products")).json();
    let allGood = true;
    let error = "";
    carrito.forEach(element => {
        let productIndex = productsList.indexOf(productsList.find(e=> e.id == element.id));
        console.log (productsList[productIndex].stock);
        console.log (element.cantidad);
        if (productsList[productIndex].stock < element.cantidad){
           console.log("todo mal")
           allGood = false;
           error += `\n - ${element.name}`
        }  
    })
    
    if (! allGood) {
        alert(`No disponemos las unidades deseadas de los siguientes articulos:${error}\nCambie las cantidades para poder continuar con la compra`)
    } else {
        window.location.assign("./checkout/checkout.html");
    };
}