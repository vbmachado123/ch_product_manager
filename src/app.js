const express = require("express");

const ProductManager = require('./product_manager');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit); 
    const products = await ProductManager.getProducts(limit);
    res.json(products);
});

app.post('/products', async (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    const product = await ProductManager.addProduct(newProduct);
    res.json(product);
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await ProductManager.findById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const product = await ProductManager.updateProduct(productId, updatedProduct);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    await ProductManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
});


module.exports = app;