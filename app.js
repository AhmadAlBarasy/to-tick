const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const authRouter = require('./routes/authRoutes');
const listRouter = require('./routes/listRoutes');
const viewRouter = require('./routes/viewRoutes');
const errorController = require('./controllers/errorController');

const app = express();
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Security Middleware functions
app.use(morgan('dev'));
app.use(helmet());
app.use('/', rateLimiter);
app.use(mongoSanitize());
app.use(xss());
app.use(cors());
app.use(hpp());

// Routers and Error controller
app.use('/api/v1', authRouter);
app.use('/api/v1', listRouter);
app.use('/', viewRouter);
app.use(errorController);

module.exports = app;
