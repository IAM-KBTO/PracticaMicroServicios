const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
// Base de datos en memoria (incluye el 'stock' para el Reto Extra)
const libros = [
    { id: 1, titulo: "Clean Architecture", autor: "Robert C. Martin", precio: 450, stock: 10 },
    { id: 2, titulo: "The Pragmatic Programmer", autor: "Andrew Hunt", precio: 500, stock: 5 },
    { id: 3, titulo: "Patrones de Diseño", autor: "Erich Gamma", precio: 600, stock: 8 },
    { id: 4, titulo: "Grokking Algorithms", autor: "Aditya Bhargava", precio: 350, stock: 2 },
    { id: 5, titulo: "Libro Agotado", autor: "Autor Desconocido", precio: 200, stock: 0 } // Libro sin stock para pruebas
];

// Endpoint GET /api/libros/:id
app.get('/api/libros/:id', (req, res) => {
    const libroId = parseInt(req.params.id);
    const libro = libros.find(l => l.id === libroId);

    if (!libro) {
        // Retorna 404 si el libro no existe en el arreglo
        return res.status(404).json({ error: "Libro no encontrado en el catálogo." });
    }
    
    // Retorna 200 OK con los datos del libro
    res.status(200).json(libro);
});
// Endpoint PUT para reducir el stock después de una compra
app.put('/api/libros/:id/reducir-stock', (req, res) => {
    const libroId = parseInt(req.params.id);
    const { cantidad } = req.body;
    const libro = libros.find(l => l.id === libroId);

    if (!libro) return res.status(404).json({ error: "Libro no encontrado." });
    if (libro.stock < cantidad) return res.status(400).json({ error: "Stock insuficiente." });

    libro.stock -= cantidad; // Reducimos el stock real en memoria
    res.status(200).json({ mensaje: "Stock actualizado", stockRestante: libro.stock });
});
app.listen(PORT, () => {
    console.log(`📚 Servicio de Catálogo corriendo en http://localhost:${PORT}`);
});