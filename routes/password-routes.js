var app = require('../healthTrack').app;
const { User } = require('../models/user');
const _ = require('lodash');
const bodyParser = require('body-parser');
const { logger } = require('../log/logger');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
var rootUrl = process.env.ROOT_URL || 'http://localhost:3000/';
const waterfall = require('async-waterfall');

const hbs = require('nodemailer-express-handlebars');

var email = process.env.MAILER_EMAIL_ID || 'healthtracksid@gmail.com';
var pass = process.env.MAILER_PASSWORD || 'fiap2018';
const nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: email,
        pass: pass
    }
});

var handlebarsOptions = {
    viewEngine: 'handlebars',
    viewPath: __dirname + '/../views/',
    extName: '.hbs'
};

smtpTransport.use('compile', hbs(handlebarsOptions));


app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/requestPasswordReset/', (req, res) => {
    res.render('remember_senha.hbs');
});

app.post('/requestPasswordReset/', (req, res) => {
    requestPasswordReset(req, res);
});

const requestPasswordReset = (req, res) => {
    waterfall([
        function (done) {
            User.findOne({
                email: req.body.email
            }).exec(function (err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('User not found.');
                }
            });
        },
        function (user, done) {
            // create the random token
            crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function (user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function (err, new_user) {
                done(err, token, new_user);
            });
        },
        function (token, user, done) {
            var data = {
                to: user.email,
                from: 'healthtrack@hralthtrack.com',
                template: 'forgot-password-email',
                subject: 'Redefinição da senha',
                context: {
                    url: `${rootUrl}reset_password?token=` + token,
                    name: user.nome.split(' ')[0],
                    pronome: user.genero === 'Masculino' ? 'Caro' : 'Cara'
                }
            };

            smtpTransport.sendMail(data, function (err) {
                if (!err) {
                    res.render('email_enviado.hbs');
                } else {
                    return done(err);
                }
            });
        }
    ], function (err) {
        return res.status(422).json({ message: err });
    });
};

app.post('/reset_password/', (req, res, next) => {
    reset_password(req, res, next);
});

app.get('/reset_password/', (req, res, next) => {
    const reset_password_token = req.query.token;
    res.render('edit_senha.hbs', { reset_password_token });

});


const reset_password = (req, res, next) => {
    User.findOne({
        reset_password_token: req.body.token,

    }).exec(function (err, user) {
        if (!err && user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
                user.reset_password_token = undefined;
                user.reset_password_expires = undefined;
                user.save(function (err) {
                    if (err) {
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                return res.status(422).send({
                    message: 'Passwords do not match'
                });
            }
        } else {
            return res.status(400).send({
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
};


