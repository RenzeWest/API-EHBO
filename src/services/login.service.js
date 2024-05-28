const pool = require('../doa/sql-database');
const logger = require('../util/logger');

const loginService = {
    test: async (callback) => {
        logger.trace('LoginService -> test');
        try {
            const result = await pool.request().query('SELECT * FROM Certificaat');

            if (result.recordset) {
                logger.trace('LoginService -> test: Got a result');
                callback(null, {
                    status: 200,
                    message: 'This is a message',
                    data: result.recordset
                });

            }

        } catch (error) {
            logger.error(error);
            callback(error, null);

        }
    },

    login: async (callback) => {
        logger.trace('LoginService -> ');
        try {
            // const result = await pool.request().query('SELECT GebruikersID FROM ')
            callback(null, {status:200, message: 'Login Succesfull', data: {token: 'token'}});
        } catch (error) {
            callback(error, null)
        }
    }
}

module.exports = loginService;

/*
if (err) {
            logger.error(err);
            callback(err, null);
        } else {
            logger.trace('LoginService -> test')
            callback(null, {
                status: 200,
                message: 'This is a message',
                data: {
                    message: 'Data is leeg'
                }
            });

        }
*/