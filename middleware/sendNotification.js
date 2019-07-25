module.exports = data => {
  var headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Basic ${process.env.ONESIGNAL_APP_API}`
  };

  let options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: headers
  };

  let https = require('https');
  let req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log('Response:');
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function(e) {
    console.log('ERROR:');
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};
