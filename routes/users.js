const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body } = require('express-validator');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

// Creating a new user while sign-up
router.post('/create', 
        body('email').isEmail(),  // email must be an valid
        body('password').isLength({ min: 5 }),  // password must be at least 5 chars long
        body('password').isLength({ max: 15 }),  // password must be at most 15 chars long
        usersController.create
    );

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

// Route to sign in / sign up by google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
// Route for the callback sent by the google after verifyiing the user
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports = router;