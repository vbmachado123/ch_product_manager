const express = require("express");

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

const productRouter = require("./routes/product.routes");
app.use("/products", productRouter);

const cartRouter = require("./routes/cart.routes");
app.use("/carts", cartRouter);

module.exports = app;