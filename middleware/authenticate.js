var { User } = require('../models/user');
const { logger } = require('../log/logger');
var authenticate = (req, res, next) => {

    let user = req.session.user;
    if (!user) {
        logger.info(`user nao existente na secao, req: ${req.originalUrl}`);
        res.redirect('/login');
    }
    next();

}
module.exports = { authenticate };