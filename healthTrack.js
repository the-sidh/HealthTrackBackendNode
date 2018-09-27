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
const { authenticate } = require('./middleware/authenticate');
const { ObjectId } = require('mongodb').ObjectId;
const hbs = require('hbs');
const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
hbs.registerPartials(__dirname + '/views/partials');
const port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
var { User } = require('./models/user');
var { Peso } = require('./models/peso');
var { mongoose } = require('./db/mongoose');



hbs.registerHelper('formatDate', (datetime) => {
    return moment(datetime).format(dateFormat);
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/save_peso/:id', (req, res) => {
    var operation = req.body.operation;
    if (operation === 'update') {
        req.body.data = moment(req.body.data, dateFormat).toDate();
        updatePeso(req, res);
    } else {
        deletePeso(req, res);
    }
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'home',
        wellcomeMsg: 'Hi!!',
    });
});

app.get('/addPeso',(req,res)=>{
    res.render('add_peso.hbs');
});

app.patch('/peso/:id', (req, res) => {
    updatePeso(req, res);

});


app.get('/peso/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Peso.findById(id).then((peso) => {
            res.render('edit_peso.hbs',
                {
                    peso,
                    req
                });
            // if (peso) {
            //     res.status(200).send({ peso });
            // } else {
            //     res.status(200).send('empty');
            // }
        });
    } else {
        res.status(400).send('invalid id');
    }

});

app.get('/peso', (req, res) => {
    Peso.find().then((pesos) => {
        res.render('peso.hbs', { pesos });
        //res.status(200).send({ pesos });        
    });
});

app.delete('/peso/:id', (req, res) => {
    deletePeso(req, res);

});

app.post('/peso', (req, res) => {
    var body = _.pick(req.body, ['quilos', 'data']);
    req.body.data = moment(req.body.data, dateFormat).toDate();
    var peso = new Peso({
        quilos: req.body.quilos,
        data: req.body.data
    });

    saveMedida(peso, res);
});

var saveMedida = (medida, res) => {
    medida.save().then((doc) => {
      res.redirect('/peso');
        // res.status.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
};


app.get('/user', (req, res) => {

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

app.get('/user/me/', authenticate, (req, res) => {
    res.send(req.user)
});

function deletePeso(req, res) {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Peso.findByIdAndRemove(id).then((peso) => {
            if (peso) {
                res.status(200).send(`removed ${peso}`);
            }
            else {
                res.status(200).send('empty');
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
                    res.status(200).send(doc);
                }
                else {
                    res.status(200).send('empty');
                }
            }, (err) => {
                res.status(400).send(err);
            });
    }
    else {
        res.status(400).send('invalid id');
    }
}

app.listen(process.env.PORT);
module.exports = { mongoose, app };
