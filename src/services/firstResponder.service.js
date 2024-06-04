const pool = require('../doa/sql-database');
const logger = require('../util/logger');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../util/config').secretkey;






const firstResponderService = {
    openshifts: async (callback) => {
        logger.trace('firstResponderService -> openShifts');

        if (!pool.connected) {
            await pool.connect();
        }

        const request = new sql.Request(pool);
        request.query("SELECT * FROM Project WHERE IsActive = 'true'", (error, result) => {
            if (error) {
                logger.error(error);
                callback(error, null);
            } else {
                callback(null, {
                    status: 200,
                    message: 'Shifts found',
                    data: result.recordset
                });
            }
        })
    }
}

module.exports = firstResponderService;