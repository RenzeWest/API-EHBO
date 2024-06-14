const chai = require("chai");
chai.should();
const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const shiftController = require("../controllers/shift.controller");
const validateToken = require("../routes/login.routes").validateToken;

function createShift(req, res, next) {
	try {
		const body = req.body;

		// Log incoming request body
		logger.debug("Incoming request body:", body);

		chai.expect(body, "Missing projectID").to.have.property("projectId");
		chai.expect(body, "Missing startTime").to.have.property("beginTime");
		chai.expect(body, "Missing endTime").to.have.property("endTime");
		chai.expect(body, "missing startDate").to.have.property("beginDate");
		chai.expect(body, "missing endDate").to.have.property("endDate");
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
function assignShift(req, res, next) {
	try {
		const body = req.body;

		// Log incoming request body
		logger.debug("Incoming request body:", body);

		chai.expect(body, "Missing projectID").to.have.property("projectId");
		chai.expect(body, "Missing shiftID").to.have.property("shiftId");
		chai.expect(body, "Missing userID").to.have.property("userId");

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

function acceptForShift(req, res, next) {
	try {
		const body = req.body;

		// Log incoming request body
		logger.debug("Incoming request body:", body);

		chai.expect(body, "Missing projectID").to.have.property("projectId");
		chai.expect(body, "Missing shiftID").to.have.property("shiftId");
		
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

function shiftIdValidation(req, res, next) {
	try {
		const body = req.body;

		// Log incoming request body
		logger.debug("Incoming request body:", body);

		chai.expect(body, "Missing shiftID").to.have.property("shiftId");
		
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

router.get("/api/getshifts", shiftController.getShifts);
router.get("/api/getMyShifts", validateToken, shiftController.getMyShifts);
router.get("/api/assignToShift", validateToken, shiftController.assignShift);
router.post("/api/createshift", createShift, shiftController.createShifts);
router.put("/api/acceptForShift", validateToken, acceptForShift, shiftController.acceptForShift);
router.get("/api/getShiftById", validateToken, shiftIdValidation, shiftController.getShiftInformationById);
router.delete("/api/deleteAssignedShift", validateToken, shiftIdValidation, shiftController.deleteAssignedShift);

module.exports = router;
