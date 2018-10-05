const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;
const { Alimentacao } = require('../models/alimentacao');
const redirectTo = '/alimentacao';
var app = require('../healthTrack').app;
const { tipoAlimentacao } = require('../models/tipo-alimentacao');
const { authenticate } = require('../middleware/authenticate');
const { logger } = require('../log/logger');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/save_alimentacao/:id', authenticate, (req, res) => {
    var operation = req.body.operation;
    if (operation === 'update') {
        req.body.data = moment(req.body.data, dateFormat).toDate();
        updateMedida(req, res);
    } else {
        deleteMedida(req, res);
    }
});

app.post('/alimentacao', authenticate, (req, res) => {
    var body = _.pick(req.body, ['data', 'tipo', 'calorias', 'descricao']);
    body.data = moment(req.body.data, dateFormat).toDate();
    var user = req.session.user;
    if (user) {
        var alimentacao = new Alimentacao({
            tipo: body.tipo,
            data: body.data,
            calorias: body.calorias,
            descricao: body.descricao,
            _creator: user._id,
        });

        saveMedida(alimentacao, res);
    }
});


app.use(bodyParser.json());

app.get('/alimentacao', authenticate, (req, res) => {
    const user = req.session.user;
    if (user) {
        Alimentacao.findByUser(req.session.user).then(
            (Alimentacao) => {
                res.render('alimentacao.hbs', { Alimentacao });
            }, (err) => {
                logger.error(`${err}`);
                res.redirect('/alimentacao');
            }).catch((err) => {
                logger.error(`${err}`);
                res.redirect('/alimentacao');
            });
    }
});

app.get('/add_alimentacao', authenticate, (req, res) => {
    res.render('add_alimentacao.hbs', { tipoAlimentacao });
});

app.patch('/alimentacao/:id', authenticate, (req, res) => {
    updateMedida(req, res);
});

app.get('/alimentacao/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Alimentacao.findById(id).then((alimentacao) => {
            res.render('edit_alimentacao.hbs',
                {
                    alimentacao,
                    req,
                    tipoAlimentacao
                });
        });
    } else {
        logger.error(`${err}`);
        res.redirect('/alimentacao');
    }

});

app.delete('/alimentacao/:id', authenticate, (req, res) => {
    deleteMedida(req, res);
});



var saveMedida = (medida, res) => {
    medida.save().then((doc) => {
        res.redirect(redirectTo);
    }).catch((err) => {
        logger.error(`${err}`);
        res.redirect('/alimentacao');
    });
};


function deleteMedida(req, res) {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Alimentacao.findByIdAndRemove(id).then((alimentacao) => {
            if (alimentacao) {
                res.redirect(redirectTo);
            }
            else {
                logger.error(`empty`);
                res.redirect('/alimentacao');
            }
        });
    }
    else {
        logger.error(`invalid id`);
        res.redirect('/alimentacao');
    }
}


function updateMedida(req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['data', 'tipo', 'calorias', 'descricao']);
    if (ObjectId.isValid(id)) {
        Alimentacao.findByIdAndUpdate(id, { $set: body }, { new: true }).
            then((doc) => {
                if (doc) {
                    res.redirect(redirectTo);
                }
                else {
                    logger.error(`empty`);
                    res.redirect('/alimentacao');
                }
            }, (err) => {
                logger.error(`${err}`);
                res.redirect('/alimentacao');
            });
    }
    else {
        logger.error('invalid id');
        res.redirect('/alimentacao');
    }
}