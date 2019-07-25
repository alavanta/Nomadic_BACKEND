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
  const {
    name,
    email,
    phone,
    photo,
    address,
    gender,
    age,
    skill,
    status
  } = req.body;
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
              `Insert into guide set guide_name=?, guide_email=?, guide_password=?, guide_phone=?, guide_photo=?,guide_address=?, guide_gender=?, guide_abilities=? , guide_age=?,status=?`,
              [
                name,
                email,
                password,
                phone,
                photo,
                address,
                gender,
                skill,
                age,
                status
              ],
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
  console.log(email);
  let encrypted = encrypt(password);
  const query = `SELECT * FROM guide WHERE guide_email='${email}' AND guide_password='${encrypted}'`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(query);
      return response.loginFailed(res);
    } else {
      if (rows != '') {
        const token = jwt.sign({ rows }, 'nomadic', {
          expiresIn: '24h'
        });
        return response.loginSuccess(res, rows, token);
      } else {
        console.log(query);
        return response.loginFailed(res);
      }
    }
  });
};

exports.getTourGuide = (req, res) => {
  console.log(req.userData);
  let query = `SELECT * FROM guide`;
  connection.query(query, (error, rows, fields) => {
    if (error) {
      return res.send(error);
    } else {
      if (rows !== '') {
        res.status(200).json({
          status: 201,
          data: rows
        });
      }
    }
  });
};

exports.getTourGuideById = (req, res) => {
  let query = `SELECT * FROM guide WHERE id = ${req.userData.id}`;
  console.log(query);
  connection.query(query, (error, rows, fields) => {
    console.log('punya tourGuide ', rows);
    if (error) {
      return res.send(error);
    } else {
      if (rows != '') {
        res.status(200).json({
          status: 201,
          data: rows[0]
        });
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
  // const password = encrypt(req.body.password);
  // let passEncrypt = encrypt(password);
  const query = `UPDATE guide SET guide_name='${name}' , guide_address='${address}', guide_phone='${phone}',guide_gender='${gender}', guide_age='${age}' WHERE id=${id}`;
  console.log(query);
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(query);
      return res.send(error);
    } else {
      if (rows.affectedRows === 1) {
        res.status(200).json({
          status: 201,
          data: rows
        });
      } else {
        console.log(query);
        res.status(404).json({
          status: 404,
          data: 'Data not found !'
        });
      }
    }
  });
};

exports.deleteGuide = (req, res) => {
  const idGuide = req.params.id;
  let query = `DELETE FROM guide WHERE id = ${idGuide}`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      return res.status(403).send(error);
    } else {
      if (rows.affectedRows != 0) {
        res.status(201).json({
          status: 201,
          id_guide: parseInt(idGuide),
          message: 'Guide deleted successfully.'
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'Data not found !'
        });
      }
    }
  });
};

exports.getStatus = (req, res) => {
  const stat = req.params.stat;
  let query = `SELECT * FROM guide WHERE status = ${stat}`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      return res.send(error);
    } else {
      if (rows != '') {
        res.status(201).json({
          status: 201,
          data: rows
        });
      } else {
        res.status(404).json({
          status: 401,
          message: 'Data not found !'
        });
      }
    }
  });
};
// --------------- SKILLS -----------------//
exports.getSkillById = (req, res) => {
  const id = req.params.id;
  let query = `SELECT * FROM skills WHERE id_guide = ${id}`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      return res.send(error);
    } else {
      if (rows != '') {
        res.status(201).json({
          status: 201,
          data: rows
        });
      } else {
        res.status(401).json({
          status: 401,
          message: 'Data not found !'
        });
      }
    }
  });
};

exports.deleteSkillById = (req, res) => {
  const idSkill = req.params.id;
  let query = `DELETE FROM skills WHERE id = ${idSkill}`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      return res.send(error);
    } else {
      if (rows.affectedRows != 0) {
        res.status(201).json({
          status: 201,
          id_skill: parseInt(idSkill),
          message: 'Skill deleted successfully.'
        });
      } else {
        res.status(401).json({
          status: 404,
          message: 'Data not found !'
        });
      }
    }
  });
};

exports.addSkill = (req, res) => {
  let { id_guide, skill } = req.body;
  let query = `INSERT INTO skills SET id_guide = ${id_guide}, skill = '${skill}'`;

  connection.query(query, (error, rows, field) => {
    if (error) {
      res.status(401).json({
        status: 401,
        message: error
      });
    } else {
      res.status(201).json({
        status: 201,
        message: 'Data added successfully',
        data: {
          id_guide: id_guide,
          skill: skill
        }
      });
    }
  });
};

exports.changePassword = (req, res) => {
  let id = req.userData.id;
  let oldPassword = req.body.oldPassword;
  let oldPassEncrypt = encrypt(oldPassword);
  let password = req.body.newPassword;
  let passEncrypt = encrypt(password);

  const qOldpass = `SELECT guide_password from guide WHERE id ='${id}'`;
  connection.query(qOldpass, (err, row, field) => {
    console.log(row);
    if (oldPassEncrypt != row[0].guide_password) {
      console.log('error');
      res.status(404).send({
        status: 404,
        message: 'Error, password not valid.'
      });
    } else {
      const query = `UPDATE guide SET guide_password='${passEncrypt}' WHERE id=${id}`;

      connection.query(query, (error, rows, field) => {
        if (error) {
          return res.send(error);
        } else {
          connection.query(
            `SELECT * FROM guide WHERE id = ${req.userData.id}`,
            (err, rowss, field) => {
              res.status(201).send({
                status: 201,
                data: rowss[0]
              });
            }
          );
        }
      });
    }
  });
};
