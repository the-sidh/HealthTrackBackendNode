
var express = require('express');
var router = express.Router();

const  userRoutes  = require('./user-routes');
router.use('/user',userRoutes);

const pesoRoutes = require('./peso-routes');
router.use('/peso',pesoRoutes);
router.use('/addPeso',pesoRoutes);
router.use('/save_peso',pesoRoutes);


module.exports = function (router) {
    router;
};