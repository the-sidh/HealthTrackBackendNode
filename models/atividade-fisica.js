const mongoose = require('mongoose');
const {tipoAtividade} = require('./tipo-atividade');

var schema = new mongoose.Schema({
    tipo: {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
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

    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

});


schema.statics.findByUser = function (user){
        
    var medida = AtividadeFisica.find({
        _creator: user._id
    });

    return medida;
};

var AtividadeFisica = mongoose.model('AtividadeFisica', schema);

module.exports = { AtividadeFisica };