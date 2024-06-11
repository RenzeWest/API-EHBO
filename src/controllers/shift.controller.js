const logger = require("../util/logger");
const shiftService = require("../services/shift.service");
function shiftController() { 
    getShifts: (req, res, next) => {
            logger.trace("shiftController -> getShifts");
            shiftService.getShifts((error, success) => {
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
}