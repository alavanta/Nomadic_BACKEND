require('dotenv').config();

// const response = require('../responses/response');
const connection = require('../config/connect');
const isEmpty = require('lodash.isempty');

exports.showPackages = (req, res) => {
  let search = req.query.search;
  let query = 'SELECT *FROM packages';

  if (!isEmpty(search)) {
    query += ` WHERE packages.package_name LIKE '%${
      req.query.search
    }%' OR packages.package_city LIKE '%${req.query.search}%'`;
  }

  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(error);
    } else {
      if (rows != '') {
        res.status(200).json({
          status: 200,
          data: rows
        });
      } else {
        res.status(404).json({
          status: 404,
          data: 'Data not found !'
        });
      }
    }
  });
};

exports.showPackagesById = (req, res) => {
  let id = req.params.id;
  let fetchDestination = `SELECT *FROM packages LEFT JOIN destinations ON destinations.id_package = packages.id WHERE destinations.id_package = ${id}`;
  let query = `SELECT * FROM packages WHERE packages.id = ${id}`;
  console.log(req.userData);

  connection.query(fetchDestination, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      if (data != '') {
        connection.query(query, (error, rows, field) => {
          if (error) {
            console.log(error);
          } else {
            if (rows != '') {
              res.status(200).json({
                status: 200,
                data: { ...rows[0], destinations: data }
              });
            } else {
              res.status(404).json({
                status: 404,
                data: 'Data not found !'
              });
            }
          }
        });
      } else {
        res.status(404).json({
          status: 404,
          data: 'Data not found !'
        });
      }
    }
  });
};

// Destination

exports.destinationById = (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM packages LEFT JOIN destinations ON destinations.id_package = packages.id WHERE destinations.id_package = ${id}`;
  connection.query(query, (error, rows, field) => {
    if (error) {
      console.log(error);
    } else {
      if (rows != '') {
        res.status(200).json({
          status: 200,
          id_package: parseInt(id),
          data: rows
        });
      } else {
        res.status(404).json({
          status: 404,
          data: 'Data not found !'
        });
      }
    }
  });
};
