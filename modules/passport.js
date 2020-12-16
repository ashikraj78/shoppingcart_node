var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/User')

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
   var email = profile._json.email;
   var githubUser = {
        email :email,
        providers : [profile.provider],
        name: profile.displayName,
        image:profile.photos[0].value
   }
   User.findOne({email},(err,user)=>{
       if(err) return cb(err,false);
       if(!user){
           User.create(githubUser, (err,user)=>{
               if(err) return cb(err,false);
               cb(null,user);
           })
       }else{
           if(user.providers.includes(profile.provider)){
               return cb(err,user);
            }else{
                user.providers.push(profile.provider);
                user.github = {...githubUser};
                user.save((err,updatedUser)=>{
                    cb(null,updatedUser);
                })
            }
        }
   })
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        var email = profile._json.email;
        var googleUser = {
            email :email,
            providers : [profile.provider],
            name: profile.displayName,
            image:profile.photos[0].value
        }
        User.findOne({email},(err,user)=>{
            if(err) return cb(err,false);
            if(!user){
                User.create(googleUser, (err,user)=>{
                    if(err) return cb(err,false);
                    cb(null,user);
                })
            }else{
                if(user.providers.includes(profile.provider)){
                    return cb(err,user);
                }else{
                    user.providers.push(profile.provider);
                    user.github = {...googleUser.google};
                    user.save((err,updatedUser)=>{
                        cb(null,updatedUser);
                    })
                }
            }
        })
    }
));
passport.serializeUser((user, cb)=>{
    cb(null, user.id);
})

passport.deserializeUser(function(id, cb) {
    User.findById(id,(err, user)=>{
        if(err) return cb(err,false);
        cb(null, user);
    });
});