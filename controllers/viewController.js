const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getMainPage = (req, res, next) => {
    res.render('home', {
        isLoggedIn : req.isLoggedIn,
        username : req.user ? req.user.name : "",
    });
};

exports.getLoginPage = (req, res, next) => {
    res.render('login', {
        isLoggedIn : req.isLoggedIn,
    });
};

exports.logout = (req, res, next) => {
    res.clearCookie('jwt').redirect('/');
};

exports.getSignupPage = (req, res, next) => {
    res.render('signup', {
        isLoggedIn : req.isLoggedIn,
    });
};

exports.getForgotPasswordPage = (req, res, next) => {
    res.render('forgotPassword', {
        isLoggedIn : req.isLoggedIn,    
    });
};

exports.getResetPasswordPage = (req, res, next) => {
    res.render('resetPassword',{
        isLoggedIn : req.isLoggedIn,
        resetToken : req.resetToken ? req.resetToken : "",
    });
};