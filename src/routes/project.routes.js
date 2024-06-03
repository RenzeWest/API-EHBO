const express = require("express");
const router = express.Router();
const logger = require("../util/logger");

const projectController = require("../controllers/project.controller");

const chai = require("chai");
chai.should();

function createProject(req, res, next) {
	try {
		const body = req.body;
		chai.expect(body, "Missing company").to.have.property("company");
		chai.expect(body, "Missing description").to.have.property("description");
		chai.expect(body, "Missing city").to.have.property("city");
		chai.expect(body, "Missing address").to.have.property("address");
		chai.expect(body, "Missing contactperson").to.have.property("contactperson");
		chai.expect(body, "Missing contactemail").to.have.property("contactemail");
		chai.expect(body, "Missing phonenumber").to.have.property("phonenumber");
		chai.expect(body, "Missing landlinenumber").to.have.property("landlinenumber");
		chai.expect(body, "Missing housenumber").to.have.property("housenumber");
		chai.expect(body, "Missing date").to.have.property("date");
		chai.expect(body, "Missing Title").to.have.property("Title");
		chai.expect(body, "Missing Currentday").to.have.property("Currentday");
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

function middlewareVoorbeeld(req, res, next) {
	logger.info("Middleware voorbeeld");
	next();
}

router.post("/api/create", createProject, projectController.create);
router.get("/api/test", middlewareVoorbeeld, projectController.test);
router.put("/api/update/:id", projectController.update);

module.exports = router;
