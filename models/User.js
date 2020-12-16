var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema({
    name : String,
    email : {type:String, required: true, unique:true},
    password : {type:String},
    image:String,
    admin:{type:Boolean,default:false},
    cartList:[{type:Schema.Types.ObjectId, require : true, ref:"Cart"}],
    github:{
        name:String,
        image:String
    },
    google:{
        name:String,
        image:String
    },
    providers:[String]
},{timestamps : true});

userSchema.pre('save',function(next) {
    if(this.password){
        this.password = bcrypt.hashSync(this.password,10);
    }
    next()
});
userSchema.pre('save',function(next) {
    if(this.email=== "user1@gmail.com"){
        this.admin = true;
    }
    next()
});

userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', userSchema);