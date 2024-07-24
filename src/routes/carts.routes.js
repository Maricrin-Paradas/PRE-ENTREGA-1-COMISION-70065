const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager");

const cartManager = new CartManager("src/models/carts.json");

// Maneja la solicitud GET para obtener todos los carritos o un número limitado de carritos.
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const carts = await cartManager.getCart();
        if (limit) {
            res.json(carts.slice(0, limit));
        } else {
            res.json(carts);
        }
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Maneja la solicitud GET para obtener un carrito específico por su ID.
router.get("/:cid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const carts = await cartManager.getCart();
        const cart = carts.find(cart => cart.id === cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({
                error: "No se encontró ningún carrito con ese ID"
            });
        }
    } catch (error) {
        console.error("Error al obtener el carrito por ID:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Maneja la solicitud POST para crear un nuevo carrito.
router.post("/", async (req, res) => {
    try {
        const newCart = req.body;
        await cartManager.addCart(newCart);
        res.status(201).json({
            message: "Carrito creado exitosamente"
        });
    } catch (error) {
        console.error("Error al crear el carrito:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Maneja la solicitud POST para agregar un producto a un carrito específico.
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error.message);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router;
