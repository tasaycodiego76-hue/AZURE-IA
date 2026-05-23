const express = require('express');
const router  = express.Router();
const chatController = require('../Controllers/ChatController');

// POST /api/chat
router.post('/', chatController.chat);

module.exports = router;