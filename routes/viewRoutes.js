const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();

viewRouter.route('/').get(authController.isLoggedin, viewController.getMainPage);
viewRouter.route('/login').get(viewController.getLoginPage).post(authController.login);

module.exports = viewRouter;