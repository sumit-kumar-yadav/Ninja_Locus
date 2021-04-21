const express = require('express');

const router = express.Router();
const friendshipController = require('../controllers/friendship_controller');


router.get('/toggle/:id', friendshipController.toggleFriendship);
router.get('/accept-request/:id', friendshipController.acceptRequest);
router.get('/delete-request/:id', friendshipController.deleteRequest);
router.get('/remove-friend/:id', friendshipController.removeFriend);


module.exports = router;