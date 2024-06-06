const pool = require("../doa/sql-database");
const logger = require("../util/logger");
const sql = require("mssql");
const moment = require("moment");

const projectService = {
	create: async (data, callback) => {
		logger.trace("ProjectService -> create");
		console.log("Received data:", data);

		try {
			// Check if beginTime and endTime are provided and in correct format
			if (!data.beginTime || !data.endTime) {
				throw new Error("beginTime and endTime are required");
			}

			// Extract time values and validate their format
			const beginTime = moment(data.beginTime.scale, "HH:mm:ss", true);
			const endTime = moment(data.endTime.scale, "HH:mm:ss", true);

			if (!beginTime.isValid() || !endTime.isValid()) {
				throw new Error("Invalid time format for beginTime or endTime");
			}

			// Connect to the database pool
			const poolPromise = await pool;
			await poolPromise.connect();

			// Prepare SQL statement
			const prepStatement = new sql.PreparedStatement(poolPromise);
			prepStatement.input("company", sql.NVarChar);
			prepStatement.input("phonenumber", sql.NVarChar);
			prepStatement.input("landlinenumber", sql.NVarChar);
			prepStatement.input("adress", sql.NVarChar);
			prepStatement.input("city", sql.NVarChar);
			prepStatement.input("title", sql.NVarChar);
			prepStatement.input("description", sql.NVarChar);
			prepStatement.input("contactperson", sql.NVarChar);
			prepStatement.input("contactemail", sql.NVarChar);
			prepStatement.input("housenumber", sql.NVarChar);
			prepStatement.input("date", sql.Date);
			prepStatement.input("currentdate", sql.Date);
			prepStatement.input("beginTime", sql.NVarChar);
			prepStatement.input("endTime", sql.NVarChar);
			prepStatement.input("isActive", sql.Bit);
			prepStatement.input("isAccepted", sql.Bit);

			await prepStatement.prepare(`
                INSERT INTO Project 
                (Company, PhoneNumber, LandlineNumber, Address, City, Title, Description, ContactPerson, ContactEmailAddress, HouseNr, Date, RequestDate, StartTime, EndTime, IsActive, IsAccepted) 
                VALUES (@company, @phonenumber, @landlinenumber, @adress, @city, @title, @description, @contactperson, @contactemail, @housenumber, @date, @currentdate, @beginTime, @endTime, @isActive, @isAccepted)
            `);

			// Execute SQL statement
			const result = await prepStatement.execute({
				company: data.company,
				phonenumber: data.phonenumber,
				landlinenumber: data.landlinenumber,
				adress: data.adress,
				city: data.city,
				title: data.title,
				description: data.description,
				contactperson: data.contactperson,
				contactemail: data.contactemail,
				housenumber: data.housenumber,
				date: new Date(data.date),
				currentdate: new Date(),
				beginTime: beginTime.format("HH:mm:ss"),
				endTime: endTime.format("HH:mm:ss"),
				isActive: 0,
				isAccepted: 0,
			});

			await prepStatement.unprepare();

			// Check if project was successfully created
			if (result.rowsAffected[0] === 1) {
				logger.trace("ProjectService -> create: Created a project");
				callback(null, {
					status: 200,
					message: "Project created",
					data: {},
				});
			} else {
				logger.error("ProjectService -> create: No project created");
				callback({
					status: 500,
					message: "No project created",
					data: {},
				});
			}
		} catch (error) {
			// Log and return error
			logger.error("ProjectService -> create: Error creating project", error);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
				error: error.message,
			});
		}
	},

	getAllUndecidedProject: async (callback) => {
		logger.trace('ProjectService -> getAllUndecidedProject');
	
		if (!pool.connected) {
			await pool.connect();
		}
	
		// Get a connection for the prepared statement
		const prepStatement = new sql.PreparedStatement(pool);
	
		// Prepare the SQL statement
		const query = 'SELECT * FROM Project WHERE IsAccepted IS NULL';
	
		prepStatement.prepare(query, (err) => {
			if (err) {
				logger.error(err);
				callback(err, null);
				return;
			}
			logger.trace('no error for preparing statement');
	
			prepStatement.execute({}, (err, result) => {
				logger.trace('starting execute');
				if (err) {
					logger.error(err);
					callback(err, null);
					return;
				}
				logger.debug('getAllUndecidedProject -> execute');
	
				// Check if projects are found
				if (result.recordset.length === 0) {
					logger.info('No projects found');
					callback({
						status: 404,
						message: 'Projects not found',
						data: {}
					}, null);
	
					prepStatement.unprepare((err) => {
						logger.debug('getAllUndecidedProject -> statement unprepared');
						if (err) {
							logger.error(err);
							callback(err, null);
						}
					});
					return;
				}
	
				// Unprepare statement to release connection
				prepStatement.unprepare((err) => {
					logger.debug('getAllUndecidedProject -> statement unprepared');
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else {
						logger.info('getAllUndecidedProject Successful');
						const noPassword = result.recordset[0];
						delete noPassword.Password;
	
						callback(null, {
							status: 200,
							message: `Projects found`,
							data: result.recordset[0]
						});
					}
				});
			});
		});
	},

	getProject: async(projectId, callback) => {
		logger.trace('projectService -> getProject');
            
        if (!pool.connected) {
            await pool.connect();
        }

        // Get a connection fore the prepared statement
        const prepStatement = new sql.PreparedStatement(pool);

        // Prepare valiables
        prepStatement.input('projectId', sql.BigInt);

		// Bereid het statement door
        prepStatement.prepare('SELECT * FROM Project WHERE ProjectId = @projectId', err => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            prepStatement.execute({projectId: projectId}, (err, result) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                    return;
                }
                logger.debug('getProject -> execute');

                // Controlleer of er een project is gevonden
                if (result.recordset.length === 0) {
                    logger.info('No project found');
                    callback({
                        status: 404,
                        message: 'Project not found',
                        data: {}}, null);

                    prepStatement.unprepare(err => {
                        logger.debug('getProject -> statement unprepared');
                        if (err) {
                            logger.error(err);
                            callback(err, null);
                        }
                    });
                    return;
                }

                // Unprepare statment om connectie vrij te geven
                prepStatement.unprepare(err => {
                    logger.debug('getProject -> statement unprepared');
                    if (err) {
                        logger.error(err);
                        callback(err, null);
                        return;
                    } else {
                        logger.info('getProject Succesfull');
                        const noPassword = result.recordset[0];
                        delete noPassword.Password;

                        callback(null, {
                            status: 200,
                            message: `Project found with id ${projectId}`,
                            data: result.recordset[0]
                        });
                    }
                });
            });
        });
	}
}

module.exports = projectService;
