const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packages');


router.get('/', packageController.showPackages);
router.get('/destinations/:id', packageController.destinationById);

module.exports = router;
