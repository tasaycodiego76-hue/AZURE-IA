const express = require('express');
const router = express.Router();
const resumenController = require('../Controllers/ResumenController');

// POST /api/resumen
router.post('/', resumenController.resumirTexto);

module.exports = router;