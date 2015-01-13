var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    _id: Number,
    url: String,
    title: String,
    body: String,
    image_url: String,
    pubdate: Date,
    html: String,
    link_type: String
});

var Article = mongoose.model('links', articleSchema);

mongoose.connect('localhost/lion_crawlers');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.post('/articles', function(req, res, next) {
    var query = Article.find(req.body);
    query.select('url title body image_url');
    query.limit(10);
    query.exec(function(err, articles) {
    if (err) return next(err);
    res.send(articles);
    });
});

app.get('*', function(req, res) {
    res.redirect('/');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});


app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
