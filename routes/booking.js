const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

router.get('/:id', bookingController.getBookingByUserId);
router.post('/:userId', bookingController.createBookingByUserId);
router.delete('/delete/:userId/', bookingController.deleteBookingByUserId);

module.exports = router;
