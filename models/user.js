var mongoose = require('mongoose');
 
module.exports = mongoose.model('User', {
    email: {type: String, required: true, unique: true},
    password: {type: String, unique: true},
});
