const express = require('express');
const router = express.Router();
const anonimizarController = require('../Controllers/AnonimizarController');

// POST /api/anonimizar
router.post('/', anonimizarController.anonimizarDatos);

module.exports = router;