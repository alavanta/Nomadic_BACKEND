const mysql = require('mysql');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
});

conn.connect(err => {
  if (err) {
    console.log(err);
    throw err;
  }
});

module.exports = conn;
