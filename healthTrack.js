var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrack';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrackTest'
}

const express = require('express');
const hbs = require('hbs');
const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';
const port = process.env.PORT || 3000;
var app = express();
var { mongoose } = require('./db/mongoose');
app.set('view engine', 'hbs');

// const  userRoutes  = require('./routes/user-routes');
// app.use('/',userRoutes);


//app.use('/',pesoRoutes);
//app.use('/addPeso',pesoRoutes);
//app.use('/save_peso',pesoRoutes);

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('formatDate', (datetime) => {
    return moment(datetime).format(dateFormat);
});

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res,next) => {
//     res.render('home.hbs', {
//         pageTitle: 'home',
//         wellcomeMsg: 'Hi!!',
//     });
//     next();
// });
module.exports = { mongoose, app };
const pesoRoutes = require('./routes/peso-routes');
const atividadeRoutes = require('./routes/atividade-fisica-routes');
app.listen(process.env.PORT);
