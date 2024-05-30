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
    },
    login: (req, res, next) => {
        loginService.loginPrepared({emailadres: req.body.emailadres, wachtwoord: req.body.wachtwoord}, (error, succes) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (succes) {
                res.status(200).json( {
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
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
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status:200,
                    message: succes.message,
                    data: succes.data
                })
            }
        })
    },
    validateToken: (req, res, next) => {
        // Als het hierkomt is de token al valid
        res.status(200).json({
            status: 200,
            message: 'User authorised',
            data: {}
        });
    }
}

module.exports = loginController;