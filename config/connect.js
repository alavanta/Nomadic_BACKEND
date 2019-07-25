const mysql = require('mysql');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

conn.connect(err => {
  if (err) {
    console.log(err);

    setTimeout(
      conn.connect(err => {
        if (err) {
          console.log(err);

          throw err;
        }
      }),
      10000
    );

    throw err;
  }
});

conn.on('error', function onError(err) {
  console.log('db error', err);
  if (err.code == 'PROTOCOL_CONNECTION_LOST') {
    conn.connect(err => {
      if (err) {
        console.log(err);

        setTimeout(
          conn.connect(err => {
            if (err) {
              console.log(err);

              throw err;
            }
          }),
          10000
        );

        throw err;
      }
    });
  } else {
    throw err;
  }
});

module.exports = conn;
