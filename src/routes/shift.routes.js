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

		chai.expect(body, "Missing projectID").to.have.property("projectID");
		chai.expect(body, "Missing userID").to.have.property("userID");
		chai.expect(body, "Missing beginTime").to.have.property("beginTime");
		chai.expect(body, "Missing endTime").to.have.property("endTime");

		// Validate and format times using moment
		const beginTime = moment(body.beginTime, "HH:mm:ss", true);
		const endTime = moment(body.endTime, "HH:mm:ss", true);

		if (!beginTime.isValid() || !endTime.isValid()) {
			logger.debug("Invalid time format detected", {
				beginTime: body.beginTime,
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

router.get("/shifts", validateToken, shiftController.getShifts);
router.post("/shift", validateToken, createShift, shiftController.createShift);

module.exports = router;
