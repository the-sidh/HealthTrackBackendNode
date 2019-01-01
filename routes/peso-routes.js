const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;
const { Peso } = require('../models/peso');
const { authenticate } = require('../middleware/authenticate');
const { logger } = require('../log/logger');
const querystring = require('querystring');

var app = require('../healthTrack').app;

app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/save_peso/:id', authenticate, (req, res) => {
    var operation = req.body.operation;
    if (operation === 'update') {
        req.body.data = moment(req.body.data, dateFormat).toDate();
        updatePeso(req, res);
    } else {
        deletePeso(req, res);
    }
});

app.post('/peso', authenticate, (req, res) => {
    var body = _.pick(req.body, ['quilos', 'data']);
    req.body.data = moment(req.body.data, dateFormat).toDate();
    var user = req.session.user;
    if (user) {
        var peso = new Peso({
            quilos: req.body.quilos,
            data: req.body.data,
            _creator: user._id,
        });

        saveMedida(peso, res);
    }
});


app.use(bodyParser.json());

app.get('/peso', authenticate, (req, res) => {
    const user = req.session.user;
    const error_message = req.query.error_message;
    const success_message = req.query.success_message;
    if (user) {
        Peso.findByUser(user).then(
            (pesos) => {
                res.render('peso.hbs', {
                    pesos,
                    error_message,
                    success_message,
                });
            }, (err) => {
                logger.error(`${err}`);
                res.redirect('/peso');
            }).catch((err) => {
                logger.error(`${err}`);
                res.redirect('/peso');
            });
    }
});

app.get('/addPeso', authenticate, (req, res) => {
    res.render('add_peso.hbs');
});

app.patch('/peso/:id', authenticate, (req, res) => {
    updatePeso(req, res);
});

app.get('/peso/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Peso.findById(id).then((peso) => {
            res.render('edit_peso.hbs',
                {
                    peso,
                    req
                });
        });
    } else {
        logger.error(`invalid id`);
        res.redirect('/peso');
    }

});

app.delete('/peso/:id', authenticate, (req, res) => {
    deletePeso(req, res);
});


var saveMedida = (medida, res) => {
    medida.save().then((doc) => {
        const query = querystring.stringify({
            'success_message': 'Peso cadastrado com sucesso'
        });
        res.redirect('/peso?' + query);
    }).catch((err) => {
        const error = `Erro ao tentar salvar medida: ${err}`;
        logger.error(error);
        const query = querystring.stringify({
            'error_message': error
        });
        res.redirect('/peso?' + query);
    });
};


function deletePeso(req, res) {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Peso.findByIdAndRemove(id).then((peso) => {
            if (peso) {
                res.redirect('/peso');
            }
            else {
                logger.error(`Erro ao tentar deletar medida: ${err}`);
                res.redirect('/peso');
            }
        });
    }
    else {
        logger.error(`invalid id`);
        res.redirect('/peso');
    }
}

function updatePeso(req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['data', 'quilos']);
    if (ObjectId.isValid(id)) {
        Peso.findByIdAndUpdate(id, { $set: body }, { new: true }).
            then((doc) => {
                if (doc) {
                    res.redirect('/peso', {
                        error_message: req.params.error_message,
                        success_message: req.params.success_message,
                    });
                }
                else {
                    logger.error(`empty`);
                    res.redirect('/peso', {
                        error_message: req.params.error_message,
                        success_message: req.params.success_message,
                    });

                }
            }, (err) => {
                logger.error(`${err}`);
                res.redirect('/peso');
            });
    }
    else {
        logger.error(`invalid id`);
        res.redirect('/peso');
    }
}