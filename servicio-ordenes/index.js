const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware para procesar JSON en el body
app.use(express.json());

// Arreglo en memoria para guardar ventas
let ordenes = [];
let contadorId = 1;

// Endpoint POST /api/ordenes
app.post('/api/ordenes', async (req, res) => {
    const { libroId, cantidad, cliente } = req.body;

    try {
        // Comunicación HTTP síncrona: Consultar al Servicio de Catálogo
        const URL_CATALOGO = process.env.URL_CATALOGO || 'http://localhost:3001';
        const response = await axios.get(`${URL_CATALOGO}/api/libros/${libroId}`);
        const libro = response.data;

        // RETO EXTRA: Verificar si hay stock suficiente
        if (libro.stock < cantidad) {
            return res.status(400).json({
                error: "Stock insuficiente para realizar la compra.",
                stockDisponible: libro.stock,
                cantidadSolicitada: cantidad
            });
        }

        // Si todo está bien, calcular total y registrar la orden
        const totalAPagar = libro.precio * cantidad;
        
        await axios.put(`${URL_CATALOGO}/api/libros/${libroId}/reducir-stock`, {
            cantidad: cantidad
        });
        const nuevaOrden = {
            id: contadorId++,
            cliente: cliente,
            libroId: libro.id,
            tituloLibro: libro.titulo,
            cantidadComprada: cantidad,
            totalAPagar: totalAPagar,
            fecha: new Date().toISOString()
        };

        ordenes.push(nuevaOrden);

        // Responder con 201 Created
        res.status(201).json({
            mensaje: "Orden generada exitosamente.",
            orden: nuevaOrden
        });

    } catch (error) {
        // Manejo de errores: Si Axios recibe un 404 del Catálogo
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "Operación rechazada: El ID del libro no existe en el catálogo." });
        }
        
        // Cualquier otro error (ej. el puerto 3001 está apagado)
        res.status(500).json({ error: "Error interno de comunicación entre microservicios." });
    }
});

app.listen(PORT, () => {
    console.log(`🛒 Servicio de Órdenes corriendo en el puerto: ${PORT}`);
});