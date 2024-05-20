const AppError = require('../utils/AppError');

const handleValidationError = (err) => {
    const message = "Invalid input data.";
    return new AppError(400, message);
}

const handleDuplicateFields = (err) => {
    const message = `Duplicate field value`;
    return new AppError(400, message);
};

const sendErrorForDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        res.json({
            error : err,
        })
    }
};

const sendErrorForProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status : err.status,
                message : err.message,
            });
        }
        else {
            console.error('Unexpected Error happened !', err.name);
            res.status(500).json({
                status: 'Server Error.',
                message: 'Something went wrong :(',
            });
        }
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Internal Error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production'){
        let error = {...err};
        if (err.name === "ValidationError")
            error = handleValidationError(error);
        if (err.code === 11000) 
            error = handleDuplicateFields(error);
        sendErrorForProd(error, req, res);
    }
};