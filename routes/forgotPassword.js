'use strict'
const express 	= require('express');
const Route 	= express.Router();

const controller = require('../controllers/forgotPassword');

Route
	.post('/', controller.resetPassword)
	.post('/send', controller.sendEmail)

module.exports = Route;