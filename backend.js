const express = require('express')
const app = express()
const port = 3000

const products = [
    {
        id: 1,
        name: "hola",
        image: "./assets/materiales/192f239f-aadf-45bb-9eb5-afd22059ab31.jpg",
        price: 50,
    },
    {
        id: 2,
        name: "hola",
        image: "./assets/materiales/192f239f-aadf-45bb-9eb5-afd22059ab31.jpg",
        price: 50,
    },
    {
        id: 3,
        name: "hola",
        image: "./assets/materiales/192f239f-aadf-45bb-9eb5-afd22059ab31.jpg",
        price: 50,
    },
    {
        id: 4,
        name: "hola",
        image: "./assets/materiales/192f239f-aadf-45bb-9eb5-afd22059ab31.jpg",
        price: 50,
    },
    {
        id: 5,
        name: "hola",
        image: "./assets/materiales/192f239f-aadf-45bb-9eb5-afd22059ab31.jpg",
        price: 50,
    },
]

app.get('/api/products', (req, res) => {
  res.send(products)
})

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})