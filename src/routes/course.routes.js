const chai = require('chai');
chai.should();
const express = require('express');
const router = express.Router();
const logger = require('../util/logger');
const login = require('../routes/login.routes')

const courseController = require('../controllers/course.controller');

function addCourseValidation(req, res, next) {
    try {
		const body = req.body;
		chai.expect(body, "Missing title").to.have.property("title");
		chai.expect(body, "Missing description").to.have.property("description");
		chai.expect(body, "Missing datetime").to.have.property("datetime");
		chai.expect(body, "Missing cost").to.have.property("cost");
		chai.expect(body, "Missing maxParticipants").to.have.property("maxParticipants");
		chai.expect(body, "Missing location").to.have.property("location");
		chai.expect(body, "Missing certificatieTitle").to.have.property("certificatieTitle");

		next();
	} catch (ex) {
		const splitedMessage = ex.message.split(":");
		next({
			status: 400,
			message: splitedMessage[0],
			data: {},
		});
	}
}

function enrollValidation(req, res, next) {
	try {
		const body = req.body;
		chai.expect(body, "Missing courseId").to.have.property("courseId");
		
		next();
	} catch (error) {
		const splitedMessage = error.message.split(":");
		logger.warn(splitedMessage[0]);
		next({
			status: 400,
			message: splitedMessage[0],
			data: {},
		});
	}
}

// Routes
router.get('/api/getCourses', login.validateToken, courseController.getCourses);
router.post('/api/enrollCourse', login.validateToken, enrollValidation ,courseController.enrollInCourse);
router.get('/api/getCertificates', courseController.getCertificates)
router.post('/api/addCourse', login.validateToken, addCourseValidation, courseController.addCourse);

module.exports = router;
