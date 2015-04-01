var passport = require('passport');
var Article = require('../models/article');
var User = require('../models/user');
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
  router.get('/logout', function(req, res) {
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
    var note = req.body.note
    var low_quality = req.body.low_quality
    if (id && tag) {
      var query = {'$push': {'tags': {'tag': tag, 'user': req.user.email}}}
      if (note) {
        query['$push']['notes'] = {
          'note': note,
          'user': req.user.email
        }}
      if (low_quality == 'true') {
          query['$set'] = {'low_quality': true}
      }
      Article.findOneAndUpdate(
        {'_id': id},
        query, {safe: true, upsert: false},
        function(error, result){
          if (error) {return next(error)}
        });
    };
    var rand = Math.random();
    var gte_filter = {'$and': [
          {'rnd': {'$gte': rand}},
          {'$where': 'this.tags.length<2'},
          {'tags.user': {'$ne': req.user.email}}
      ]};
    var fields = { _id: 1, url: 1, title: 1, image_url: 1, notes: 1};
    Article.findOne(gte_filter, fields, function (error, result) {
      if (result) {
        var data = {'data': result};
        res.status(200).send(data);
      } else {
        var lte_filter = {'$and': [
                    {'rnd': {'$lte': rand}},
                    {'$where': 'this.tags.length<2'},
                    {'tags.user': {'$ne': req.user.email}}
            ]};
        Article.findOne(lte_filter, fields, function (error, result) {
          if (error) {return next(error);}
            if (result) {
              var data = {'data': result};
              res.status(200).send(data);
            } else {
              res.status(200).send({'data': {}});
            }
        });
      }
    });
  });

  return router;
}
