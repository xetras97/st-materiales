const express = require('express');
const repository = require("./repository");
const app = express();
const port = 3000;

app.get('/api/products', async (req, res) => {
  res.send(await repository.read())
});

app.get('/api/products/pages', async (req, res) => {
  let products = await repository.read();
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const resultProducts = {};

  if (endIndex < products.length) {
    resultProducts.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    resultProducts.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  resultProducts.results = products.slice(startIndex, endIndex);
  res.json(resultProducts)
});

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
