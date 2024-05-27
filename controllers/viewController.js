const catchAsync = require('../utils/catchAsync');
const List = require('../models/listModel');

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

exports.getProfilePage = (req, res, next)=>{
    res.render('profile', {
        isLoggedIn : req.isLoggedIn,
        user : req.user,
    });
};

exports.getListsPage = (req, res, next) => {
    res.render('lists', {
        isLoggedIn : req.isLoggedIn,
        lists : req.lists,
    });
};

exports.getUserLists = catchAsync(async (req, res, next) => {
    if (!req.isLoggedIn){
        return next();
    }
    const lists = await List.find({user : req.user.id});
    req.lists = lists;
    next();
});

exports.getCreateListPage = (req, res, next) => {
    res.render('createList', {
        isLoggedIn : req.isLoggedIn,
    });
};