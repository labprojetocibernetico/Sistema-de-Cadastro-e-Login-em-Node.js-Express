var mongoose = require('mongoose');

var SignupSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    login:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

var Signup = module.exports = mongoose.model('user', SignupSchema);