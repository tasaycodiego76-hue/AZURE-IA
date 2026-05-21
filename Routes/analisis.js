const express = require('express');
const router = express.Router();
const analisisController = require('../Controllers/AnalisisController');

// POST /api/analisis
router.post('/', analisisController.analizarImagen);

module.exports = router;