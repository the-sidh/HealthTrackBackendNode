var { User } = require('../models/user');

var authenticate = (req, res, next) => {

    user = req.session.user;
    if (!user) {
        res.redirect('/login');
    }
     next();

}
module.exports = { authenticate };