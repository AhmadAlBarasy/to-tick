const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sendToken = (res, token, statusCode, data) => {
	res.status(statusCode).json({
		status : 'success',
		data,
		token,
	});
}

const signToken = (id) =>
	jwt.sign({id}, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
});

const logoutToken = () => 
	jwt.sign({data : null}, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_LOGOUT,
});	

const getDateAfter = (ms) => {
	return Date(Date.now() +ms).toString();
}

exports.signup = catchAsync(async (req, res, next) => {
	const user = await User.create(req.body);
	const token = signToken(user._id);
	res.cookie('jwt', token, {
		expries : Date.now() + process.env.JWT_EXPIRES_IN * 86400000,
		httpOnly : true,
	});
	sendToken(res, token, 201);
});

exports.login = catchAsync(async (req, res, next) => {
	const credintials = req.body;
	const {email, password} = credintials;
	if (! email  || ! password) {
		return next(new AppError(400, 'Missing Credintials'));
	}
	const user = await User.findOne({email : email}).select('+password -profilePicture -__v -__id');
	if (! user || !(await user.correctPassword(password, user.password))){
		return next(new AppError(401, 'Incorrect email or password'));
	}
	const token = signToken(user._id);
	res.cookie('jwt', token, {
		expries : Date.now() + process.env.JWT_EXPIRES_IN * 86400000,
		httpOnly : true,
	});
	user.password = undefined;
	sendToken(res, token, 200, user);
});

exports.logout = catchAsync(async (req, res, next) => {
	res.cookie('jwt', null, {
		expries : Date.now(),
		httpOnly : true,
	});
	const token = logoutToken();
	sendToken(res, token, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
	if (! req.headers.authorization || ! req.headers.authorization.startsWith('Bearer')) {
		return next(new AppError(403, 'You are not authenticated, please sign up or login to do this action.'));
	}
	const token = req.headers.authorization.split(' ')[1];
	const decodedData = jwt.verify(token, process.env.JWT_KEY);
	if (!decodedData) {
		return next(new AppError(403, 'JWT Invalid or malformed.'));
	}
	console.log(decodedData.id);
	const user = await User.findById(decodedData.id);
	if (!user) {
		return next(new AppError(403, "Something wrong happened, please login again."));
	}
	req.user = user;
	next();
});

exports.forgotPassword = catchAsync(async (req ,res, next) => {
	if (! req.body.email) {
		return next(new AppError(400, 'Please provide your email.'));
	}
	const user = await User.findOne({email : req.body.email});
	if (!user) {
		return next(new AppError(400, 'No user found with that email.'));
	}
	const resetToken = user.createResetPasswordToken();
	await user.save({ validateBeforeSave: false });
	const transporter = nodemailer.createTransport({
		host: process.env.MAILER_HOST,
		port: process.env.MAILER_PORT,
		secure: false,
		auth: {
		  user: process.env.MAILER_USERNAME,
		  pass: process.env.MAILER_PASSWORD,
		},
	  });
	const messageID = await transporter.sendMail({
		from : "agent@totick.com",
		to : user.email,
		subject : "Reset your password (Link valid for 10 minutes)",
		text : `You can reset your password using the following link\n http://localhost/api/v1/resetPassword/${resetToken}`
	});
	res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
		date : getDateAfter(600000),
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');
    // query the user that has the reset Token stored and matches the token we sent to the user and make sure that the token didn't expire
    const user = await User.findOne({
        resetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now(),
        },
    }).select('-password -profilePicture -__v -__id');
    if (!user) {
        return next(new AppError(400, 'Token is invalid or has expried'));
    }
	else {
		user.password = req.body.password;
		user.resetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		const token = signToken(user._id);
		sendToken(res, token, 200, user);
	}
});