const express = require('express');
const repository = require("./repository");
const app = express();
const port = 3000;

app.get('/api/products', requestProducts(), (req, res) => {
  res.json(res.products);
});

app.get('/api/products/pages', async (req, res, next) => {
  let products = await repository.read();
  res.products = products;
  next();
}, (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const order = req.query.order;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const resultProducts = {};
  if (order === "menor") {
    res.products.sort(((a, b) => a.price - b.price));
  } 
  if (order === "mayor") {
    res.products.sort(((a, b) => b.price - a.price));
  }
  if (endIndex < res.products.length && startIndex > 0) {
    resultProducts.info = {
      next: `/api/products/pages?page=${page + 1}&limit=${limit}&order=${order}/`,
      prev: `/api/products/pages?page=${page - 1}&limit=${limit}&order=${order}/`,
    };
  } else if (endIndex < res.products.length) {
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
  resultProducts.results = res.products.slice(startIndex, endIndex);
  
  res.paginatedResults = resultProducts;
  next()
}, (req, res) => {
  res.json(res.paginatedResults);
});

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function requestProducts(orden) {
  return async (req, res, next) => {
    let products = await repository.read();
    if (orden === "menor") {
      products.sort(((a, b) => a.price - b.price));
    } 
    if (orden === "mayor") {
      products.sort(((a, b) => b.price - a.price));
    }
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

