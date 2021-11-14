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
let entrega = "Envio";

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
    fetch("/form", {
      method: "POST",
      body: personalData
    });
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
    document.getElementById("btn-efectivo").classList.add("d-none")
    limpiarMetodos();
    calcularEnvio();
    fetch("/forms", {
      method: "POST",
      body: deliveryData
    });
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
    document.getElementById("btn-efectivo").classList.remove("d-none")
    limpiarMetodos();
    envioEnRetiro();
  };
})

function displayForm () {
  let envioForm = document.getElementById("envio-form");
  let retiroForm = document.getElementById("retiro-form");
  if (checkbox.checked) {
    envioForm.classList.add("d-none");
    retiroForm.classList.remove("d-none");
    entrega = "Retiro";
  } else {
    retiroForm.classList.add("d-none");
    envioForm.classList.remove("d-none");
    entrega = "Envio";
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
          <p class="card-text text-muted">${element.cantidad} x ${element.name}</p>
          <p class="card-text text-muted">$${element.price * element.cantidad}</p>
      </div>
      `
      subtotal += (element.price * element.cantidad);
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

const mercadopago = new MercadoPago('APP_USR-ced17b9d-afb5-467a-afbe-b58e0712fa94', {
  locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

document.getElementById('btn-checkout').addEventListener("click", function (){
  limpiarMetodos();
  sessionStorage.setItem("total", total);
  document.getElementById('mercadopago').classList.remove("d-none");
  if (entrega == "Retiro" || envio == 0) {
    whatsappCheckout("Mercado Pago");
  } else {
    let orden = {
      envio: envio,
      productos: [],
      payer: {
        name: personalData.get("name"),
        surname: personalData.get("lastName"),
        email: personalData.get("email"),
        date_created: "",
        phone: {
          area_code: "",
          number: personalData.get("tel")
        },
         
        identification: {
          type: "DNI",
          number: personalData.get("dni")
        },
        
        address: {
          street_name: deliveryData.get("street"),
          street_number: deliveryData.get("number"),
          zip_code: deliveryData.get("postcode")
        }
      }
    };
    console.log(orden)
    carrito.forEach(element => {
      orden.productos.push({
        titulo: element.name,
        precio: element.price,
        cantidad: element.cantidad
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
  }
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

// WhatsApp

function whatsappCheckout (metodoDePago) {
  let ordenWpp = ``;
  document.getElementById("whatsapp").classList.remove("d-none");
  if (metodoDePago == "Efectivo") {
    document.getElementById("wpp-text").innerText = "La compra finalizará via WhatsApp para coordinar la entrega y el pago";
  } else if (metodoDePago == "Mercado Pago") {
    document.getElementById("wpp-text").innerText = "La compra finalizará via WhatsApp para coordinar la entrega y recibir el link de pago";
  } else {
    document.getElementById("wpp-text").innerText = "Finalizá el pedido via WhatsApp para recibir los datos de cuenta y coordinar la entrega de los productos";
  };

  if (entrega == "Retiro") {
    ordenWpp = `Hola, este es mi pedido:
    *Productos:* ${productosName()}
    *Precio*: $${carritoSuma()}
    *Metodo de pago:* ${metodoDePago}
    *Entrega:* ${entrega} | ${deliveryData.get("retiro")}
    *Datos personales:*
    *Nombre:* ${personalData.get("name")} ${personalData.get("lastName")}
    *Mail:* ${personalData.get("email")}
    *Telefono:* ${personalData.get("tel")}
    `
  } else {
    ordenWpp = `Hola, este es mi pedido:
    *Productos:* ${productosName()}
    *Precio de productos*: $${carritoSuma()}
    *Metodo de pago:* ${metodoDePago}
    *Entrega:* ${entrega} | ${document.getElementById("price-envio").innerText}
    *Datos personales:*
    *Nombre:* ${personalData.get("name")} ${personalData.get("lastName")}
    *Mail:* ${personalData.get("email")}
    *Telefono:* ${personalData.get("tel")}
    *Datos de envio:*
    *Domicilio:* ${deliveryData.get("street")} ${deliveryData.get("number")} ${deliveryData.get("piso")} ${deliveryData.get("depto")}
    *Cod. Postal:* ${deliveryData.get("postcode")}
    *Provincia:* ${deliveryData.get("provincia")}
    *Localidad:* ${deliveryData.get("localidad")}
    `
  }
  
  document.getElementById("wpp-btn").setAttribute("href", `https://wa.me/5491156078168/?text=${encodeURIComponent(ordenWpp)}`)
};

function productosName() {
  let productosText = "";
  for (let p = 0; p < carrito.length; p++) {
    productosText += `\n${carrito[p].cantidad} x ${carrito[p].name}`;
  }
  return productosText;
}

function carritoSuma() {
  let precio = 0;
  carrito.forEach(element => {
    precio += (element.price * element.cantidad)
  });
  return precio;
}

function limpiarMetodos(){
  document.getElementById("wpp-text").innerText = "";
  document.getElementById("whatsapp").classList.add("d-none");
  document.getElementById("mercadopago").innerHTML = ""
  document.getElementById('mercadopago').classList.remove("d-none");
};