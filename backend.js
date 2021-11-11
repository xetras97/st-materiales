const express = require('express');
const repository = require("./repository");
const mercadopago = require ('mercadopago');
const multer  = require('multer')
const upload = multer()
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let comprador = {
  nombre: "",
  apellido: "",
  email: "",
  dni: "",
  tel: "",
  direccion: "",
  altura: "",
  piso: "",
  depto: "",
  cp: "",
  provincia: "",
  localidad: "",
};

// app.post('/submit-form', (req, res) => {
//   let person = {
//     name: req.body.name,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     dni: req.body.dni,
//     tel: req.body.tel
//   }
//   res.send(person)
// })

app.get('/api/products', requestProducts(), (req, res) => {
  res.json(res.products);
});

app.get('/api/envios', async (req, res) => {
  let localidades = await repository.readEnvios()
  res.json(localidades);
});

app.get('/api/products/pages', async (req, res, next) => {
  let products = await repository.read();
  res.products = products;
  next();
}, (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const order = req.query.order;
  const category = req.query.category;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let products = res.products;

  const resultProducts = {};
  //NO FUNCIONA PORQUE GENERA OTRO ARRAY
  if (category == "deportes") {
    products = products.filter(producto => producto.category == "deportes");
  }
  if (category == "funcional") {
    products = products.filter(producto => producto.category == "funcional");
  }
  if (category == "yoga") {
    products = products.filter(producto => producto.category == "yoga");
  }
  if (category == "barrasydiscos") {
    products = products.filter(producto => producto.category == "barrasydiscos");
  }
  if (category == "promociones") {
    products = products.filter(producto => producto.category == "promociones");
  }
  if (order === "menor") {
    products.sort(((a, b) => a.price - b.price));
  } 
  if (order === "mayor") {
    products.sort(((a, b) => b.price - a.price));
  }
  if (order === "unorder") {
    products = products;
  }
  if (endIndex < products.length && startIndex > 0) {
    resultProducts.info = {
      next: `/api/products/pages?page=${page + 1}&limit=${limit}&order=${order}/`,
      prev: `/api/products/pages?page=${page - 1}&limit=${limit}&order=${order}/`,
    };
  } else if (endIndex < products.length) {
    resultProducts.info = {
      next: `/api/products/pages?page=${page + 1}&limit=${limit}&order=${order}/`,
      prev: "",
    };
  } else if (startIndex > 0) {
    resultProducts.info = {
      next: "",
      prev: `/api/products/pages?page=${page - 1}&limit=${limit}&order=${order}/`,
    };
  }
  resultProducts.results = products.slice(startIndex, endIndex);
  
  res.paginatedResults = resultProducts;
  next()
}, (req, res) => {
  res.json(res.paginatedResults);
});

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function requestProducts() {
  return async (req, res, next) => {
    let products = await repository.read();
    res.products = products;
    next()
  }
};

function pagination(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const resultProducts = {};

    if (endIndex < model.length && startIndex > 0) {
      resultProducts.info = {
        next: `/api/products/pages?page=${page + 1}&limit=16/`,
        prev: `/api/products/pages?page=${page - 1}&limit=16/`,
      };
    } else if (endIndex < model.length) {
      resultProducts.info = {
        next: `/api/products/pages?page=${page + 1}&limit=16/`,
        prev: "",
      };
    } else if (startIndex > 0) {
      resultProducts.info = {
        next: "",
        prev: `/api/products/pages?page=${page - 1}&limit=16/`,
      };
    }
    resultProducts.results = model.slice(startIndex, endIndex);

    res.paginatedResults = resultProducts;
    next()
  }
}

var path = require('path');

app.get('/catalogo/:name', requestProducts(), (req, res) => {
  let products = res.products
  let param = req.params.name
  if (products.some(element => element.id == param)) {
    res.sendFile(path.join(__dirname, "public/catalogo/producto.html"));
  } else {
    res.sendFile(path.join(__dirname, "public/notfound.html"));
  }
});

app.get('/checkout/carrito', (req, res) => {
  res.sendFile(path.join(__dirname, "public/detalles-orden.html"));
});

mercadopago.configure({
  access_token: 'APP_USR-4901376900016949-110714-f0a403b5ed979d5010c84305c61ee4a6-1014202756'
});

app.post("/mp", (req, res) => {
  let preference = {
		items: [],
    shipments: {
        "cost": req.body.envio,
        "mode": "not_specified",
    },
    payment_methods: {
      "excluded_payment_types": [
          {
              "id": "ticket"
          }
      ],
    },
    back_urls: {
			"success": "http://localhost:3000/feedback",
			"failure": "http://localhost:3000/feedback",
			"pending": "http://localhost:3000/feedback"
		},
		auto_return: "approved",
  }
  for (let i = 0; i < req.body.productos.length; i++) {
      preference.items.push({
        title: req.body.productos[i].titulo,
        unit_price: req.body.productos[i].precio,
        quantity: req.body.productos[i].cantidad,
      });
  };
  mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function(req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.post("/form", upload.none(), (req, res) => {
  comprador.nombre = req.body.name;
  comprador.apellido = req.body.lastName;
  comprador.email = req.body.email;
  comprador.dni = req.body.dni;
  comprador.tel = req.body.tel;
  res.sendStatus(200);
})

app.post("/forms", upload.none(), (req, res) => {
  comprador.direccion = req.body.street;
  comprador.altura = req.body.number;
  comprador.piso = req.body.piso;
  comprador.depto = req.body.depto;
  comprador.cp = req.body.postcode;
  comprador.provincia = req.body.provincia;
  comprador.localidad = req.body.localidad;
  res.sendStatus(200);
})

app.get('/form', (req, res) => {
  res.json(comprador);
});

app.get('/api/pedidos', async (req, res) => {
  let totalPedidos = await repository.readPedidos()
  let newTotal = Number(totalPedidos) + 1;
  console.log(newTotal);
  repository.writePedidos(newTotal);
  res.json(totalPedidos);
});