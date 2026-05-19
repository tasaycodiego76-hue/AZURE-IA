require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta Public
app.use(express.static('Public'));

// Importar las rutas
const extraccionRoutes = require('./Routes/extraccion');
const sentimientosRoutes = require('./Routes/sentimientos');

// Usar las rutas
app.use('/api/extraccion', extraccionRoutes);
app.use('/api/sentimientos', sentimientosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado y escuchando en http://localhost:${PORT}`);
});
