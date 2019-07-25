const key = process.env.STRIPE_TEST_KEY;
const stripe = require('stripe')(key);
const connection = require('../config/connect');
const sendNotification = require('../middleware/sendNotification');
const moment = require('moment');

exports.stripe = async function(req, res) {
  let number = req.body.number;
  number = number.replace(/\s+/gi, '');
  const month = req.body.month;
  const year = req.body.year;
  const cvc = req.body.cvc;
  const guideId = req.body.guideId;
  // amount convert idr to usd
  let amount = req.body.amount;
  amount = amount / 14000;
  let str = amount.toString();
  let i = str.indexOf('.');
  let a = str.substr(i + 1, i);
  if (i > 0) {
    let temp = str.substr(0, i);
    amount = Number(temp);
  }
  amount = amount * 100 + Number(a);

  try {
    idUser = req.userData.id;
    console.log(req.userData);
  } catch (err) {
    return res.status(403).json({ message: 'unauthorized user' });
  }

  packageId = req.body.packageId;
  date = req.body.date;
  passanger = req.body.totalPassanger || 2;

  if (packageId == '' || packageId == undefined) {
    if (
      date == '' ||
      date == undefined ||
      passanger == '' ||
      passanger == undefined
    ) {
      return res.status(403).json({ message: 'undefined field' });
    }
    return res.status(403).json({ message: 'undefined field' });
  }
  try {
    console.log('masuk try catch');

    stripe.tokens
      .create({
        card: {
          number: number,
          exp_month: month,
          exp_year: year,
          cvc: cvc
        }
      })
      .then(token => {
        console.log('MASUK KE TOKEN');

        return stripe.charges.create({
          amount: amount,
          currency: 'usd',
          source: token.id
        });
      })
      .then(result => {
        console.log('SUKESE');
        console.log(idUser);

        const sql = `INSERT INTO booking SET id_user=${idUser}, id_packages=${packageId}, booking_date='${date}', booking_passenger=${passanger}, id_guide=${guideId}`;
        connection.query(sql, function(err, row, field) {
          if (err) {
            console.log(err);
          }

          var message = {
            app_id: process.env.ONESIGNAL_APP_KEY,
            headings: { en: 'Transaction Success' },
            contents: { en: 'Your booking successfully delivered' },
            send_after: moment().add(15, 's'),
            include_player_ids: [req.body.appId]
          };

          sendNotification(message);
          res.status(200).json({ status: 200, message: 'payment succesfull' });
        });
      })
      .catch(err => {
        console.log(err);

        res.status(400).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
};
