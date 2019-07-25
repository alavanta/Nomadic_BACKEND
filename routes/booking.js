const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, bookingController.getBookingByUserId);
router.get('/getByGuide', checkAuth,bookingController.getBookingByGuide);
router.post('/:userId', bookingController.createBookingByUserId);
router.delete('/delete/:userId/', bookingController.deleteBookingByUserId);

module.exports = router;
