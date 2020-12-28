const express = require('express');

const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

//Routers
router.get('/', list);

function list(req, res, next){
    Controller.list()
        .then(data => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}

module.exports = router;