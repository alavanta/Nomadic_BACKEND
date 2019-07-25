'use strict';
require('dotenv').config();

const response = require('../responses/response');
const connection = require('../config/connect');

const crypto = require('crypto');
const algorithm = process.env.ENC_ALGORITHM || 'aes256';
const password = process.env.ENC_PASS || 'nomadic';
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

exports.createTourGuide = (req, res) => {
  const { name, email, phone, photo, address, gender, age } = req.body;
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
      `SELECT * from guide where guide_email=\'${email}\' LIMIT 1`,
      (error, rowss, field) => {
        if (error) {
          console.log(error);
        } else {
          if (rowss != '') {
            return response.invalid(res, 'email');
          } else {
            connection.query(
              //insert
              `Insert into guide set guide_name=?, guide_email=?, guide_password=?, guide_phone=?, guide_photo=?,guide_address=?, guide_gender=?, guide_age=?`,
              [name, email, password, phone, photo, address, gender, age],
              (error, rowsss, field) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT *  FROM guide ORDER BY id DESC LIMIT 1`,
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
  const email = req.body.email;
  const password = req.body.password || '0';
  console.log(email)
  let encrypted = encrypt(password);
  const query = `SELECT * FROM guide WHERE guide_email='${email}' AND guide_password='${encrypted}'`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(query)
      return response.loginFailed(res);
    } else {
      if (rows != '') {
        const token = jwt.sign({ rows }, 'nomadic', {
          expiresIn: '24h'
        });
        return response.loginSuccess(res, rows, token);
      } else {
        console.log(query)
        return response.loginFailed(res);
      }
    }
  });
};

exports.getTourGuide = (req, res) => {

  let query = `SELECT * FROM guide`;
  connection.query(query, (error, rows, fields) => {
    if (error) {
      return res.send(error);
    } else {
      if (rows !== '') {
        let q = `SELECT skill FROM skills LEFT JOIN guide ON guide.id = skills.id_guide`;
        connection.query(q, (err, row, field) => {
          var rv = {};
          for (var i = 0; i < row.length; ++i){
            rv[i] = row[i];
          }
          if (err) {
            res.status(401).json({
              status: 404,
              data: 'Data not found'
            })
          } else {
            // let { id, guide_name, guide_email, guide_password, guide_phone, guide_photo, guide_address, guide_gender, guide_age } = rows[0];
            res.status(200).json({
              status: 201,
              data: {
                data: rows,
                skills: rv
              }
            });
          }
        })
      } else {
        res.status(401).json({
          status: 404,
          data: 'Data not found !'
        });
      }
    }
  });
};

exports.getTourGuideById = (req, res) => {
  const id = req.params.id;
  let query = `SELECT * FROM guide`;
  connection.query(query, (error, rows, fields) => {
    if (error) {
      return res.send(error);
    } else {
      if (rows !== '') {
        let q = `SELECT skill FROM skills WHERE id_guide = ${id} `;
        connection.query(q, (err, row, field) => {
          if (err) {
            res.status(401).json({
              status: 404,
              data: 'Data not found'
            })
          } else {
            let element = req.params.id - 1;
            console.log(element)
            let { id, guide_name, guide_email, guide_password, guide_phone, guide_photo, guide_address, guide_gender, guide_age } = rows[element];
            res.status(200).json({
              status: 201,
              data: {
                id: id,
                guide_name: guide_name,
                guide_email: guide_email,
                guide_password: guide_password,
                guide_phone: guide_phone,
                guide_photo: guide_photo,
                guide_address: guide_address,
                guide_gender: guide_gender,
                guide_age: guide_age,
                skills: row
              }
            });
          }
        })
      } else {
        res.status(401).json({
          status: 404,
          data: 'Data not found !'
        });
      }
    }
  });
};

exports.editTourGuide = (req, res) => {
  let id = req.params.id;
  const { name, phone, address, gender, age } = req.body;
  const password = encrypt(req.body.password);
  let passEncrypt = encrypt(password);
  const query = `UPDATE guide SET guide_name='${name}' ,guide_password='${passEncrypt}', guide_address='${address}', guide_phone='${phone}',guide_gender='${gender}', guide_age='${age}' WHERE id=${id}`;
  console.log(query)
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(query)
      return res.send(error);
    } else {
      if (rows.affectedRows === 1) {
        res.status(200).json({
          status: 201,
          data: rows
        });
      } else {
        console.log(query)
        res.status(404).json({
          status: 404,
          data: 'Data not found !'
        });
      }
    }
  });
};
