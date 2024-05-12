const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router();

authRouter.route('/login').post(authController.login);
authRouter.route('/logout').get(authController.logout);
authRouter.route('/signup').post(authController.signup);
// authRouter.route('/forgotPassword').post(authController.forgotPassword);
// authController.route('/resetPassword/:resetToken').post(authController.resetPassword);

module.exports = authRouter;