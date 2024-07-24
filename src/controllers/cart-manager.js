const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCart() {
        try {
            console.log(this.path);
                const info = await fs.readFile(this.path, 'utf-8');
                return JSON.parse(info) || [];

        } catch (error) {
            throw new Error(`Error al leer el archivo: ${error.message}`);
        }
    }

    async addCart(obj) {
        try {
            const carts = await this.getCart();
            let id = 1;

            if (carts.length > 0) {
                id = carts[carts.length - 1].id + 1;
            }

            const newCart = { id, products: [] };
            carts.push(newCart);

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

            return 'Carrito agregado correctamente';
        } catch (error) {
            throw new Error(`Error al agregar carrito: ${error.message}`);
        }
    }

    async getCartById(idCart) {
        try {
            const carts = await this.getCart();
            const cart = carts.find(u => u.id === idCart);
            if (cart) {
                return cart;
            } else {
                throw new Error('No existe el carrito');
            }
        } catch (error) {
            throw new Error(`Error al obtener carrito por ID: ${error.message}`);
        }
    }

    async saveCart() {
        try {
            const carts = await this.getCart();
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error(`Error al guardar carritos: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const carts = await this.getCart();
            console.log(carts);
            const cartIndex = carts.findIndex(u => u.id === cartId);

            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const productIndex = cart.products.findIndex(p => p.product === productId);

                if (productIndex !== -1) {
                    cart.products[productIndex].quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }

                carts[cartIndex] = cart;

                await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

                return cart;
            } else {
                throw new Error('No existe el carrito');
            }
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
}

module.exports = CartManager;
