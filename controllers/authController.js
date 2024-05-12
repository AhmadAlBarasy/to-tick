const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const signToken = (data) =>
	jwt.sign({data}, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
});

const logoutToken = () => 
	jwt.sign({data : null}, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_LOGOUT,
});	


exports.login = async (req, res, next) => {
    res.json({
        name : "meow",
    });
};

exports.signup = catchAsync(async (req, res, next) => {
	const user = await User.create(req.body);
	const token = signToken(user._id);
	console.log(token);
	res.cookie('jwt', token, {
		expries : Date.now() + process.env.JWT_EXPIRES_IN * 86400000,
		httpOnly : true,
	});
	res.status(200).json({
		status : 'success',
			token,
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const credintials = req.body;
	const {email, password} = credintials;
	if (! email  || ! password) {
		return next(new AppError(400, 'Missing Credintials'));
	}
	const user = await User.findOne({email : email}).select('+password');
	if (! user || !(await user.correctPassword(password, user.password))){
		return next(new AppError(401, 'Incorrect email or password'));
	}
	const token = signToken(user._id);
	res.cookie('jwt', token, {
		expries : Date.now() + process.env.JWT_EXPIRES_IN * 86400000,
		httpOnly : true,
	});
	res.status(200).json({
		status : 'success',
		user,
		token,
	});
});

exports.logout = catchAsync(async (req, res, next) => {
	res.cookie('jwt', null, {
		expries : Date.now(),
		httpOnly : true,
	});
	const token = logoutToken();
	res.status(200).json({
		status : 'success',
		token
	});
});