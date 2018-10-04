const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;
const { Peso } = require('../models/peso');
const { authenticate } = require('../middleware/authenticate');

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
    Peso.findByUser(req.session.user).then(
        (pesos) => {
            res.render('peso.hbs', { pesos });
        }, (err) => {
            res.send(400);
        }).catch((err) => {
            res.status(401).send();
        });
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
        res.status(400).send('invalid id');
    }

});

app.delete('/peso/:id', authenticate, (req, res) => {
    deletePeso(req, res);
});


var saveMedida = (medida, res) => {
    medida.save().then((doc) => {
        res.redirect('/peso');
    }).catch((err) => {
        res.status(400).send(err);
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
                res.status(400).send('empty');
            }
        });
    }
    else {
        res.status(400).send('invalid id');
    }
}

function updatePeso(req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['data', 'quilos']);
    if (ObjectId.isValid(id)) {
        Peso.findByIdAndUpdate(id, { $set: body }, { new: true }).
            then((doc) => {
                if (doc) {
                    res.redirect('/peso');
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