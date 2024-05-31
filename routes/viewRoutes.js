const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const listController = require('../controllers/listController');
const userController = require('../controllers/userController');
const fileUpload = require('../utils/fileUpload');

const viewRouter = express.Router();

viewRouter.route('/login').post(authController.login);
viewRouter.route('/signup').post(authController.signup);
viewRouter.route('/logout').get(viewController.logout);
viewRouter.route('/forgotPassword').post(authController.forgotPassword);

viewRouter.use(authController.isLoggedIn);

viewRouter.route('/').get(viewController.getMainPage);
viewRouter.route('/lists').get(viewController.getUserLists, viewController.getListsPage);
viewRouter.route('/lists/create').get(viewController.getCreateListPage).post(listController.createList);
viewRouter.route('/lists/:id').get(viewController.getList, viewController.getListPage).post(viewController.getList, listController.handleViewPost);
viewRouter.route('/profile').get(viewController.getProfilePage).post(fileUpload.single('profilePicture'), userController.updateUserData);
viewRouter.route('/login').get(viewController.getLoginPage);
viewRouter.route('/signup').get(viewController.getSignupPage);
viewRouter.route('/forgotPassword').get(viewController.getForgotPasswordPage);
viewRouter.route('/resetPassword').get(authController.includeResetToken, viewController.getResetPasswordPage).post(authController.resetPassword);
module.exports = viewRouter;