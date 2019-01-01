
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
var rootUrl = process.env.ROOT_URL || 'http://localhost:3000/';

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        minlength: 1,
        unique: true,
        required: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            }, message: '{VALUE} is not valid'

        }
    },
    dataNasc: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    nome: {
        type: String,
        required: true,
        minlength: 2
    },

    genero: {
        type: String,
        required: true,
        minlength: 6
    },
    altura: {
        type: Number,
        required: true,
        minlength: 6
    },
    reset_password_token: {
        type: String
    },


});

userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

userSchema.methods.toJSON = function () {
    return { email: this.email, _id: this._id };
};

userSchema.methods.generateAuthToken = async function () {

    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: this._id.toHexString(),
        access
    }, 'mysecret').toString();
    user.tokens = user.tokens.concat({ access, token });

    await user.save();

    return token;
}

userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'mysecret');
    } catch (err) {
        return new Promise((resolve, reject) => { reject(); });
    }

    var userfound = User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

    return userfound;
}

userSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({ email }).then((userfound) => {
        if (!userfound) {
            Promise.reject();
        } else {
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, userfound.password, (err, res) => {
                    if (res) {
                        resolve(userfound);
                    } else {
                        reject();
                    }
                });
            });
        }
    });
};

userSchema.statics.findByEmail = function (email) {
    var User = this;
    return User.findOne({ email }).then((userfound) => {
        return userfound;
    });
};



var User = mongoose.model('User', userSchema);

module.exports = { User };
