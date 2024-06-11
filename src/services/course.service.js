const pool = require('../doa/sql-database');
const logger = require('../util/logger');
const sql = require('mssql');

const courseService = {
    getCourses: async (callback) => {
        logger.trace('courseService -> getCourses');

        if (!pool.connected) {
            await pool.connect();
        }

        const request = new sql.Request(pool);
        request.query("SELECT * FROM Course",
         (error, result) => {
            if (error) {
                logger.error(error);
                callback(error, null);
            } else {
                callback(null, {
                    status: 200,
                    message: 'Courses found',
                    data: result.recordset
                });
            }
        })
    }
}

module.exports = courseService;