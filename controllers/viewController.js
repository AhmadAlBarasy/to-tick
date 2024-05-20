const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getMainPage = (req, res, next) => {
    res.render('home', {
        isLoggedIn : req.isLoggedIn,
    });
};

exports.getLoginPage = (req, res, next) => {
    res.render('login');
};