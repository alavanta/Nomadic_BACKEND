'use strict';
require('dotenv').config();
const connection = require('../config/connect');
const response = require('../responses/response');

function getTime() {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const dateTime = date;
  return dateTime;
}

exports.getBookingByUserId = (req, res) => {
  const id = req.userData.id;
  const query = `SELECT booking.id booking_id, booking.booking_date, booking.booking_passenger, booking.id_guide, booking.id_packages, booking.id_user, booking.isDone, packages.included_fasilities, packages.nonincluded_fasilities, packages.package_city, packages.package_description, packages.package_image, packages.package_name, packages.package_price FROM booking LEFT JOIN packages ON booking.id_packages = packages.id WHERE booking.id_user=${id}`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(error);
    } else {
      if (!id) {
        return response.falseRequirement(res, 'user');
      } else {
        if (rows != '') {
          return response.success(res, rows);
        } else {
          return response.notFound(res);
        }
      }
    }
  });
};

exports.getBookingByGuide = (req, res) => {
  const id = req.userData.id;
  console.log(id);
  const query = `SELECT booking.id booking_id, booking.booking_date, booking.booking_passenger, booking.id_guide, booking.id_packages, booking.id_user, booking.isDone, packages.included_fasilities, packages.nonincluded_fasilities, packages.package_city, packages.package_description, packages.package_image, packages.package_name, packages.package_price FROM booking LEFT JOIN packages ON booking.id_packages = packages.id WHERE booking.id_guide=${id}`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(error);
    } else {
      if (!id) {
        return response.falseRequirement(res, 'user');
      } else {
        if (rows != '') {
          return response.success(res, rows);
        } else {
          console.log('gamasuk');
          return response.notFound(res);
        }
      }
    }
  });
};

exports.createBookingByUserId = (req, res) => {
  console.log(req.query);

  const id_user = req.params.userId;
  const booking_passenger = parseInt(req.body.booking_passenger) || 1;
  const id_packages = req.body.id_packages;
  const booking_date = req.body.date_time || getTime();

  if (!id_user) {
    response.falseRequirement(res, 'user');
  } else if (!id_packages) {
    response.falseRequirement(res, 'id_packages');
  } else if (!booking_passenger) {
    response.falseRequirement(res, 'booking_passenger');
  } else {
    connection.query(
      `SELECT * from packages WHERE id=${id_packages} LIMIT 1`,
      (error, rows, field) => {
        if (error) {
          console.log(error);
        } else {
          const package_price = rows[0].package_price;
          connection.query(
            //if not exist new insert
            `INSERT INTO booking set id_user=?, id_packages=?, booking_passenger=?, total_price=?, booking_date=?, buyed=?`,
            [
              id_user,
              id_packages,
              booking_passenger,
              package_price * booking_passenger,
              booking_date,
              false
            ],
            (error, data, field) => {
              if (error) {
                console.log(error);
              } else {
                connection.query(
                  // get data new insert
                  `SELECT * FROM booking WHERE id_user=${id_user} AND id_packages=${id_packages} ORDER BY booking_date DESC LIMIT 1`,
                  (error, data, field) => {
                    if (error) {
                      console.log(error);
                    } else {
                      return response.changed(res, data, 'inserted');
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
};

exports.deleteBookingByUserId = (req, res) => {
  const id_user = parseInt(req.params.userId);
  const id_packages = parseInt(req.body.id_packages);

  connection.query(
    `DELETE FROM booking WHERE id_user=? And id_packages=? Limit 1`,
    [id_user, id_packages],
    (error, rows, field) => {
      if (error) {
        throw error;
      } else {
        if (rows.affectedRows != '') {
          return response.changed(res, { id_user, id_packages }, 'deleted');
        } else {
          return response.invalid(res, 'Id');
        }
      }
    }
  );
};

exports.getBookingById = (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM booking LEFT JOIN packages ON booking.id_packages = packages.id LEFT JOIN guide ON booking.id_guide = guide.id WHERE booking.id = ${id} LIMIT 10 `;
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(error);
    } else {
      if (!id) {
        return response.falseRequirement(res, 'user');
      } else {
        console.log(rows);

        if (rows != '') {
          return response.success(res, rows);
        } else {
          return response.notFound(res);
        }
      }
    }
  });
};
