const express = require('express');

const router = express.Router();
const friendshipController = require('../controllers/friendship_controller');


router.get('/toggle/:id', friendshipController.toggleFriendship);


module.exports = router;