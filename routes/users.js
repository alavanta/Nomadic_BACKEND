const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/register', usersController.createUsers);
router.post('/login', usersController.login);
router.get('/', checkAuth, usersController.getUsersById);
//  Edit profile
router.patch('/:id', usersController.editUsers);
router.post('/password', checkAuth,usersController.changePassword);

router.get('/:id',usersController.getUsersById);
module.exports = router;
