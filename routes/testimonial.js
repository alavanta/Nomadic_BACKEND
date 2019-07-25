const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial');
const checkAuth = require('../middleware/check-auth');

router.get('/', testimonialController.showTestimonial);
//  Edit profile
router.delete('/:id', testimonialController.deleteTestimonial);
router.put('/:id', testimonialController.editTestimonial);
router.post('/', testimonialController.createTestimonial);

// router.get('/:id',usersController.getUsersById);
module.exports = router;
