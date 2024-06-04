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
        request.query("SELECT P.Title, P.Date, P.StartTime, P.EndTime, P.Description, P.Address, P.HouseNr, P.City, P.IsAccepted, P.IsActive,  P.ProjectId, P.PeopleNeeded, COUNT(S.UserId) AS PeopleAssigned FROM Project P LEFT JOIN Shift S ON P.ProjectId = S.ProjectId AND S.IsAssigned = 'true' WHERE P.IsActive = 'true' AND P.PeopleNeeded > 0 GROUP BY P.Title, P.Date, P.StartTime, P.EndTime, P.Description, P.Address, P.HouseNr, P.City, P.IsAccepted, P.IsActive, P.ProjectId, P.PeopleNeeded;",
         (error, result) => {
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