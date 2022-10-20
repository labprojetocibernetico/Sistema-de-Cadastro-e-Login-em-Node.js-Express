var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var db = mongoose.connection;
var passport = require('passport');
require("../config/auth")(passport);

var Signup = require('../models/signup_model');

router.get('/', function(req, res){
    res.render('index', {
        title: 'Home'
    });    
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/admin/adm-login',
        failureFlash: true
    
      })(req, res, next)
});

router.get('/signup', function(req, res){
    res.render('signup', {
        title: 'Signup'
    });    
});

router.post('/signup', async function(req, res){

    var erros = [];

    var name = req.body.name;
    var login = req.body.login;
    var password0 = await bcrypt.hash(req.body.password0,10);
    var password1 = req.body.password1;
    var data = {
        "name": name,
        "login": login,
        "password": password0
    }

    var userExist = await Signup.findOne({login: req.body.login });
    if(userExist){
        req.flash('error',"Usuário já existe!");            
        return res.redirect('/signup');   
    }
    
    if(!req.body.name || typeof req.body.name == undefined || req.body.name ==null){
        erros.push({alert: "Nome Inválido!"});    
    }
    if(!req.body.login || typeof req.body.login == undefined || req.body.login ==null){
        erros.push({alert: "Usuário Inválido!"});    
    }
    if(!req.body.password0 || typeof req.body.password0 == undefined || req.body.password0 ==null){
        erros.push({alert: "Digite uma senha!"});    
    }
    if(req.body.password0 != req.body.password1 && typeof req.body.password0 == undefined || req.body.password0 ==null ){
        erros.push({alert: "Senhas não coincidem!"});    
    }
    if(! req.body.password1 || typeof req.body.password1 == undefined || req.body.password1==null) {
        erros.push({alert: "Confirme a senha!"});  
    }

    if(erros.length>0){
        erros.forEach((err)=>{
            req.flash('error',err.alert);
            
        });
        return res.redirect('/signup');
    }else{

        db.collection('users').insertOne(data, function(err, collection){
            if(err) throw err;
            console.log("Usuário Cadastrado com Sucesso!");
        });
        return res.redirect('/');
    }
    

});

module.exports = router;