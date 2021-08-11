const express = require('express');
const router = express.Router();
const passport = require('passport');

const chatsController = require('../controllers/chats_controller');

// Fetch al the chats
router.get('/', passport.checkAuthentication, chatsController.chats);

// Send message
router.post('/create', passport.checkAuthentication, chatsController.create);

// Mark the messages as read
router.get('/readMessages', passport.checkAuthentication, chatsController.readMessages);

// Check the unread messages if user refreshes of logs in
router.get('/checkUnreadMessages', chatsController.checkUnreadMessages);

module.exports = router;