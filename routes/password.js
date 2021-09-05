const express = require('express');
const { body, check } = require('express-validator');
const passwordController = require('../controllers/password_controller');

const router = express.Router();

router.get('/forgot', passwordController.forgotPassword);  // route for renderig the email matching page
router.post('/recover', passwordController.recoverPassword);  // route for recovering password through email
router.get('/reset/', passwordController.resetPasswordForm)   // route for reset password form

// Reset thet password
router.post('/reset-password/:token',
    body('password').isLength({ min: 5 }),  // password must be at least 5 chars long
    body('password').isLength({ max: 15 }),  // password must be at most 15 chars long
    passwordController.resetPassword
);   

module.exports = router;