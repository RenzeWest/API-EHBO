const chai = require('chai');
chai.should();
const express = require('express');
const router = express.Router();
const logger = require('../util/logger');

// For token validation
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../util/config').secretkey;


// Controller
// const userController = require('../controllers/user.controller') <-- Voorbeeld
const loginController = require('../controllers/login.controller');






// Middle ware validadtion
function validateLogin(req, res, next) {
    // Verify that we receive the expected input
    try {
        const body = req.body;
        chai.expect(body).to.have.property('emailadres');
        chai.expect(body).to.have.property('wachtwoord');
        next()
    } catch (ex) {
        next({
            status: 400,
            message: ex.toString(),
            data: {}
        })
    }
}

function validateToken(req, res, next) {
    logger.info('Validating Token');
    logger.trace(`Header ${req.headers}`);

    const authHeader = req.headers.authorization;

    // No token was given
    if(!authHeader) {

        logger.warn('Authorization header missing');
        next({
            status: 401,
            message: 'Authorization header missing',
            data: {}
        });

    } else {

        // Haalt de token uit de header (die start op positie 8)
        const token = authHeader.substring(7, authHeader.length);

        jwt.verify(token, jwtSecretKey, (err, payload) => {
            if (err) {
                logger.warn('Not authorized');
                next({
                    status: 401,
                    message: 'Not authorized',
                    data: {}
                });
            }
            if (payload) {
                logger.info('Token is valid', payload);
                req.userId = payload.userId; // Get the userID from the payload of the token
                next();
            }
        }); 

    }
}

function middlewareVoorbeeld() {
    logger.info('MiddlewareRan');
}

// Routes
router.get('/api/test', loginController.test);
router.post('/api/login',validateLogin, loginController.login);
router.get('/api/validatetoken', validateToken, loginController.validateToken);
router.put('/api/update', loginController.update)

module.exports = router;


