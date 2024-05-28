const pool = require('../doa/sql-database');
const logger = require('../util/logger');

const loginService = {
    test: async (callback) => {
        try {
            const result = await pool.request().query('SELECT * FROM Certificaat');
            console.log(result.recordset);

        } catch (error) {
            logger.error(error)
        }

        logger.trace('LoginService -> test')
            callback(null, {
                status: 200,
                message: 'This is a message',
                data: {
                    message: 'Data is leeg'
                }
            });
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