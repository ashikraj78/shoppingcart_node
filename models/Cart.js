var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    numberOfItem: {type:Number, default:1},
    cartProduct : {type:Schema.Types.ObjectId, require : true, ref:"Product"},
    cartOwner :{type:Schema.Types.ObjectId, require:true, ref:"User"}
},{timestamps:true});



module.exports = mongoose.model("Cart", cartSchema);