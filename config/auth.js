var mongoose = require("mongoose");
var LocalStrategy = require('passport-local').Strategy;
require('../models/signup_model');
var Signup = mongoose.model('user');
var bcrypt = require("bcrypt");
var db = mongoose.connection;

module.exports = function(passport){ 
  passport.use( new LocalStrategy({usernameField: "login", passwordField: "password"}, 
  (login,password, done) =>{
    Signup.findOne({login: login}).then((user) =>{
        if(!user){
            return done(null, false, {message: "Essa conta não existe!"})
        }
        bcrypt.compare(password, user.password,(erro, batem)=>{
          if(batem){
            return done(null, user);
          }else{
            return done(null, false, {message: ""});

          }
        })
      })
}));    
  
  passport.serializeUser(function(user, done){
    done(null, user);
  });
  
  passport.deserializeUser(async(id, done)=>{
    Signup.findById(id, function(err, user){
      done(err,user);
    })
  });
}