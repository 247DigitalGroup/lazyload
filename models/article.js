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
    // tags: Array,
    // notes: Array,
    // low_quality: Boolean,
    assigned: String,
    // tagged: Boolean,
    image_urls: Array,
    image_tagged: Boolean,
    note: String,
    skipped: Boolean
});

Article.plugin(mongoosePaginate);
module.exports = mongoose.model('news_articles', Article);

