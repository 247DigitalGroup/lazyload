var passport = require('passport');
var Article = require('../models/article');
var mongoosePaginate = require('mongoose-paginate');
var express = require('express');
var router = express.Router();


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401).send('Unauthorized')
}

module.exports = function(passport){ 

  router.get('/', function(req, res){
      res.status(200).send('OK');
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup'),
    function(req, res) {
      res.status(200).send('Hi ' + req.user.email);
    }
  );

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login'),
    function(req, res) {
      res.status(200).send('Hi ' + req.user.email);
    }
  );

  /* Handle Signout */
  router.get('/signout', function(req, res) {
    req.logout();
  });

  router.post('/articles', function(req, res, next) {
      Article.paginate(req.body.query, req.body.page, req.body.count, function(error, pageCount, results, itemCount) {
        if (error) {
            return next(error);
        } else {
            res.send({'totalResults': itemCount, 'results': results})
        }
      }, { columns: 'url title body image_url pubdate face_coordinates'});
  });

  router.post('/articles/tag', isAuthenticated, function(req, res, next) {
    var id = req.body.id
    var tag = req.body.tag
    if (id && tag) {
      Article.update(
        {'_id': id},
        {'$push': { 'tags': { 'tag': tag, 'user': req.user.email}}},
        {safe: true, upsert: false},
        function(error, result){
          if (error) {return next(error)}
        });
    };
    Article.findOne(
      {'$and': [
        {'$where': 'this.tags.length<2'},
        {'tags.user': {'$ne': req.user.email}}
      ]}, '_id url title image_url', function (error, doc) {
        if (error) {return next(error);}
        var data = {'data': doc};
        res.status(200).send(data);
      });
  });

  return router;
}
