'use strict';
module.exports = app => {
  // const noteController = require('../controllers/mainController')
  // const categoryController = require('../controllers/categoryController')

  // GET
  app.get('/', (req, res) => {
    res.status(200).send('Bisa jadi kok');
  });
};
