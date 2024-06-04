const logger = require('../util/logger');
const firstResponderService = require('../services/firstResponder.service')

const firstResponderController = {

    openshifts:(req, res, next) => {
        logger.trace('firstResponderController -> openshifts')
        firstResponderService.openshifts((error, success) => {
            if(error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            } if(success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    create: (req, res, next) => {
        const user = req.body
        logger.info('create user', user.firstName, user.lastName)
        userService.create(user, (error, success) => {
            if (error) {
                return next({ 
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    }

}

module.exports = firstResponderController;