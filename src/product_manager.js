const fs = require("fs").promises;
const { v4: uuidv4 } = require('uuid');

class ProductManager {
    #pathData = `${__dirname}/data/products.json`;
    constructor() {}

    async readProductsFile() {
        try {
            const data = await fs.readFile(this.#pathData, 'utf-8');
            return JSON.parse(data);
        } catch (ex) {
            console.error(ex.message);
            return [];
        }
    }

    async writeProductsFile(data) {
        const products = JSON.stringify(data, null, 2);

        await fs.writeFile(this.#pathData, products, 'utf-8');
    }

    async addProduct(product) {
        const products = await this.readProductsFile();
        console.log(`Product: ${product}`);
        const newProduct = {
            id: uuidv4(),
            ...product
        };
        products.push(newProduct);

        await this.writeProductsFile(products);

        console.log(`Product added with success: ${JSON.stringify(newProduct)}`);

        return newProduct;
    }

    async getProducts(limit) {
        const allProducts = await this.readProductsFile();

        if (limit) {
        
            const limitedProducts = allProducts.slice(0, limit);
            return limitedProducts;
        }
        
        return allProducts;
    }

    async findById(id) {
        const products = await this.readProductsFile();

        const product = products.find(p => p.id === id);

        if (product) {
            console.log(`Product found: ${JSON.stringify(product)}`);
            return product;
        } else {
            console.log(`Product not found for id: ${id}`);
            return null;
        }
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.readProductsFile();
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
            products[index] = {
                id,
                ...updatedProduct
            };

            await this.writeProductsFile(products);

            console.log(`Product updated with success: ${JSON.stringify(updatedProduct)}`);

            return updatedProduct;
        } else {
            console.log(`Product not found for id: ${id}`);
        }
    }

    async deleteProduct(id) {
        const products = await this.readProductsFile();

        const filteredProducts = products.filter(p => p.id !== id);

        if (filteredProducts.length < products.length) {
            await this.writeProductsFile(filteredProducts);
            console.log(`Product with id: ${id} deleted!`);
        } else {
            console.error(`Product not found for id: ${id}`);
        }
    }
}

const productManager = new ProductManager();

module.exports = productManager;