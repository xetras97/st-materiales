const toastLiveExample = document.getElementById('liveToast');
let carrito;
// MOSTRAR BADGE DEL CARRITO AL CARGAR PAGINA //
if (window.addEventListener) {
    window.addEventListener("load", traerCarrito, false);
} else {
    window.attachEvent("onload", traerCarrito);
};
if (window.addEventListener) {
    window.addEventListener("load", displayEtiquetaCarrito, false);
} else {
    window.attachEvent("onload", displayEtiquetaCarrito);
};

// FUNCIONES //
function agregarAlCarrito() {
    const cantidad = document.getElementById("cantidad-items");
    if (cantidad.value <= item.stock) {  
        if (carrito.some(elem => elem.id == item.id)){
            carrito.forEach(element => {
                if (element.id == item.id){
                    element.cantidad += Number(cantidad.value);
                    element.stock -= Number(cantidad.value);
                }
            });
        } else {
            item.cantidad = Number(cantidad.value);
            carrito.push(item);
        };
        item.stock -= Number(cantidad.value);
        guardarCarrito();
        actualizarCarrito();
        displayEtiquetaCarrito();
        notificacion();
    } else {
        alert(`No tenemos la cantidad que busca en stock. 
        Solo quedan ${item.stock} unidades`)
    };
    if (item.stock < 1) {
        let btnAgregar = document.getElementById("btn-agregar");
        btnAgregar.setAttribute("disabled", "");
        btnAgregar.innerText = "Sin stock";
        btnAgregar.setAttribute("onclick", "");
    };
};

function guardarCarrito() {
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
};

function actualizarCarrito() {
    let guardado = sessionStorage.getItem('carrito');
    carrito = JSON.parse(guardado);
};

function traerCarrito() {
    carrito = sessionStorage.getItem("carrito")
    if (carrito === null || carrito === undefined) {
        carrito = [];
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
        let cantItems = 0;
        carrito.forEach(element => {
            cantItems += element.cantidad;
        });
        etiqueta.classList.remove("d-none");
        etiqueta.innerText = cantItems;
        botonCarrito.setAttribute("href", "../detalles-orden.html");
    }
}

// INICIADOR DE TOOLTIPS //
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// TRANSFERIR SESSION STORAGE ENTRE PESTAÑAS //
const sessionStorage_transfer = function (event) {
    if (!event) { event = window.event; } // ie suq
    if (!event.newValue) return;          // do nothing if no value to work with
    if (event.key == 'getSessionStorage') {
        // another tab asked for the sessionStorage -> send it
        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        // the other tab should now have it, so we're done with it.
        localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
    } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
        // another tab sent data <- get it
        var data = JSON.parse(event.newValue);
        for (var key in data) {
            sessionStorage.setItem(key, data[key]);
        }
    }
};

// listen for changes to localStorage
if (window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false);
} else {
    window.attachEvent("onstorage", sessionStorage_transfer);
};


// Ask other tabs for session storage (this is ONLY to trigger event)
if (!sessionStorage.length) {
    localStorage.setItem('getSessionStorage', 'foobar');
    localStorage.removeItem('getSessionStorage', 'foobar');
};
//FUNCION PARA IR DIRECTO A CATEGORIA EN CATALOGO (todas las paginas)
let ventana = window.location.href;
async function actualizarCategory(categoria){
    let productsList = await (await fetch("/api/products")).json();
    let filtro = productsList.filter(producto => producto.category == categoria);
    sessionStorage.setItem("productsDisplaying", JSON.stringify(filtro));
    sessionStorage.setItem("category", categoria);
    if (window.location.pathname == "/") {
        window.location.href = ventana + "catalogo/catalogo.html";
    } else {
        window.location.href = window.location.href.replace(window.location.pathname, "/catalogo/catalogo.html");
    };
}

function eliminarCategory(){
    sessionStorage.removeItem("category");
    sessionStorage.removeItem("productsDisplaying");
}