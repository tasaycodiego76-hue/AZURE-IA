const express = require('express');
const router = express.Router();
const imagenController = require('../Controllers/ImagenController');

// POST /api/analisis
router.post('/', imagenController.analizarImagen);

module.exports = router;