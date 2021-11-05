// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')
  

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

const checkbox = document.getElementById("myToggle");
checkbox.addEventListener("change", displayForm, false);
const inputProvincias = document.getElementById("inputProvincia");
const inputLocalidad = document.getElementById("inputLocalidad");
let deliveryData;
let personalData;
let subtotal = 0;
let total = 0;
let envio = 0;

if (window.addEventListener) {
  window.addEventListener("load", displayCarritoItems, false);
} else {
  window.attachEvent("onload", displayCarritoItems);
};


document.getElementById("personal-form").addEventListener("submit", (event) =>{
  event.preventDefault();
  if (document.getElementById("personal-form").checkValidity()) {
    personalData = new FormData(event.currentTarget);
    document.getElementById("panelsStayOpen-collapseOne").classList.remove("show");
    document.getElementById("btn-datos-personales").classList.add("collapsed");
    document.getElementById("panelsStayOpen-collapseTwo").classList.add("show");
    document.getElementById("btn-envio").classList.remove("collapsed");
    document.getElementById("btn-envio").removeAttribute("disabled", "");
    displayProvincias();
  };
})

document.getElementById("envio-form").addEventListener("submit", (event) =>{
  event.preventDefault();
  if (document.getElementById("envio-form").checkValidity()) {
    deliveryData = new FormData(event.currentTarget);
    document.getElementById("panelsStayOpen-collapseTwo").classList.remove("show");
    document.getElementById("btn-envio").classList.add("collapsed");
    document.getElementById("panelsStayOpen-collapseThree").classList.add("show");
    document.getElementById("btn-pago").classList.remove("collapsed");
    document.getElementById("btn-pago").removeAttribute("disabled", "")
    document.getElementById("mercadopago").innerHTML = "";
    calcularEnvio();
  };
})

document.getElementById("retiro-form").addEventListener("submit", (event) =>{
  event.preventDefault();
  if (document.getElementById("retiro-form").checkValidity()) {
    deliveryData = new FormData(event.currentTarget);
    document.getElementById("panelsStayOpen-collapseTwo").classList.remove("show");
    document.getElementById("btn-envio").classList.add("collapsed");
    document.getElementById("panelsStayOpen-collapseThree").classList.add("show");
    document.getElementById("btn-pago").classList.remove("collapsed");
    document.getElementById("btn-pago").removeAttribute("disabled", "")
    document.getElementById("mercadopago").innerHTML = "";
    envioEnRetiro();
  };
})

function displayForm () {
  let envioForm = document.getElementById("envio-form");
  let retiroForm = document.getElementById("retiro-form");
  if (checkbox.checked) {
    envioForm.classList.add("d-none");
    retiroForm.classList.remove("d-none");
  } else {
    retiroForm.classList.add("d-none");
    envioForm.classList.remove("d-none");
  }
};

async function displayProvincias() {
  let provincias = await (await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre")).json();
  provincias.provincias.sort(function (o1,o2) {
    if (o1.nombre > o2.nombre) {
      return 1;
    } else if (o1.nombre < o2.nombre) {
      return -1;
    } 
    return 0;
  });
  let provinciaList;
  provincias.provincias.forEach(provincia => {
    provinciaList += `<option value="${provincia.nombre}">`
  });
  document.getElementById("provincias").innerHTML = provinciaList;
};

async function displayLocalidades(provincia) {
  inputLocalidad.value = "";
  if ((inputProvincias.value == "Buenos Aires")) {
    let localidades = await (await fetch("/api/envios")).json();
    let localidadesList;
    localidades.forEach(localidad => {
      localidadesList += `<option value="${localidad.name}">`
    });
    document.getElementById("localidades").innerHTML = localidadesList;
  } else if (inputProvincias.value !== "") {
    let localidades = await (await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&campos=id,nombre&max=100`)).json();
    localidades.localidades.sort(function (o1,o2) {
      if (o1.nombre > o2.nombre) {
        return 1;
      } else if (o1.nombre < o2.nombre) {
        return -1;
      } 
      return 0;
    });
    let localidadesList;
    localidades.localidades.forEach(localidad => {
      localidadesList += `<option value="${localidad.nombre}">`
    });
    document.getElementById("localidades").innerHTML = localidadesList;
  }
};

function displayCarritoItems (){
  // carrito definido en carrito.js //
  carrito.forEach(element => {
      document.getElementById("detalles-item-container").innerHTML += `
      <div class="d-flex justify-content-between mt-1 px-2">
          <p class="card-text text-muted">${element.name}</p>
          <p class="card-text text-muted">$${element.price}</p>
      </div>
      `
      subtotal += element.price;
  });
  document.getElementById("carrito-subtotal").innerText += subtotal;
  document.getElementById("carrito-total").innerText += subtotal;
};

async function calcularEnvio() {
  if (inputProvincias.value == "Buenos Aires" || inputProvincias.value == "Ciudad Autónoma de Buenos Aires") {
    let localidades = await (await fetch("/api/envios")).json();
    let localidad;
    if (inputProvincias.value == "Buenos Aires" && localidades.some(elem => elem.name == inputLocalidad.value)){
      localidad = localidades.find(element => element.name == inputLocalidad.value);
      total = subtotal + localidad.price;
      envio = localidad.price;
      document.getElementById("price-envio").innerText = `$${localidad.price}`;
    } else if (inputProvincias.value == "Ciudad Autónoma de Buenos Aires" && localidades.some(elem => elem.name == inputProvincias.value)) {
      localidad = localidades.find(element => element.name == inputProvincias.value);
      total = subtotal + localidad.price;
      envio = localidad.price;
      document.getElementById("price-envio").innerText = `$${localidad.price}`;
    } else {
      total = subtotal;
      envio = 0;
      document.getElementById("price-envio").innerText = "Coordinar";
    }
    document.getElementById("carrito-total").innerText = `$${total}`;
  } else {
    total = subtotal;
    envio = 0;
    document.getElementById("price-envio").innerText = "Coordinar";
    document.getElementById("carrito-total").innerText = `$${total}`;
  }
};

function envioEnRetiro () {
  total = subtotal;
  envio = 0;
  document.getElementById("price-envio").innerText = "0";
  document.getElementById("carrito-total").innerText = `$${total}`;
}

// MERCADOPAGO

const mercadopago = new MercadoPago('TEST-9deedcc5-360f-40c7-878a-d49d19c6adf2', {
  locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

document.getElementById('btn-checkout').addEventListener("click", function (){
  let orden = {
    envio: envio,
    productos: []
  };
  carrito.forEach(element => {
    orden.productos.push({
      titulo: element.name,
      precio: element.price,
      cantidad: 1
    });
  });

  fetch("/mp",{
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(orden)
  })
    .then(function(response) {
        return response.json();
    })
    .then(function(preference) {
        createCheckoutButton(preference.id);
    })
    .catch(function() {
        alert("Unexpected error");
    });
})

function createCheckoutButton(preferenceId) {
  // Initialize the checkout
  mercadopago.checkout({
    preference: {
      id: preferenceId
    },
    render: {
      container: '.mercadopago-container', // Class name where the payment button will be displayed
      label: 'Pagar', // Change the payment button text (optional)
    }
  });
};  