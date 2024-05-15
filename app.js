const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const listRouter = require('./routes/listRoutes');
const errorController = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev'));
app.use('/api/v1', authRouter);
app.use('/api/v1', listRouter);
app.use(errorController);
module.exports = app;