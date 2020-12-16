var User = require("../models/User");

exports.verifyUserLogin = (req,res,next)=>{
    var userId = req.session && req.session.userId;
    var userPassportId = req.session && req.session.passport &&req.session.passport.user;
    if(userId){
        next();
    }else if(userPassportId){
        next();
    } else{
        req.flash('Error', 'unauthenticated' );
        req.session.returnTo = req.originalUrl;
        return res.redirect('/');
    }
}
exports.verifyUserAdmin = (req,res,next)=>{
    console.log(req.session)
    var userId = req.session && req.session.userId && req.session.admin;
    var userPassportId = req.session && req.session.passport &&req.session.passport.user && req.session.passport.admin;
    if(userId){
        next();
    }else if(userPassportId){
        next();
    } else{
        req.flash('Error', 'Enter as admin ' );
        req.session.returnTo = req.originalUrl;
        return res.redirect('/users/login');
    }
}

exports.userInfo = (req,res,next)=>{
    var userId = req.session && req.session.userId;
    var userPassportId = req.session && req.session.passport &&req.session.passport.user;
    if(userId){
        User.findById(userId,"-password",(err,user)=>{
            req.user = user;
            res.locals.user = user;
            next();
        })
    }else if(userPassportId){
        User.findById(userPassportId, (err, user)=>{
            res.locals.user = user;
            next();
        }) 
    } else{
        req.user = null;
        res.locals.user = null ; 
        next();
    }
}



