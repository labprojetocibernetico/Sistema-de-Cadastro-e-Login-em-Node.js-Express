var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

//Connect to DB
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console,'Erro de Conexão com MongoDB'));
db.once('open', function(){
    console.log('Conectado no MongoDB');
});

//Init App
app.use(express.json());

//View Egine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));
app.locals.errors = null;

//Body-Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Express Session
app.use(session({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,   
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Express Connect Flash
app.use(require('connect-flash')());
//Midlewares
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    res.locals.sucess_msg = req.flash("sucess_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//Set Routes
var pages = require('./routes/pages.js');
app.use('/', pages);

//Star WebServer
var port = 3000;
app.listen(port, function(){
    console.log("WebServer rodando na porta: "+port);    
});