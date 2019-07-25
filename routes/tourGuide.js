const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/tourGuide');
const checkAuth = require('../middleware/check-auth');

router.post('/register', tourGuideController.createTourGuide);
router.post('/login', tourGuideController.login);
//  Edit profile guide
router.put('/:id', tourGuideController.editTourGuide);

router.get('/',tourGuideController.getTourGuide);
router.get('/:id',tourGuideController.getTourGuideById);
module.exports = router;
