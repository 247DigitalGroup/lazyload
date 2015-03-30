var should = require("should");
var mongoose = require('mongoose');
var User = require("../models/user.js");
var db;

describe('User', function() {

before(function(done) {
  db = mongoose.connect('mongodb://localhost/lion_crawlers_test');
   done();
 });

 after(function(done) {
   mongoose.connection.close()
   done();
 });

 beforeEach(function(done) {
  var user = new User({
    email: 'test@clicklion.com',
    password: 'testy'
  });

  user.save(function(error) {
    if (error) console.log('error' + error.message);
    else console.log('no error');
    done();
   });
 });

 it('find a user by email', function(done) {
    User.findOne({ email: 'test@clicklion.com' }, function(err, user) {
      user.email.should.eql('test@clicklion.com');
      console.log("   email: ", user.email)
      done();
    });
 });

 afterEach(function(done) {
    User.remove({}, function() {
      done();
    });
 });

});
