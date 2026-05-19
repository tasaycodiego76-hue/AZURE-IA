const express = require('express');
const router = express.Router();
const sentimientosController = require('../Controllers/SentimientosController');

// POST /api/sentimientos
router.post('/', sentimientosController.analizarSentimientos);

module.exports = router;
