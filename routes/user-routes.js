var express = require('express');
var userRoutes = express.Router();


// 
const { User } = require('../models/user');
const _ = require('lodash');
const { authenticate } = require('../middleware/authenticate');
const bodyParser = require('body-parser');

userRoutes.use(bodyParser.json());

var getUser = (req, res, next) => {

    if (req.query.email) {
        console.log(req.query.email);
        User.findOne({ email: req.query.email }).then((user) => {
            if (user) {
                res.status(200).send({ user });
            } else {
                res.status(401).send('empty');
            }

        }, (err) => {
            res.status(401).send(err);
        });
    }
    else {
        User.find().then((users) => {
            res.status(200).send({ users });
        });

    }
    next();
};


var addUser =  (req, res, next) => {
    var body = _.pick(req.body, ['email', 'password', 'nome', 'altura', 'dataNasc', 'genero']);
    var user = new User({
        email: body.email,
        password: body.password,
        nome: body.nome,
        altura: body.altura,
        dataNasc: body.dataNasc,
        genero: body.genero
    });

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    });
    next();
};

var getMe = (req, res, next) => {
    res.send(req.user);
    next();
};

module.exports = function (userRoutes) {
    userRoutes.get('/user', getUser);
    userRoutes.post('/user', addUser);
    userRoutes.get('/user/me/',authenticate, getMe);
};