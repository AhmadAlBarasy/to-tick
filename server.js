const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');

dotenv.config({ path: './config.env' });
const port = process.env.PORT || 80;
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
const cat = "20";
mongoose
    .connect(DB, {
        dbName: process.env.DB_NAME,
	})
    .then((con) => {
        console.log('Connected to DataBase');
    })
    .catch((err) => {
        console.log('Connection to database failed...');
        process.exit(1);
    });

app.listen(port, () => { console.log(`Server is listening on port ${port}`); });
