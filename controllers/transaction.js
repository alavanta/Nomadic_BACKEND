const key = process.env.STRIPE_TEST_KEY
const stripe = require("stripe")(key);

exports.stripe = async function(req, res){
    const number = req.body.number || '4242424242424242';
    const month = req.body.month || 12;
    const year = req.body.year || 2020;
    const cvc = req.body.cvc || '123';
    const amount = req.body.amount || 1000000;
    try {
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
          res.status(200).json({status: 200, message: "payment succesfull"})
        })
        .catch((err) => {
          res.status(400).json(err)
        });
    }
    catch (err) {
      res.status(500).json(err);
    }
  }