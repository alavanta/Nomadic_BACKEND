'use strict';
require('dotenv/config');

const conn = require('../config/connect');
const nodemailer = require('nodemailer');
const email = 'normadictravelapp@gmail.com';
const emailPassword = 'Arkademybootcamp!0';

const mcache = require('memory-cache');
const crypto = require('crypto');
const algorithm = 'aes256';
const password = 'nomadic';

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  service: 'gmail',
  auth: {
    user: email,
    pass: emailPassword
  }
});

exports.sendEmail = function(req, res) {
  let mailTo = req.body.email;
  conn.query(
    `SELECT email from users WHERE email = '${req.body.email}'`,
    (err, rows, field) => {
      console.log('email ', mailTo);
      if (rows == '') {
        res.status(403).send('Email not registry on database !');
      } else {
        let code = Math.floor(Math.random() * Math.floor(999999));
        if (code < 100000) {
          code = code + 100000;
        }
        let key = '__code__' + mailTo;
        mcache.put(key, code, 300000);
        mcache.put('mail', mailTo, 300000);
        const mailOptions = {
          from: email,
          to: mailTo,
          subject: 'Reset password',
          text:
            'Use this code to reset password ' +
            code +
            ' this code will expired after 5 minutes'
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            res.status(404).send({ status: 403, message: error });
          } else {
            res
              .status(200)
              .send({ status: 200, info: info, message: 'Mail sent!' });
          }
        });
      }
    }
  );
};

exports.resetPassword = function(req, res) {
  let email = mcache.get('mail');
  let myEmail = email;
  let key = '__code__' + myEmail;
  let myCode = Number(req.body.code);
  let code = mcache.get(key);
  let newPass = req.body.newPass || 'admin';
  console.log(code);
  if (myCode !== code) {
    res.status(403).send({ status: 403, message: 'Incorrect code' });
  } else {
    conn.query(
      `UPDATE users SET \`password\`='${encrypt(
        newPass
      )}' WHERE email='${email}'`,
      function(error, rows) {
        try {
          res.send({ status: 200, message: 'Password changed successfully!' });
        } catch (error) {
          res.send({ status: 403, message: 'Not registered email' });
        }
      }
    );
  }
};
