const AppError = require('../utils/AppError');

const handleMalformedJWT = (err) => {
    const message = "You are not signed in, please sign in again";
    return new AppError(401, message);
}

const handleValidationError = (err) => {
    const message = "Invalid input data.";
    return new AppError(400, message);
}

const handleDuplicateFields = (err) => {
    const message = `Duplicate field value`;
    return new AppError(400, message);
};

const sendErrorForDev = (err, req, res) => {
    if (req.url.startsWith('/login')){
         res.render('login', {
            feedback : err.message,
        });
    }
    else if (req.url.startsWith('/resetPassword')) {
        res.render('resetPassword', {
            feedback : err.message,
        });
    }
    else if (req.url.startsWith('/signup')){
        res.render('signup', {
            feedback : err.message,
        });
    }
    else if (req.url.startsWith('/forgotPassword')){
        res.render('forgotPassword', {
            feedback : err.message,
        });
    }
    else {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};

const sendErrorForProd = (err, req, res) => {
    if (err.isOperational) {
        if (req.url.startsWith('/login')){
            res.render('login', {
               feedback : err.message,
           });
       }
       else if (req.url.startsWith('/resetPassword')) {
           res.render('resetPassword', {
               feedback : err.message,
           });
       }
       else if (req.url.startsWith('/signup')){
           res.render('signup', {
               feedback : err.message,
           });
       }
       else if (req.url.startsWith('/forgotPassword')){
           res.render('forgotPassword', {
               feedback : err.message,
           });
       }
        else {
            res.status(err.statusCode).json({
                status : err.status,
                message : err.message,
            });
        }
    }
    else {
        console.error('Unexpected Error happened !', err.name);
        res.status(500).json({
            status: 'Server Error.',
            message: 'Something went wrong :(',
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Internal Error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production'){
        let error = Object.create(
            Object.getPrototypeOf(err),
            Object.getOwnPropertyDescriptors(err)
        );
        if (err.name === "ValidationError")
            error = handleValidationError(error);
        if (err.code === 11000) 
            error = handleDuplicateFields(error);
        if (err.message === "jwt malformed")
            error = handleMalformedJWT(error);
        sendErrorForProd(error, req, res);
    }
};