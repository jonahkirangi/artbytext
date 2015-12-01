var path = require('path');
var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var twilio = require('twilio')(config.accountSid, config.authToken);

var app = express();

// Application routing
var staticPath = path.resolve(__dirname + '/public');
app.use(express.static(staticPath));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post('/', function(req, res) {
  var success;

  // Twilio configuration
  twilio.messages.create({
    from: config.twilioNumber,
    to: req.body.receivedNum,
    body: req.body.randomArt
  }, function(err, message) {
      if (err) {
        console.error('Text failed because: ' + err.message);
        var success = false;
      } else {
        console.log('Text sent! Message SID: ' + message.sid);
        var success = true;
      }
  });

  if (success) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(3000, function() {
  console.log('Server listening on port 3000' + '\n');
});
