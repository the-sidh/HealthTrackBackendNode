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

    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

});

schema.statics.findMostRecent = function (user) {
    var pressaoFound = Pressao.findOne({
        _creator: user._id,
    }).sort({ "data": -1 });
    return pressaoFound;

}


schema.statics.findByUser = function (user){        
    var medida = Pressao.find({
        _creator: user._id,
    }).sort({ "data": -1 });
    return medida;
};

var Pressao = mongoose.model('Pressao', schema);

module.exports = { Pressao };