var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrack';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/healthTrackTest'
}

const express = require('express');
const { hbs } = require('./handlebars');
const port = process.env.PORT || 3000;
var app = express();
var { mongoose } = require('./db/mongoose');
const session = require('express-session');
const { authenticate } = require('./middleware/authenticate');
app.use(session({ secret: 'eNJKDJDJJASDN*747e]455Snjnssdjsdjnsjjs', cookie: { maxAge: 60099000 }, resave: false }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/login', (req, res) => {
    res.render('login.hbs');
});
module.exports = { mongoose, app };
require('./routes/dashboard-routes');
require('./routes/user-routes');
require('./routes/password-routes');
require('./routes/peso-routes');
require('./routes/pressao-routes');
require('./routes/alimentacao-routes');
require('./routes/atividade-fisica-routes');
app.listen(process.env.PORT);

