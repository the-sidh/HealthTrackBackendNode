var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrack';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrackTest'
}

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var { User } = require('./models/user');
var { mongoose } = require('./db/mongoose');


app.get('/user', (req, res) => {

    if (req.query.email) {
        console.log(req.query.email);
        User.findOne({ email: req.query.email }).then((user) => {
            res.status(200).send({ user });
        });
    }
    else {
        User.find().then((users) => {
            res.status(200).send({ users });
        });

    }
});


app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['email', 'password','nome','altura','dataNasc','genero']);
    var user = new User({
        email: body.email,
        password: body.password,
        nome : body.nome,
        altura: body.altura,
        dataNasc: body.dataNasc,
        genero : body.genero
    });

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    });
});



app.listen(3000);

module.exports = { mongoose, app }; 
