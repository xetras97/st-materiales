window.onload = async () => {
    await traerCompradoryPedidos();
    await enviarPedido ()
    displayResumen()
    enviarNuevoStock ()
};
window.onbeforeunload = function() {
    return "Al salir o recargar la pagina no podra acceder a su resumen, por favor descarguelo o imprimalo";
};
let comprador;
let totalPedidos;
let pedido;

async function traerCompradoryPedidos () {
    comprador = await (await fetch ("/form")).json();
    totalPedidos = await (await fetch ("/api/pedidos/total")).json();
    let nombresProductos = "";
    carrito.forEach(element => {
        nombresProductos += `${element.cantidad} x ${element.name}\n`
    });
    pedido = {
        numero: Number(totalPedidos),
        productos: nombresProductos,
        total: sessionStorage.getItem("total"),
        idPago: "",
        nombre: `${comprador.nombre} ${comprador.apellido}`,
        mail: comprador.email,
        telefono: comprador.tel,
        direccion: `${comprador.direccion} ${comprador.altura} ${comprador.piso} ${comprador.depto}`,
        localidad: comprador.localidad,
        provincia: comprador.provincia,
        cp: comprador.cp
    }
};

function download() {
    const element = document.getElementById("pdf-container");

    html2pdf()
    .set({
        margin: 1,
        filename: "resumen-compra.pdf",
        image: {
            type: "jpeg",
            quality: 0.98
        },
        html2canvas: {
            scale: 3,
            letterRendering: true,
        },
        jsPDF: {
            format: "a4",
            orientation: "portrait"
        }
    })
    .from(element)
    .save();
};

function displayResumen() {
    let productsHTML = "";
    carrito.forEach(element => {
        productsHTML += `
        <div class="col-11 offset-1 text-start d-flex align-items-center text-muted p-0">
            <p class="mb-0 ms-2">${element.cantidad} x ${element.name}</p>
        </div>
        `
    });
    document.getElementById("items-list").innerHTML += productsHTML;

    document.getElementById("domicilio").innerText = comprador.direccion + " " + comprador.altura + " C.P. " + comprador.cp;
    document.getElementById("provincia").innerText = comprador.localidad + ", " + comprador.provincia; 
    document.getElementById("nombre").innerText = comprador.nombre + " " + comprador.apellido + " - " + comprador.tel;
    document.getElementById("total").innerText += sessionStorage.getItem("total");
    document.getElementById("total-pedidos").innerText += Number(totalPedidos);
}

function enviarPedido () {
    fetch("/api/pedidos",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido)
      })
};

function enviarNuevoStock () {
    fetch("/api/products",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(carrito)
      })
};

function resetCarrito () {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    displayEtiquetaCarrito();
};