const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();

viewRouter.route('/login').post(authController.login);
viewRouter.route('/signup').post(authController.signup);
viewRouter.route('/logout').get(viewController.logout);
viewRouter.route('/forgotPassword').post(authController.forgotPassword);

viewRouter.use(authController.isLoggedIn);

viewRouter.route('/').get(viewController.getMainPage);
viewRouter.route('/login').get(viewController.getLoginPage);
viewRouter.route('/signup').get(viewController.getSignupPage);
viewRouter.route('/forgotPassword').get(viewController.getForgotPasswordPage);
viewRouter.route('/resetPassword').get(authController.includeResetToken, viewController.getResetPasswordPage).post(authController.resetPassword);
module.exports = viewRouter;