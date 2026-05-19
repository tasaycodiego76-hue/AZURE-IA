const express = require('express');
const router = express.Router();
const extraccionController = require('../Controllers/ExtraccionController');

// POST /api/extraccion
router.post('/', extraccionController.extraerDatos);

module.exports = router;
