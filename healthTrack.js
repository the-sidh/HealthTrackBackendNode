var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrack';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrackTest'
}

const express = require('express');
const {hbs} = require('./handlebars');
const port = process.env.PORT || 3000;
var app = express();
var { mongoose } = require('./db/mongoose');
const session = require('express-session');
const { authenticate } = require('./middleware/authenticate');
app.use(session({ secret: 'eNJKDJDJJASDN*747e]455Snjnssdjsdjnsjjs', cookie: { maxAge: 60099000 } ,resave: false}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/login', (req, res) => {
    res.render('login.hbs');
});
module.exports = { mongoose, app };
const dashboardRoutes = require('./routes/dashboard-routes');
const userRoutes = require('./routes/user-routes');
const pesoRoutes = require('./routes/peso-routes');
const pressaoRoutes = require('./routes/pressao-routes');
const alimentacaoRoutes = require('./routes/alimentacao-routes');
const atividadeRoutes = require('./routes/atividade-fisica-routes');
app.listen(process.env.PORT);

