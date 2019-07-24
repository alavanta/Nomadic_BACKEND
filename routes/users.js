const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/register', usersController.createUsers);
router.post('/login', usersController.login);
router.get('/', checkAuth, usersController.getUsersById);
//  Edit profile
router.put('/:id', usersController.editUsers);
router.put('/password/:id', usersController.changePassword);

module.exports = router;
