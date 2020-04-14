'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {type: String},
    user: {type: String},
    password: {type: String}
});

mongoose.model('User', userSchema);