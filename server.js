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
  // console.log(req.body);

  // Twilio configuration
  twilio.messages.create({
    from: config.twilioNumber,
    to: req.body.receivedNum,
    body: req.body.randomArt
  }, function(err, responseData) {
      if(!err) {
        console.log('To: ' + responseData.to);
        console.log('Message: ' + responseData.body);
        console.log('Sent On: ' + Date() + '\n');
      } else {
        console.log('Error message: ' + err.message);
        console.log('Error code: ' + err.code);
        console.log('Sent On: ' + Date() + '\n');
      }
  });

});

app.listen(3000, function() {
  console.log('Server listening on port 3000' + '\n');
});
