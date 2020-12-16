var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    content : {type:String, require:true},
    productId : {type:Schema.Types.ObjectId, require : true, ref:"Product"},
    author :{type:Schema.Types.ObjectId, require:true, ref:"User"}
},{timestamps:true});



module.exports = mongoose.model("Review", reviewSchema);