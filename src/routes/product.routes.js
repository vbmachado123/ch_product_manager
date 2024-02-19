const express = require("express");
const ProductManager = require('../product_manager');

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit); 
    const products = await ProductManager.getProducts(limit);
    res.json(products);
});

productRouter.post('/', async (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    const product = await ProductManager.addProduct(newProduct);
    res.json(product);
});

productRouter.get('/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await ProductManager.findById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

productRouter.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const product = await ProductManager.updateProduct(productId, updatedProduct);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

productRouter.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    await ProductManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
});

module.exports = productRouter;