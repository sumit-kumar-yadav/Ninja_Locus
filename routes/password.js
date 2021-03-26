const express = require('express');
const passwordController = require('../controllers/password_controller');

const router = express.Router();

router.get('/forgot', passwordController.forgotPassword);  // route for renderig the email matching page
router.post('/recover', passwordController.recoverPassword);  // route for recovering password through email
router.get('/reset/', passwordController.resetPasswordForm)   // route for reset password form
router.post('/reset-password/:token', passwordController.resetPassword);   // Reset thet password

module.exports = router;