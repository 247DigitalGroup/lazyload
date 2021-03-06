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
app.set('port', process.argv[2] || 8080);
app.use(morgan('tiny'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true }));
app.use(cors({origin:true, credentials:true}));
app.use(express.static(path.join(__dirname, 'public/build/tagger')));

// mongoose
mongoose.connect('mongodb://localhost/crawldb_test');

// Session
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
app.use(session({
  store: new RedisStore(),
  secret: 'big cats',
  resave: false,
  saveUninitialized: true
}))

// Passport
var passport = require('passport');
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
