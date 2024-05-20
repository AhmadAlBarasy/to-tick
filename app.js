const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const listRouter = require('./routes/listRoutes');
const viewRouter = require('./routes/viewRoutes');
const errorController = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/api/v1', authRouter);
app.use('/api/v1', listRouter);
app.use('/', viewRouter);
app.use(errorController);
module.exports = app;