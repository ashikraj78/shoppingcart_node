var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name : {type:String, required: true},
    category : {type:String, required: true},
    price: {type:Number, required:true},
    author : {type:Schema.Types.ObjectId, required:true , ref:'User'},
    likes : {type:Number, default:0},
    likesUser : [{type:Schema.Types.ObjectId, ref:"User"}],
    reviews : [{type:Schema.Types.ObjectId, ref:'Review'}],
    image:String
},{timestamps : true});

module.exports = mongoose.model('Product', productSchema);