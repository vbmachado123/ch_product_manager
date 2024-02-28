const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const pathView = path.join(`${__dirname}/views`);
const viewsRouter = require("./routes/view.routes");
const socketIO = require("socket.io");

const http = require("http");
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", pathView);

const staticPath = path.join(`${__dirname}/public`);

app.use("/static", express.static(staticPath));

app.use("/views", viewsRouter);

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const productRouterWithIO = require('./routes/product.routes');
app.use('/products', productRouterWithIO(io));

const cartRouter = require("./routes/cart.routes");
app.use("/carts", cartRouter);


io.on('connection', (socket) => {
    console.log('Cliente conectado');
});
module.exports = app;