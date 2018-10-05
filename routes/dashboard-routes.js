const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;
const { Peso } = require('../models/peso');
const { authenticate } = require('../middleware/authenticate');
const { Pressao } = require('../models/pressao');
const { User } = require('../models/user');
const {logger} = require('../log/logger');

var app = require('../healthTrack').app;

app.get('/', authenticate, (req, res) => {
    var user = req.session.user
    var pesoFound;
    var completeUser;
    var pressaoFound;
    var statusPressao;
    var imc;
    var idade;


    if (user) {    
        Peso.findMostRecent(user).then((peso) => {
            if (peso) {
                pesoFound = peso;
            }
            return User.findByEmail(user.email);
        }).then((userFound) => {
            completeUser = userFound;
            if (userFound && pesoFound) {
                idade = calculateAge(userFound.dataNasc);
                var squareHeigth = Math.pow(userFound.altura, 2);
                var valorIMC = pesoFound.quilos / squareHeigth;
                var situacaoIMC = getSituacaoIMC(valorIMC);
                imc = {
                    valor: valorIMC,
                    status: situacaoIMC
                };
            }
            return Pressao.findMostRecent(user);
        }).then((pressao) => {
            if (pressao) {
                pressaoFound = pressao;
                statusPressao = getStatusPressao(pressaoFound);
            }
            res.render('dashboard.hbs', {
                peso: pesoFound,
                pressao: pressaoFound,
                user: completeUser,
                imc,
                idade,
                status_pressao: statusPressao
            });

        });


    }
});

var getSituacaoIMC = (valorIMC) => {
    if (valorIMC < 16) {
        return "Magreza grave";
    } else if (valorIMC >= 16 && valorIMC < 17) {
        return "Magreza moderada";
    } else if (valorIMC >= 17 && valorIMC < 18.5) {
        return "Magreza leve";
    } else if (valorIMC >= 18.5 && valorIMC < 25) {
        return "Saudável";
    } else if (valorIMC >= 25 && valorIMC < 30) {
        return "Sobrepeso";
    } else if (valorIMC >= 30 && valorIMC < 35) {
        return "Obesidade nível 1";
    } else if (valorIMC >= 35) {
        return "Obesidade nível 2";
    }
}

var getStatusPressao = (pressaoFound) => {
    var sistolica = pressaoFound.sistolica;
    var diastolica = pressaoFound.diastolica;
    if (sistolica >= 140 || diastolica >= 90) {
        return "Pressão elevada";
    } else if (sistolica <= 120 || diastolica <= 80) {
        return "Pressão abaixo do normal";
    } else {
        return "Pressão acima do normal";
    }
    return situacao;
}

var calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
