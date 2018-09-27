const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    data: {
        type: Date,
        required: true
    },

    sistolica: {
        type: Number,
        required: true,
        minlength: 6
    },

    diastolica: {
        type: Number,
        required: true,
        minlength: 6
    },

});

var Pressao = mongoose.model('Pressao', schema);

module.exports = { Pressao };