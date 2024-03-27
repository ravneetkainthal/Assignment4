// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
PrdSchema = new Schema({
    asin : Number,
    title : String,
	imgUrl :String,
    stars: Number,
    reviews:Number,
    price: Number,
    listPrice: Number,
    categoryName: String,
    isBestSeller: Boolean,
    boughtInLastMonth:Number


});
module.exports = mongoose.model('Products', PrdSchema);
