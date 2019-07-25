const mysql = require('mysql');

const conn = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nomadic_beta'
});

conn.connect(err => {
  if (err) {
    console.log(err);
    throw err;
  }
});

module.exports = conn;
