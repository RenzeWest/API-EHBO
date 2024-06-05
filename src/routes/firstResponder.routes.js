const chai = require('chai');
chai.should();
const express = require('express');
const router = express.Router();
const logger = require('../util/logger');
const login = require('../routes/login.routes')


const firstResponderController = require('../controllers/firstResponder.controller');



// Routes
router.get('/api/openshifts', login.validateToken, firstResponderController.openshifts);


module.exports = router;



