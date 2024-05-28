const chai = require('chai');
chai.should();
const express = require('express');
const router = express.Router();
const logger = require('../util/logger');

// For validation
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../util/config').secretkey;


// Controller
// const userController = require('../controllers/user.controller') <-- Voorbeeld
const loginController = require('../controllers/login.controller');






// Middle ware validadtion

function middlewareVoorbeeld() {
    logger.info('MiddlewareRan');
}

// Routes
router.get('/api/test', loginController.test);
router.get('/api/login', loginController.login);

module.exports = router;


