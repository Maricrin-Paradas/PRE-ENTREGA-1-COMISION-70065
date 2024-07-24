const express = require("express");
const app = express();
const productsRouter = require("./src/routes/products.routes");
const cartsRouter = require("./src/routes/carts.routes");

// Puerto al que se conectará el servidor
const PUERTO = 8080;

// Middlewares para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para manejar productos y carritos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar el servidor y escuchar el puerto especificado
app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
});
