const logger = require('../util/logger');
const loginService = require('../services/login.service');

const loginController = {

    test: (req, res, next) => {
        logger.trace('LoginController -> test');

        // Roep de service aan 

        loginService.test((error, succes) => {
            // This will run if there is a error
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            } 
            // This wil run if there is a succes
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                });
            }

        });
    }
}

module.exports = loginController;