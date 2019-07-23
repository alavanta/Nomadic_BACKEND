'use strict';
const key = process.env.STRIPE_TEST_KEY
const stripe = require("stripe")(key);

module.exports = app => {
  // const noteController = require('../controllers/mainController')
  // const categoryController = require('../controllers/categoryController')

  // GET
  app.get('/', (req, res) => {
    res.status(200).send('Bisa jadi kok');
  });

  app.post('/charge', async (req, res) => {
    try {
      stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2020,
          cvc: '123'
        }
      })
        .then((token) => {
          return stripe.charges.create({
            amount: 1600,
            currency: 'usd',
            source: token.id,
          });
        })
        .then((result) => {
          res.json(result)
        })
        .catch((err) => {
          res.status(500).json(err)
        });
    }
    catch (err) {
      res.status(500).json(err);
    }
  })
};
