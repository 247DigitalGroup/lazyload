var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var cors = require('cors')

var articleSchema = new mongoose.Schema({
    url: String,
    title: String,
    body: String,
    image_url: String,
    pubdate: Date,
    html: String,
});
articleSchema.plugin(mongoosePaginate)
var Article = mongoose.model('links', articleSchema);

mongoose.connect('localhost/lion_crawlers');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/build')));
app.use(cors())

app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.post('/articles', function(req, res, next) {
    Article.paginate(req.body.query, req.body.page, req.body.count, function(error, pageCount, results, itemCount) {
      if (error) {
          return next(error);
      } else {
          res.send({'totalResults': itemCount, 'results': results})
      }
    }, { columns: 'url title body image_url pubdate face_coordinates contextual_scores'});
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
