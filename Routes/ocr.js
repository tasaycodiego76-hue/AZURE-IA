const express = require('express')
const router = express.Router()

const OCRController = require('../Controllers/OcrController')

// POST /api/ocr
router.post('/', OCRController.leerTextoImagen)

module.exports = router