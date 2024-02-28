const express = require("express");
const ProductManager = require('../product_manager');

function productRouterWithIO(server) {

    const productRouter = express.Router();
    const io = require('socket.io')(server); 

    productRouter.get('/', async (req, res) => {
        const limit = parseInt(req.query.limit);
        const products = await ProductManager.getProducts(limit);
        // res.json(products);
        res.render('home', { products });
    });

    productRouter.get('/realtimeproducts', (req, res) => {
        res.render('realtimeproducts');
    });

    async function emitProductList() {
        try {
            const products = await ProductManager.getAllProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error(error);
        }
    }

    productRouter.post('/webhook/products', (req, res) => {
        emitProductList();
        res.sendStatus(200);
    });
    
    io.on('connection', (socket) => {
        console.log('Cliente conectado');
    
        // Emitindo a lista de produtos quando um cliente se conecta
        emitProductList();
    
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
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
    
    return productRouter;
}
module.exports = productRouterWithIO;