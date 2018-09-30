const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    data: {
        type: Date,
        required: true
    },

    quilos: {
        type: Number,
        required: true,
        minlength: 6
    },

});

var Peso = mongoose.model('Peso', schema);


module.exports = { Peso };