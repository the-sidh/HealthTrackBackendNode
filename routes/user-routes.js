var app = require('../healthTrack').app;
const { User } = require('../models/user');
const _ = require('lodash');
const { authenticate } = require('../middleware/authenticate');
const bodyParser = require('body-parser');
const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const {logger} = require('../log/logger');

app.use(bodyParser.json());

app.get('/user',  (req, res) => {
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
});


app.post('/user', (req, res) => {
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
});

app.get('/user/me/',authenticate, (req, res) => {
    res.send(req.user);
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/signup/', (req, res) => {
    res.render('cadastro.hbs');
});

app.post('/user/signin/', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        req.session.user = user;
        res.redirect('/');
    }).catch((err) => {
        res.redirect('/login');
    });
});

app.post('/user/register/', (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'nome', 'altura', 'dataNasc', 'genero']);
    body.dataNasc = moment(req.body.dataNasc, dateFormat).toDate();
    var user = new User({
        nome: body.nome,
        altura: body.altura,
        dataNasc: body.dataNasc,
        genero: body.genero,
        email: body.email,
        password : body.password
    });

    user.save().then(() => {
        req.session.user = user;
        res.redirect('/');
    }).catch((err) => {
        res.redirect('/login');
    });
});

app.get('/user/logout/', (req, res) => {
          req.session.user = undefined;
          res.redirect('/login');
});