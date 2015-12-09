var config = require('./config.js');
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var twilio = require('twilio')(config.accountSid, config.authToken);
var csrf = require('csurf');

var csrfProtection = csrf({ cookie: true });

var app = express();

// Application middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Application routing
app.get('/', function (req, res) {
  res.render('home');
});

app.post('/', csrfProtection, function(req, res) {
  // Pass the csrfToken to the view
  res.render('home', { csrf: req.csrfToken() });

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
