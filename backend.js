const express = require('express');
const repository = require("./repository");
const app = express();
const port = 3000;

app.get('/api/products', async (req, res) => {
  res.send(await repository.read());
})

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
