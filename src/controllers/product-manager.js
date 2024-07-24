const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProduct() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            throw new Error(`Error al leer el archivo: ${error.message}`);
        }
    }

    async addProduct(obj) {
        try {
            const productos = await this.getProduct();
            const id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
            const newProduct = { id, ...obj };
            productos.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
            return 'Producto agregado correctamente';
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async getProductById(idProducto) {
        try {
            const productos = await this.getProduct();
            const producto = productos.find(p => p.id === idProducto);
            if (producto) {
                return producto;
            } else {
                throw new Error('No existe el producto');
            }
        } catch (error) {
            throw new Error(`Error al obtener producto por ID: ${error.message}`);
        }
    }

    async updateProduct(idProducto, camposActualizados) {
        try {
            const productos = await this.getProduct();
            const productoIndex = productos.findIndex(p => p.id === idProducto);

            if (productoIndex !== -1) {
                const productoActualizado = {
                    ...productos[productoIndex],
                    ...camposActualizados
                };
                productos[productoIndex] = productoActualizado;

                await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
                return 'Producto actualizado correctamente';
            } else {
                throw new Error('No existe el producto con el ID proporcionado');
            }
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async deleteProduct(idProducto) {
        try {
            const productos = await this.getProduct();
            const productoIndex = productos.findIndex(p => p.id === idProducto);

            if (productoIndex !== -1) {
                productos.splice(productoIndex, 1);
                await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
                return 'Producto eliminado correctamente';
            } else {
                throw new Error('No existe el producto con el ID proporcionado');
            }
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

module.exports = ProductManager;
