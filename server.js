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
const analisisRoutes = require('./Routes/analisis');
const resumenRoutes = require('./Routes/resumen');
const ocrRoutes = require('./Routes/ocr');
const imagenRoutes = require('./Routes/imagen');
const anonimizarRoutes = require('./Routes/anonimizar');

// Usar las rutas
app.use('/api/extraccion', extraccionRoutes);
app.use('/api/sentimientos', sentimientosRoutes);
app.use('/api/resumen', resumenRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/imagen', imagenRoutes);
app.use('/api/anonimizar', anonimizarRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado y escuchando en http://localhost:${PORT}`);
});
