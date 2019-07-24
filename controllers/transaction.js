const key = process.env.STRIPE_TEST_KEY
const stripe = require("stripe")(key);
const connection = require('../config/connect');

exports.stripe = async function (req, res) {
  const number = req.body.number || '4242 4242 4242 4242';
  const month = req.body.month || 12;
  const year = req.body.year || 2020;
  const cvc = req.body.cvc || '123';
  let amount = req.body.amount || 1000000;
  amount = amount / 14000
  let str = amount.toString()
  let i = str.indexOf('.');
  let a = str.substr(i + 1, i);
  if (i > 0) {
    let temp = str.substr(0, i);
    amount = Number(temp)
  }
  amount = amount * 100 + Number(a)

  try {const connection = require('../config/connect');
    stripe.tokens.create({
      card: {
        number: number,
        exp_month: month,
        exp_year: year,
        cvc: cvc
      }
    })
      .then((token) => {
        return stripe.charges.create({
          amount: amount,
          currency: 'idr',
          source: token.id,
        });
      })
      .then((result) => {
        res.status(200).json({ status: 200, message: "payment succesfull" })
      })
      .catch((err) => {
        res.status(400).json(err)
      });
  }
  catch (err) {
    res.status(500).json(err);
  }
}