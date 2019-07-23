const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.post('/register', usersController.createUsers);
router.post('/login', usersController.login);
//  Edit profile
router.put('/:id',usersController.editUsers)
router.put('/password/:id',usersController.changePassword);

module.exports = router;
