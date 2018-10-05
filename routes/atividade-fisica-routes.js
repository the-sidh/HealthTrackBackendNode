const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;
const { AtividadeFisica } = require('../models/atividade-fisica');
const redirectTo = '/atividade-fisica';
var app = require('../healthTrack').app;
const { tipoAtividade } = require('../models/tipo-atividade');
const { authenticate } = require('../middleware/authenticate');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/save_atividade-fisica/:id', authenticate, (req, res) => {
    var operation = req.body.operation;
    if (operation === 'update') {
        req.body.data = moment(req.body.data, dateFormat).toDate();
        updateMedida(req, res);
    } else {
        deleteMedida(req, res);
    }
});

app.post('/atividade-fisica', authenticate, (req, res) => {
    var user = req.session.user;
    var body = _.pick(req.body, ['data', 'tipo', 'calorias', 'descricao']);
    body.data = moment(req.body.data, dateFormat).toDate();    
    if (user) {
        var atividadeFisica = new AtividadeFisica({
            tipo: body.tipo,
            data: body.data,
            calorias: body.calorias,
            descricao: body.descricao,
            _creator: user._id,
        });

        saveMedida(atividadeFisica, res);
    }
});


app.use(bodyParser.json());

app.get('/atividade-fisica', authenticate, (req, res) => {
    const user = req.session.user;
    if (user) {
        AtividadeFisica.findByUser(user).then(
            (AtividadeFisica) => {
                res.render('atividade_fisica.hbs', { AtividadeFisica });
            }, (err) => {
                res.send(400);
            }).catch((err) => {
                res.status(401).send();
            });
    }
});

app.get('/add-atividade-fisica', authenticate, (req, res) => {
    res.render('add_atividade_fisica.hbs', { tipoAtividade });
});

app.patch('/atividade-fisica/:id', authenticate, (req, res) => {
    updateMedida(req, res);
});

app.get('/atividade-fisica/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        AtividadeFisica.findById(id).then((atividade) => {
            res.render('edit_atividade_fisica.hbs',
                {
                    atividade,
                    req,
                    tipoAtividade
                });
        });
    } else {
        res.status(400).send('invalid id');
    }

});

app.delete('/atividade-fisica/:id', authenticate, (req, res) => {
    deleteMedida(req, res);
});



var saveMedida = (medida, res) => {
    medida.save().then((doc) => {
        res.redirect(redirectTo);
    }).catch((err) => {
        res.status(400).send(err);
    });
};


function deleteMedida(req, res) {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        AtividadeFisica.findByIdAndRemove(id).then((atividade) => {
            if (atividade) {
                res.redirect(redirectTo);
            }
            else {
                res.status(400).send('empty');
            }
        });
    }
    else {
        res.status(400).send('invalid id');
    }
}


function updateMedida(req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['data', 'tipo', 'calorias', 'descricao']);
    if (ObjectId.isValid(id)) {
        AtividadeFisica.findByIdAndUpdate(id, { $set: body }, { new: true }).
            then((doc) => {
                if (doc) {
                    res.redirect(redirectTo);
                }
                else {
                    res.status(400).send('empty');
                }
            }, (err) => {
                res.status(400).send(err);
            });
    }
    else {
        res.status(400).send('invalid id');
    }
}