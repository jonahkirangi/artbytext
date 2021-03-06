var config = require('./config.js');
var express = require('express');
var exphbs  = require('express-handlebars');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var twilio = require('twilio')(config.accountSid, config.authToken);
var csrf = require('csurf');

var csrfProtection = csrf({ cookie: true });

var app = express();

// Express Setup
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// View engine Setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Routing Setup
app.get('/', csrfProtection, function (req, res) {
  // Pass the csrfToken to the view
  res.render('home', { csrfToken: req.csrfToken() });
});

app.post('/', csrfProtection, function (req, res) {

  // Twilio configuration
  twilio.messages.create({
    from: config.twilioNumber,
    to: req.body.receivedNum,
    body: req.body.randomArt
  }, function(err, message) {
      if (err) {
        console.log('Text failed because: ' + err.message);
        res.send({"message" : "Message failed"});
      } else {
        console.log('Text sent! Message SID: ' + message.sid);
        res.send({"message" : "Message sent", "status" : 200});
      }
  });

});

app.listen(3000, function() {
  console.log('Server listening on port 3000' + '\n');
});
