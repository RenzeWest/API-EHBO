const chai = require('chai');
chai.should();
const express = require('express');
const router = express.Router();
const logger = require('../util/logger');

// Contoller
const memberContoller = require('../controllers/member.controller');
const validateToken = require('../routes/login.routes').validateToken;

// Middleware

// Routes
router.get('/api/member', validateToken, memberContoller.getMember);

module.exports = router;