const mongoose = require('mongoose');
const {tipoAtividade} = require('./tipo-atividade');

var schema = new mongoose.Schema({
    tipo: {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return (tipoAtividade.indexOf(value) > -1) ;
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

var AtividadeFisica = mongoose.model('AtividadeFisica', schema);

module.exports = { AtividadeFisica };