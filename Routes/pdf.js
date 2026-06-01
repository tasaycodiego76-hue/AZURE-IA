const express = require('express');
const router = express.Router();
const pdfController = require('../Controllers/PdfController');

// POST /api/pdf/url     → PDF por URL pública
router.post('/url', pdfController.analizarPorUrl);

// POST /api/pdf/archivo → PDF local como octet-stream (sin multer)
router.post('/archivo', express.raw({ type: 'application/octet-stream', limit: '10mb' }), pdfController.analizarPorArchivo);

module.exports = router;