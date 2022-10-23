const express = require('express');
const passport = require('passport');
const router = express.Router();
const friendshipController = require('../controllers/friendship_controller');


router.get('/toggle/:id', passport.checkAuthentication, friendshipController.toggleFriendship);
router.get('/accept-request/:id', passport.checkAuthentication, friendshipController.acceptRequest);
router.get('/delete-request/:id', passport.checkAuthentication, friendshipController.deleteRequest);
router.get('/remove-friend/:id', passport.checkAuthentication, friendshipController.removeFriend);
router.get('/getFriends/:id', passport.checkAuthentication, friendshipController.getFriends);

module.exports = router;