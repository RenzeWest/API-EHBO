const chai = require("chai");
chai.should();
const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const shiftController = require("../controllers/shift.controller");
const validateToken = require("../routes/login.routes").validateToken;
const moment = require("moment");

function createShift(req, res, next) {
	try {
		const body = req.body;

		// Log incoming request body
		logger.debug("Incoming request body:", body);

		chai.expect(body, "Missing projectID").to.have.property("projectId");
		chai.expect(body, "Missing startTime").to.have.property("startTime");
		chai.expect(body, "Missing endTime").to.have.property("endTime");
		chai.expect(body, "missing startDate").to.have.property("startDate");
		chai.expect(body, "missing endDate").to.have.property("endDate");

		// Validate and format times using moment
		const startTime = moment(body.startTime, "HH:mm:ss", true);
		const endTime = moment(body.endTime, "HH:mm:ss", true);

		if (!startTime.isValid() || !endTime.isValid()) {
			logger.debug("Invalid time format detected", {
				startTime: body.startTime,
				endTime: body.endTime,
			});
			throw new Error("Invalid time format");
		}

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

router.get("/api/getshifts", validateToken, shiftController.getShifts);
router.post("/api/createshift", validateToken, createShift, shiftController.createShifts);

module.exports = router;
