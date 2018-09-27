const mongoose = require('mongoose');
const {tipoAlimentacao} = require('./tipo-alimentacao');
var schema = new mongoose.Schema({
    tipo: {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return tipoAlimentacao.contains(value);
            }, message: '{VALUE} is not valid'

        }
    },

    descricao : {
        type: String,
        trim: true,
        required: false,
        minlength: 1,
        unique: true,
    },

    data: {
        type: Date,
        required: true
    },

    calorias: {
        type: Number,
        required: true,
        minlength: 6
    },

});

var Alimentacao = mongoose.model('Alimentacao', schema);

module.exports = { Alimentacao };