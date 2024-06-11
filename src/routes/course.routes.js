const chai = require('chai');
chai.should();
const express = require('express');
const router = express.Router();
const logger = require('../util/logger');
const login = require('../routes/login.routes')

const courseController = require('../controllers/course.controller');

// Routes
router.get('/api/getCourses', login.validateToken, courseController.getCourses);

module.exports = router;
