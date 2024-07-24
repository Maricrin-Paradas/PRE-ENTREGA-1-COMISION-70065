const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager");
const productManager = new ProductManager("src/models/products.json");

// Solicitud GET para obtener todos los productos o un número limitado de productos
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const productos = await productManager.getProduct();
        
        if (isNaN(limit)) {
            res.json(productos);
        } else {
            res.json(productos.slice(0, limit));
        }
    } catch (error) {
        console.error("Error al obtener los productos:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Solicitud GET para obtener un producto específico por su ID
router.get("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const producto = await productManager.getProductById(id);
        
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({
                error: "No se encontró ningún producto con ese ID"
            });
        }
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Solicitud POST para agregar un nuevo producto
router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado con éxito"
        });
    } catch (error) {
        console.error("Error al guardar el producto:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Solicitud PUT para actualizar un producto existente por su ID
router.put("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const newAttributes = req.body;
        await productManager.updateProduct(id, newAttributes);
        res.json({
            message: "Producto actualizado con éxito"
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Solicitud DELETE para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado con éxito"
        });
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router;
