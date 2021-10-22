const toastLiveExample = document.getElementById('liveToast');
let carrito;
traerCarrito();
displayEtiquetaCarrito()

function agregarAlCarrito () {
    carrito.push(item);
    guardarCarrito();
    actualizarCarrito();
    displayEtiquetaCarrito()
};

function guardarCarrito() {
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
};

function actualizarCarrito () {
    let guardado = sessionStorage.getItem('carrito');
    carrito = JSON.parse(guardado);
};

function traerCarrito() {
    carrito = sessionStorage.getItem("carrito")
    if (carrito === null || carrito === undefined){
        carrito = [];
        console.log("pasa por acA")
    } else {
        actualizarCarrito();
    }
}

function notificacion() {
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show()
};

function displayEtiquetaCarrito() {
    let etiqueta = document.getElementById("etiqueta-carrito");
    let botonCarrito = document.getElementById("btn-carrito");
    if (carrito.length >= 1) {
        etiqueta.classList.remove("d-none");
        etiqueta.innerText = carrito.length;
        botonCarrito.setAttribute("href", "../carrito.html");
    }
}