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

// function handleDisconnect() {
//   connection = mysql.createConnection({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USERNAME || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_DATABASE || 'nomadic_beta'
//   });

//   connection.connect(function onConnect(err) {
//     if (err) {
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 10000);
//     }
//   });

//   connection.on('error', function onError(err) {
//     console.log('db error', err);
//     if (err.code == 'PROTOCOL_CONNECTION_LOST') {
//       handleDisconnect();
//     } else {
//       throw err;
//     }
//   });
// }

// module.exports = handleDisconnect();
