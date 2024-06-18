const pool = require("../doa/sql-database");
const logger = require("../util/logger");
const sql = require("mssql");

const memberService = {
	getMember: async (userId, callback) => {
		logger.trace("MemberService -> getMember");

		if (!pool.connected) {
			await pool.connect();
		}

		const prepStatement = new sql.PreparedStatement(pool);
		prepStatement.input("userId", sql.BigInt);

		prepStatement.prepare("SELECT * FROM Member WHERE UserId = @userId", (err) => {
			if (err) {
				logger.error(err);
				callback(err, null);
				return;
			}

			prepStatement.execute({ userId: userId }, (err, result) => {
				if (err) {
					logger.error(err);
					callback(err, null);
					return;
				}
				logger.debug("getMember -> execute");

				if (result.recordset.length === 0) {
					logger.info("No user found");
					callback(
						{
							status: 404,
							message: "User not found",
							data: {},
						},
						null
					);

					prepStatement.unprepare((err) => {
						logger.debug("getMember -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
						}
					});
					return;
				}

                prepStatement.unprepare(err => {
                    logger.debug('getMember -> statement unprepared');
                    if (err) {
                        logger.error(err);
                        callback(err, null);
                        return;
                    } else {

                        const baseData = result.recordset[0];
                        delete baseData.Password;
                        prepStatement.prepare('SELECT * FROM ObtainedCertificates WHERE UserId = @userId', err => {
                            if(err) {
                                logger.error(err);
                                callback(err, null);
                                return;
                            }

                            prepStatement.execute({userId: userId}, (err, res) => {
                                if (err) {
                                    logger.error(err);
                                    callback(err, null);
                                    return;
                                }

                                let certifications = '';
                                if (res.recordset[0] === undefined) {
                                    certifications = 'Gebruiker heeft geen certificaten';
                                } else {
                                    for (let i = 0; i < res.recordset.length; i++) {
                                        certifications += res.recordset[i].CertificateTitle;
                                        if (i !== res.recordset.length - 1) {
                                            certifications += ', ';
                                        }
                                    }
                                }

                                prepStatement.unprepare(err => {
                                    if(err) {
                                        logger.error(err);
                                        callback(err, null);
                                        return;
                                    }

                                    baseData.certification = certifications;

                                    logger.info('getMember Succesfull');
                                    callback(null, {
                                        status: 200,
                                        message: `User found with id ${userId}`,
                                        data: baseData
                                    });

                                });

                            });

                        });


                    }
                });
            });
        });
    }
}

module.exports = memberService;
