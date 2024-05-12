const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const errorController = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev'));
app.use('/api/v1', authRouter);
app.use(errorController);
module.exports = app;