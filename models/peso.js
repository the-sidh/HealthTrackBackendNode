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
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

});


schema.statics.findMostRecent = function (user) {
    var pesoFound = Peso.findOne({
        _creator: user._id,
    }).sort({ "data": -1 });
    return pesoFound;

}

schema.statics.findByUser = function (user) {
    var pesoFound = Peso.find({
        _creator: user._id,
    });

    return pesoFound;
};

var Peso = mongoose.model('Peso', schema);


module.exports = { Peso };