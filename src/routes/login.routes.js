const chai = require("chai");
chai.should();
const express = require("express");
const router = express.Router();
const logger = require("../util/logger");

const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../util/config").secretkey;
const loginController = require("../controllers/login.controller");

function validateLogin(req, res, next) {
	try {
		const body = req.body;
		chai.expect(body, "Missing emailaddress").to.have.property("emailaddress");
		chai.expect(body, "Missing password").to.have.property("password");

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

function validateToken(req, res, next) {
	logger.info("Validating Token");

	const authHeader = req.headers.authorization;
	if (!authHeader) {
		logger.warn("Authorization header missing");
		next({
			status: 401,
			message: "Authorization header missing",
			data: {},
		});
	} else {
		const token = authHeader.substring(7, authHeader.length);

		jwt.verify(token, jwtSecretKey, (err, payload) => {
			if (err) {
				logger.warn("Not authorized");
				next({
					status: 401,
					message: "Not authorized",
					data: {},
				});
			}
			if (payload) {
				logger.info("Token is valid", payload);
				req.userId = payload.userId;
				next();
			}
		});
	}
}

router.get("/api/test", loginController.test);
router.post("/api/login", validateLogin, loginController.login);
router.get("/api/validatetoken", validateToken, loginController.validateToken);
router.put("/api/update", validateToken, loginController.update);

module.exports = { router, validateToken };
