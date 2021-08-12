const express = require('express');
const router = express.Router();
const passport = require('passport');

const searchController = require('../controllers/search_controller');

router.get('/', passport.checkAuthentication, searchController.searchUser);


module.exports = router;