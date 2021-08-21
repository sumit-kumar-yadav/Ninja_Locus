const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, check } = require('express-validator');
const middleware = require('../config/middleware');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', 
    passport.checkAuthentication, 
    middleware.uploadAvatar,  // put file in the req
    body('email').isEmail(), // email must be an valid
    [
        check('name', 'Name is required').trim().notEmpty(),     // Only spaces should not present in the name
        check('name', 'Name format is wrong').isAlpha('en-US', {ignore: ' '})  // Name should be in english alphabets and white spaces can be ignored only
    ],
    usersController.update
);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', 
        body('email').isEmail(),  // email must be an valid
        body('password').isLength({ min: 5 }),  // password must be at least 5 chars long
        body('password').isLength({ max: 15 }),  // password must be at most 15 chars long
        [
            check('name', 'Name is required').trim().notEmpty(),     // Only spaces should not present in the name
            check('name', 'Name format is wrong').isAlpha('en-US', {ignore: ' '})  // Name should be in english alphabets and white spaces can be ignored only
        ],
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