const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;
const { Pressao } = require('../models/pressao');
const { authenticate } = require('../middleware/authenticate');
const { logger } = require('../log/logger');
var app = require('../healthTrack').app;

app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/save_pressao/:id', authenticate, (req, res) => {
    var operation = req.body.operation;
    if (operation === 'update') {
        req.body.data = moment(req.body.data, dateFormat).toDate();
        updateMedida(req, res);
    } else {
        deleteMedida(req, res);
    }
});

app.post('/pressao', authenticate, (req, res) => {
    var body = _.pick(req.body, ['sistolica', 'diastolica', 'data']);
    body.data = moment(req.body.data, dateFormat).toDate();
    var user = req.session.user;
    if (user) {
        var pressao = new Pressao({
            sistolica: body.sistolica,
            diastolica: body.diastolica,
            data: body.data,
            _creator: user._id,
        });

        saveMedida(pressao, res);
    }
});

app.use(bodyParser.json());

app.get('/pressao', authenticate, (req, res) => {
    const user = req.session.user;
    if (user) {
        Pressao.findByUser(user).then(
            (pressoes) => {
                res.render('pressao.hbs', { pressoes });
            }, (err) => {
                logger.error(`${err}`);
                res.redirect('/pressao');

            }).catch((err) => {
                logger.error(`${err}`);
                res.redirect('/pressao');
            });
    }else{
        logger.error(`No user`);
    }
});

app.get('/addPressao', authenticate, (req, res) => {
    res.render('add_pressao.hbs');
});

app.patch('/pressao/:id', authenticate, (req, res) => {
    updateMedida(req, res);
});

app.get('/pressao/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Pressao.findById(id).then((pressao) => {
            res.render('edit_pressao.hbs',
                {
                    pressao,
                    req
                });
        });
    } else {
        logger.error(`invalid id`);
        res.redirect('/pressao');
    }

});

app.delete('/pressao/:id', authenticate, (req, res) => {
    deleteMedida(req, res);
});


var saveMedida = (medida, res) => {
    medida.save().then((doc) => {
        res.redirect('/pressao');
    }).catch((err) => {
        logger.error(`${err}`);
        res.redirect('/pressao');
    });
};


function deleteMedida(req, res) {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Pressao.findByIdAndRemove(id).then((pressao) => {
            if (pressao) {
                res.redirect('/pressao');
            }
            else {
                logger.error(`${err}`);
                res.redirect('/empty');
            }
        });
    }
    else {
        res.status(400).send('invalid id');
    }
}

function updateMedida(req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['data', 'sistolica', 'diastolica']);
    if (ObjectId.isValid(id)) {
        Pressao.findByIdAndUpdate(id, { $set: body }, { new: true }).
            then((doc) => {
                if (doc) {
                    res.redirect('/pressao');
                }
                else {
                    logger.error(`empty`);
                    res.redirect('/pressao');
                }
            }, (err) => {
                logger.error(`${err}`);
                res.redirect('/pressao');
            });
    }
    else {
        logger.error(`invalid id`);
        res.redirect('/pressao');
    }
}