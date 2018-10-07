var app = require('../healthTrack').app;
const { User } = require('../models/user');
const _ = require('lodash');
const { authenticate } = require('../middleware/authenticate');
const bodyParser = require('body-parser');
const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const { logger } = require('../log/logger');
const { generos } = require('../models/genero');

app.use(bodyParser.json());

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

app.get('/user-edit', authenticate, (req, res) => {
    let user = req.session.user;
    if (user) {
        User.findByEmail(user.email).then((userFound) => {
            res.render('edit_cadastro.hbs',
                {
                    user: userFound,
                    req,
                    generos
                });
        });
    } else {
        let err = 'usuario nao encontrado';
        logger.error(`${err}`);
        res.redirect('/');
    }

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
        password: body.password
    });

    user.save().then(() => {
        req.session.user = user;
        res.redirect('/');
    }).catch((err) => {
        res.redirect('/login');
    });
});


app.post('/user/update/', authenticate, (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'nome', 'altura', 'dataNasc', 'genero']);
    body.dataNasc = moment(body.dataNasc, dateFormat).toDate();
    let user = req.session.user;
    if (user) {
        User.findByEmail(user.email).then((userFound) => {
            id = userFound._id;
            return User.findByIdAndUpdate(id.toHexString(), { $set: body }, { new: true })
        }).then((doc) => {
                if (doc) {
                    res.redirect('/');
                }
                else {
                    logger.error(`empty`);
                    res.redirect('/');
                }
            }, (err) => {
                logger.error(`${err}`);
                res.redirect('/');
            });
    }
    else {
        logger.error('invalid id');
        res.redirect('/alimentacao');
    }

});

app.get('/user/logout/', (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
});