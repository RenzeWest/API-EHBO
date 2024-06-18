const logger = require("../util/logger");
const loginService = require("../services/login.service");

const loginController = {
	login: (req, res, next) => {
		loginService.login({ emailaddress: req.body.emailaddress, password: req.body.password }, (error, succes) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}

			if (succes) {
				res.status(200).json({
					status: succes.status,
					message: succes.message,
					data: succes.data,
				});
			}
		});
	},

	update: (req, res, next) => {
		loginService.update(req.userId, req.body, (error, succes) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (succes) {
				res.status(200).json({
					status: 200,
					message: succes.message,
					data: succes.data,
				});
			}
		});
	},
	validateToken: (req, res, next) => {
		res.status(200).json({
			status: 200,
			message: "User authorised",
			data: {},
		});
	},
};

module.exports = loginController;
