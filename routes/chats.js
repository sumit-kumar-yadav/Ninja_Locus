const express = require('express');
const router = express.Router();
const passport = require('passport');

const chatsController = require('../controllers/chats_controller');

// Fetch al the chats
router.get('/', passport.checkAuthentication, chatsController.chats);

// Send message
router.post('/create', passport.checkAuthentication, chatsController.create);

module.exports = router;