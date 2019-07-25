const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/tourGuide');
const checkAuth = require('../middleware/check-auth');

router.post('/register', tourGuideController.createTourGuide);
router.post('/login',tourGuideController.login);
//  Edit profile guide
router.put('/:id', tourGuideController.editTourGuide);
router.get('/',checkAuth,tourGuideController.getTourGuide);
router.get('/getById',checkAuth,tourGuideController.getTourGuideById);
router.delete('/:id',tourGuideController.deleteGuide);
// change password
router.post('/password',checkAuth,tourGuideController.changePassword)
// get status guide
router.get('/status/:stat',tourGuideController.getStatus);
//-------------------- Skills ----------------------
router.get('/skills/:id',tourGuideController.getSkillById);
router.delete('/skills/:id',tourGuideController.deleteSkillById);
router.post('/skills',tourGuideController.addSkill);
module.exports = router;
