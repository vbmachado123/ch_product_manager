const express = require("express");
const CartManager = require('../cart_manager');

const cartRouter = express.Router();

cartRouter.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit); 
    const carts = await CartManager.getCarts(limit);
    res.json(carts);
});

cartRouter.post('/', async (req, res) => {
    const newcart = req.body;
    console.log(newcart);
    const cart = await CartManager.addCart(newcart);
    res.json(cart);
});

cartRouter.post('/:id/product', async (req, res) => {
    const productId = req.query.productId;
    const cartId = req.params.id;
    
    if(!productId) {
        res.status(400).json({error: "product id is not valid"});
    }
    
    if(!cartId) {
        res.status(400).json({error: "cart id is not valid"});
    }

    const cart = await CartManager.addOnCart(cartId, productId);
    res.json(cart);
});

cartRouter.get('/:id', async (req, res) => {
    const cartId = req.params.id;
    const cart = await CartManager.findById(cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'cart not found' });
    }
});

cartRouter.put('/:id', async (req, res) => {
    const cartId = req.params.id;
    const updatedcart = req.body;
    const cart = await CartManager.updateCart(cartId, updatedcart);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'cart not found' });
    }
});

cartRouter.delete('/:id', async (req, res) => {
    const cartId = req.params.id;
    await CartManager.deleteCart(cartId);
    res.json({ message: 'cart deleted successfully' });
});

module.exports = cartRouter;