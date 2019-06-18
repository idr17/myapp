var mongoose = require('mongoose');
var dbURL = require('./properties').DB;

//export this function and imported by server.js
module.exports =function(){
    mongoose.Promise = global.Promise
    mongoose.connect(dbURL);
}