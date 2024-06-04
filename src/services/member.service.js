const pool = require('../doa/sql-database');
const logger = require('../util/logger');
const sql = require('mssql');

const memberService = {
    getMember: async (userId, callback) => {
        logger.trace('MemberService -> getMember');
            
        if (!pool.connected) {
            await pool.connect();
        }

        // Get a connection fore the prepared statement
        const prepStatement = new sql.PreparedStatement(pool);

        // Prepare valiables
        prepStatement.input('userId', sql.BigInt);

        // Bereid het statement door
        prepStatement.prepare('SELECT * FROM Member WHERE UserId = @userId', err => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            prepStatement.execute({userId: userId}, (err, result) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                    return;
                }
                logger.debug('getMember -> execute');

                // Controlleer of er een gebruiker is gevonden
                if (result.recordset.length === 0) {
                    logger.info('No user found');
                    callback({
                        status: 404,
                        message: 'User not found',
                        data: {}}, null);

                    prepStatement.unprepare(err => {
                        logger.debug('getMember -> statement unprepared');
                        if (err) {
                            logger.error(err);
                            callback(err, null);
                        }
                    });
                    return;
                }

                // Unprepare statment om connectie vrij te geven
                prepStatement.unprepare(err => {
                    logger.debug('getMember -> statement unprepared');
                    if (err) {
                        logger.error(err);
                        callback(err, null);
                        return;
                    } else {
                        logger.info('getMember Succesfull');
                        callback(null, {
                            status: 200,
                            message: `User found with id ${userId}`,
                            data: result.recordset[0]
                        });
                    }
                });
            });
        });
    }
}

module.exports =  memberService;