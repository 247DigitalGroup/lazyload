// dependencies
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan  = require('morgan');

// main config
var app = express();
app.set('port', process.env.PORT || 6969);
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public/build')));

// mongoose
mongoose.connect('mongodb://localhost/lion_crawlers_test');

// Configuring Passport
var passport = require('passport');
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});
