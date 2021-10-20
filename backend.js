const express = require('express');
const repository = require("./repository");
const app = express();
const port = process.env.PORT || 3000;

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
// app.get('/catalogo/hola', (req, res) => {
//   res.sendFile(path.join(__dirname, "public/catalogo/producto.html"));
// });

app.get('/catalogo/:name', requestProducts(), (req, res) => {
  let products = res.products
  let param = req.params.name
  if (products.some(element => element.id == param)) {
    res.sendFile(path.join(__dirname, "public/catalogo/producto.html"));
  } else {
    res.sendFile(path.join(__dirname, "public/notfound.html"));
  }
});

// var fs = require('fs');

// // Change the content of the file as you want
// // or either set fileContent to null to create an empty file
// var fileContent = "Hello World!";

// // The absolute path of the new file with its name
// var filepath = "public/mynewfile.html";

// fs.writeFile(filepath, fileContent, (err) => {
//     if (err) throw err;

//     console.log("The file was succesfully saved!");
// }); 
