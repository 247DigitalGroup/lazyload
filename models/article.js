var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var Article = new Schema({
    url: String,
    title: String,
    body: String,
    image_url: String,
    pubdate: Date,
    html: String,
    tags: Array,
    notes: Array,
    image_blocked: Boolean,
    low_quality_image: Boolean
});

Article.plugin(mongoosePaginate);
module.exports = mongoose.model('articles', Article);
