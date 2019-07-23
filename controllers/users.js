'use strict';
require('dotenv').config();

const response = require('../responses/response');
const connection = require('../config/connect');

const crypto = require('crypto');
const algorithm = process.env.ENC_ALGORITHM;
const password = process.env.ENC_PASS;
const jwt = require('jsonwebtoken');

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

exports.createUsers = (req, res) => {
  const { name, email, phone, address, gender } = req.body;
  const password = encrypt(req.body.password);

  if (!name) {
    response.falseRequirement(res, 'name');
  } else if (!password) {
    response.falseRequirement(res, 'password');
  } else if (!email) {
    response.falseRequirement(res, 'email');
  } else if (!address) {
    response.falseRequirement(res, 'address');
  } else {
    connection.query(
      `SELECT * from users where email=\'${email}\' LIMIT 1`,
      (error, rowss, field) => {
        if (error) {
          console.log(error);
        } else {
          if (rowss != '') {
            return response.invalid(res, 'email');
          } else {
            connection.query(
              //insert
              `Insert into users set name=?, password=?, email=?, phone=?, gender=?, address=?`,
              [name, password, email, address, phone, gender],
              (error, rowsss, field) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT *  FROM users ORDER BY id DESC LIMIT 1`,
                    (error, data, field) => {
                      if (error) {
                        console.log(error);
                      } else {
                        return response.changed(res, data, 'added');
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
};

exports.login = (req, res) => {
  const email = req.body.email || '';
  const password = req.body.password || '0';
  let encrypted = encrypt(password);
  const query = `SELECT * FROM users WHERE email='${email}' AND password='${encrypted}'`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      return response.loginFailed(res);
    } else {
      if (rows != '') {
        const token = jwt.sign({ rows }, process.env.JWT_KEY, {
          expiresIn: '24h'
        });
        return response.loginSuccess(res, rows, token);
      } else {
        return response.loginFailed(res);
      }
    }
  });
};
//  Packages
