const logger = require("../util/logger");
const shiftService = require("../services/shift.service");
const shiftController = {
	getShifts: (req, res, next) => {
		logger.trace("shiftController -> getShifts");
		logger.trace("shiftController -> getShifts");

		const projectId = req.query.projectId;
		if (!projectId) {
			return res.status(400).json({ message: "Project ID is required" });
		}

		shiftService.getShifts(projectId, (error, success) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (success) {
				res.status(200).json({
					status: success.status,
					message: success.message,
					data: success.data,
				});
			}
		});
	},

	createShifts: (req, res, next) => {
		logger.trace("shiftController -> createShifts");
		shiftService.createShifts(req.body, (error, success) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (success) {
				res.status(200).json({
					status: success.status,
					message: success.message,
					data: success.data,
				});
			}
		});
	},
	assignShift: (req, res, next) => {
		logger.trace("shiftController -> assignShift");
		shiftService.assignShift(req.body, (error, success) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (success) {
				res.status(200).json({
					status: success.status,
					message: success.message,
					data: success.data,
				});
			}
		});
	},
};

module.exports = shiftController;
