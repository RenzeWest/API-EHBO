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

	getMyShifts: (req, res, next) => {
        logger.trace('shiftController -> getMyShifts');

        shiftService.getMyShifts(req.userId, (error, succes) => {
            if (error) {
                logger.error('shiftController -> getMyShift');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                })
            }
        });
    },

	acceptForShift: (req, res, next) => {
        logger.trace('shiftController -> acceptForShift');
		req.body.userId = req.userId;

        shiftService.acceptForShift(req.body, (error, succes) => {
            if (error) {
                logger.error('shiftController -> acceptForShift');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                })
            }
        });
    },

	getShiftInformationById: (req, res, next) => {
        logger.trace('shiftController -> getShiftInformationById');
		req.body.userId = req.userId;

        shiftService.getShiftInformationById(req.body, (error, succes) => {
            if (error) {
                logger.error('shiftController -> getShiftInformationById');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                })
            }
        });
    }, 

	deleteAssignedShift: (req, res, next) => {
		logger.trace('shiftController -> deleteAssignedShift');
		req.body.userId = req.userId;

        shiftService.deleteAssignedShift(req.body, (error, succes) => {
            if (error) {
                logger.error('shiftController -> deleteAssignedShift');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                })
            }
        });
	}
};

module.exports = shiftController;