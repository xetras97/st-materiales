window.onload = async () => {
    await traerCompradoryPedidos();
    displayResumen()
};
let comprador;
let pedidos;

async function traerCompradoryPedidos () {
    comprador = await (await fetch ("/form")).json();
    pedidos = await (await fetch ("/api/pedidos")).json();
    pedidos = pedidos[0];
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
            <p class="mb-0 ms-2">${element.name}</p>
        </div>
        `
    });
    document.getElementById("items-list").innerHTML += productsHTML;

    document.getElementById("domicilio").innerText = comprador.direccion + " " + comprador.altura + " C.P. " + comprador.cp;
    document.getElementById("provincia").innerText = comprador.localidad + ", " + comprador.provincia; 
    document.getElementById("nombre").innerText = comprador.nombre + " " + comprador.apellido + " - " + comprador.tel;
    document.getElementById("total").innerText += sessionStorage.getItem("total");
    document.getElementById("total-pedidos").innerText += (Number(pedidos) + 1);
}