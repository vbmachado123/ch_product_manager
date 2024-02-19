const fs = require("fs").promises;
const { v4: uuidv4 } = require('uuid');
const ProductManager = require('./product_manager');

class CartManager {
    #pathData = `${__dirname}/data/carts.json`;

    constructor() { }

    async readCartsFile() {
        try {
            const data = await fs.readFile(this.#pathData, 'utf-8');
            return JSON.parse(data);
        } catch (ex) {
            console.error(ex.message);
            return [];
        }
    }

    async writeCartsFile(data) {
        const carts = JSON.stringify(data, null, 2);

        await fs.writeFile(this.#pathData, carts, 'utf-8');
    }

    async addCart(cart) {
        const carts = await this.readCartsFile();
        console.log(`Cart: ${cart}`);
        const newItem = {
            id: uuidv4(),
            ...cart
        };
        carts.push(newItem);

        await this.writeCartsFile(carts);

        console.log(`Cart created with success: ${JSON.stringify(newItem)}`);

        return newItem;
    }
    
    async addOnCart(cartId, productId) {
        const product = await ProductManager.findById(productId);
    
        if (!product) {
            console.log(`Product not found for id: ${productId}`);
            return null;
        }
    
        let carts = await this.readCartsFile();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
    
        if (cartIndex !== -1) {
            const updatedCart = { ...carts[cartIndex] };
            const productMap = { ...updatedCart.products };
    
            if (productMap[productId]) {
                productMap[productId] += 1;
            } else {
                productMap[productId] = 1;
            }
    
            updatedCart.products = productMap;
            carts[cartIndex] = updatedCart;
    
            await this.writeCartsFile(carts);
    
            console.log(`Cart updated with success: ${JSON.stringify(updatedCart)}`);
            return updatedCart;
        } else {
            console.log(`Cart not found for id: ${cartId}`);
        }
    
        return null;
    }
    

    async getCarts(limit) {
        const allData = await this.readCartsFile();

        if (limit) {

            const limitedData = allProducts.slice(0, limit);
            return limitedData;
        }

        return allData;
    }

    async findById(id) {
        const items = await this.readCartsFile();

        const item = items.find(p => p.id === id);

        if (item) {
            console.log(`Cart found: ${JSON.stringify(item)}`);
            return item;
        } else {
            console.log(`Cart not found for id: ${id}`);
            return null;
        }
    }

    async updateCart(id, updatedCart) {
        const items = await this.readCartsFile();
        const index = items.findIndex(p => p.id === id);

        if (index !== -1) {
            items[index] = {
                id,
                ...updatedCart
            };

            await this.writeCartsFile(items);

            console.log(`Cart updated with success: ${JSON.stringify(updatedCart)}`);

            return updatedCart;
        } else {
            console.log(`Cart not found for id: ${id}`);
        }
    }

    async deleteCart(id) {
        const items = await this.readCartsFile();

        const filteredItems = items.filter(p => p.id !== id);

        if (filteredItems.length < items.length) {
            await this.writeCartsFile(filteredItems);
            console.log(`Cart with id: ${id} deleted!`);
        } else {
            console.error(`Cart not found for id: ${id}`);
        }
    }
}

const cartManager = new CartManager();

module.exports = cartManager;