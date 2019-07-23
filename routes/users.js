const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.post('/register', usersController.createUsers);
router.post('/login', usersController.login);

router.get('/:id',usersController.getUsersById);
module.exports = router;
