require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

// Routes
const usersRouter = require('./routes/users');
const packagesRouter = require('./routes/packages');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Routing
app.use('/users', usersRouter);
app.use('/packages', packagesRouter);

app.listen(process.env.PORT || 3000);