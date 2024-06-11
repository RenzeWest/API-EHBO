const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const projectController = require("../controllers/project.controller");
const chai = require("chai");
chai.should();
const moment = require("moment");
const { Time } = require("mssql");

function createProject(req, res, next) {
	try {
		const body = req.body;

		// Log incoming request body
		logger.debug("Incoming request body:", body);

		chai.expect(body, "Missing company").to.have.property("company");
		chai.expect(body, "Missing description").to.have.property("description");
		chai.expect(body, "Missing city").to.have.property("city");
		chai.expect(body, "Missing adress").to.have.property("adress");
		chai.expect(body, "Missing contactperson").to.have.property("contactperson");
		chai.expect(body, "Missing contactemail").to.have.property("contactemail");
		chai.expect(body, "Missing phonenumber").to.have.property("phonenumber");
		chai.expect(body, "Missing landlinenumber").to.have.property("landlinenumber");
		chai.expect(body, "Missing housenumber").to.have.property("housenumber");
		chai.expect(body, "Missing date").to.have.property("date");
		chai.expect(body, "Missing title").to.have.property("title");
		chai.expect(body, "Missing currentdate").to.have.property("currentdate");
		chai.expect(body, "Missing beginTime").to.have.property("beginTime");
		chai.expect(body, "Missing endTime").to.have.property("endTime");
		chai.expect(body, "Missing endDate").to.have.property("endDate");

		// Validate and convert date
		const date = new Date(body.date);
		if (isNaN(date.getTime())) {
			throw new Error("Invalid date format");
		}
		body.date = date.toISOString().split("T")[0];

		const currentDate = new Date(body.currentdate);
		if (isNaN(currentDate.getTime())) {
			throw new Error("Invalid current date format");
		}
		body.currentdate = currentDate.toISOString().split("T")[0];
		if (currentDate > date) {
			throw new Error("Current date cannot be before project date");
		}

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

		body.beginTime = Time(beginTime.format("HH:mm:ss"));
		body.endTime = Time(endTime.format("HH:mm:ss"));

		logger.debug("Processed request body with valid times:", body);

		next();
	} catch (ex) {
		if (ex.message.includes("Missing")) {
			const splitedMessage = ex.message.split(":");
			next({
				status: 400,
				message: splitedMessage[0],
				data: {},
			});
		} else {
			logger.error("Unexpected error during project creation validation", ex);
			next({
				status: 500,
				message: "Internal server error",
				data: {},
			});
		}
	}
}

router.post("/api/create", createProject, projectController.create);
router.get("/api/testproject", projectController.test);
router.put("/api/setprojectactive", projectController.setProjectActive);
router.get("/api/getAllUndecidedProjects", projectController.getAllUndecidedProject);
router.get("/api/getAcceptedProjects", projectController.getAcceptedProjects);
router.get("/api/getProject", projectController.getProject);
router.get("/api/getActiveProjects", projectController.getActiveProjects);
router.put("/api/acceptproject", projectController.acceptProject);
router.put("/api/rejectproject", projectController.rejectProject);

module.exports = router;
