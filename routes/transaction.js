const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');
const checkAuth = require('../middleware/check-auth');

router.post('/payment', checkAuth, transactionController.stripe);

module.exports = router;
