const pool = require("../doa/sql-database");
const logger = require("../util/logger");
const sql = require("mssql");
const moment = require("moment");


const projectService = {
	create: async (data, callback) => {
		logger.trace("ProjectService -> create");


		try {
			if (!data.beginTime || !data.endTime) {
				throw new Error("beginTime and endTime are required");
			}

			const beginTime = moment(data.beginTime.scale, "HH:mm:ss", true);
			const endTime = moment(data.endTime.scale, "HH:mm:ss", true);

			if (!beginTime.isValid() || !endTime.isValid()) {
				throw new Error("Invalid time format for beginTime or endTime");
			}
			const poolPromise = await pool;
			await poolPromise.connect();

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
			prepStatement.input("endDate", sql.Date);

			await prepStatement.prepare(`
                INSERT INTO Project 
                (Company, PhoneNumber, LandlineNumber, Address, City, Title, Description, ContactPerson, ContactEmailAddress, HouseNr, Date, RequestDate, StartTime, EndTime, IsActive, EndDate) 
                VALUES (@company, @phonenumber, @landlinenumber, @adress, @city, @title, @description, @contactperson, @contactemail, @housenumber, @date, @currentdate, @beginTime, @endTime, @isActive, @endDate)
            `);

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
				endDate: new Date(data.endDate),
			});

			await prepStatement.unprepare();

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
		logger.trace("ProjectService -> getAllUndecidedProject");

		if (!pool.connected) {
			await pool.connect();
		}
		const request = new sql.Request(pool);
		request.query("SELECT * FROM Project WHERE IsAccepted IS NULL", (error, result) => {
			if (error) {
				logger.error(error);
				callback(error, null);
			} else {
				callback(null, {
					status: 200,
					message: "Projects found",
					data: result.recordset,
				});
			}
		});
		
	},
	setProjectActive: async (data, callback) => {
		logger.trace("ProjectService -> setProjectActive");
		try {
			const poolPromise = await pool;
			await poolPromise.connect();

			const prepStatement = new sql.PreparedStatement(poolPromise);
			prepStatement.input("projectId", sql.BigInt);
			await prepStatement.prepare(`
				UPDATE Project SET IsActive = 1 WHERE ProjectId = @projectId
			`);
			const result = await prepStatement.execute({ projectId: data.projectId });
			await prepStatement.unprepare();
			if (result.rowsAffected[0] === 1) {
				logger.trace("ProjectService -> Project: Project activated");
				callback(null, {
					status: 200,
					message: "Project activated",
				});
			} else {
				logger.error("ProjectService -> rejectProject: Project not activated");
				callback({
					status: 404,
					message: "Project not rejected",
				});
			}
		} catch (error) {
			logger.error("ProjectService -> rejectProject: Error activating project", error);
			callback({
				status: 500,
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},


	getProject: async (projectId, callback) => {
		logger.trace("projectService -> getProject");

		if (!pool.connected) {
			await pool.connect();
		}

		const prepStatement = new sql.PreparedStatement(pool);
		prepStatement.input("projectId", sql.BigInt);
		prepStatement.prepare("SELECT * FROM Project WHERE ProjectId = @projectId", (err) => {
			if (err) {
				logger.error(err);
				callback(err, null);
				return;
			}

			prepStatement.execute({ projectId: projectId }, (err, result) => {
				if (err) {
					logger.error(err);
					callback(err, null);
					return;
				}
				logger.debug("getProject -> execute");

				if (result.recordset.length === 0) {
					logger.info("No project found");
					callback(
						{
							status: 404,
							message: "Project not found",
							data: {},
						},
						null
					);

					prepStatement.unprepare((err) => {
						logger.debug("getProject -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
						}
					});
					return;
				}

				prepStatement.unprepare((err) => {
					logger.debug("getProject -> statement unprepared");
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else {
						logger.info("getProject Successful");
						const noPassword = result.recordset[0];
						delete noPassword.Password;

						callback(null, {
							status: 200,
							message: `Project found with id ${projectId}`,
							data: result.recordset[0],
						});
					}
				});
			});
		});
	},
	getAcceptedProjects: async (callback) => {
		logger.trace("ProjectService -> getAcceptedProjects");

		if (!pool.connected) {
			await pool.connect();
		}

		const prepStatement = new sql.PreparedStatement(pool);
		const query = "SELECT * FROM Project WHERE IsAccepted = 1 ";

		prepStatement.prepare(query, (err) => {
			if (err) {
				logger.error(err);
				callback(err, null);
				return;
			}

			prepStatement.execute({}, (err, result) => {
				if (err) {
					logger.error(err);
					callback(err, null);
					return;
				}
				logger.debug("getAcceptedProjects -> execute");

				if (result.recordset.length === 0) {
					logger.info("No projects found");
					callback(
						{
							status: 404,
							message: "Projects not found",
							data: {},
						},
						null
					);

					prepStatement.unprepare((err) => {
						logger.debug("getAcceptedProjects -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
						}
					});
					return;
				}

				prepStatement.unprepare((err) => {
					logger.debug("getActiveProjects -> statement unprepared");
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else {
						logger.info("getAcceptedProjects Successful");
						const noPassword = result.recordset[0];
						delete noPassword.Password;

						callback(null, {
							status: 200,
							message: `Projects found`,
							data: result.recordset,
						});
					}
				});
			});
		});
	},

	getActiveProjects: async (callback) => {
		logger.trace("ProjectService -> getActiveProjects");

		if (!pool.connected) {
			await pool.connect();
		}

		const prepStatement = new sql.PreparedStatement(pool);
		const query = "SELECT * FROM Project WHERE IsActive = 1 AND Date > GETDATE()";

		prepStatement.prepare(query, (err) => {
			if (err) {
				logger.error(err);
				callback(err, null);
				return;
			}

			prepStatement.execute({}, (err, result) => {
				logger.trace("starting execute");
				if (err) {
					logger.error(err);
					callback(err, null);
					return;
				}
				logger.debug("getActiveProjects -> execute");

				if (result.recordset.length === 0) {
					logger.info("No projects found");
					callback(
						{
							status: 404,
							message: "Projects not found",
							data: {},
						},
						null
					);

					prepStatement.unprepare((err) => {
						logger.debug("getActiveProjects -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
						}
					});
					return;
				}

				prepStatement.unprepare((err) => {
					logger.debug("getActiveProjects -> statement unprepared");
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else {
						logger.info("getActiveProjects Successful");
						const noPassword = result.recordset[0];
						delete noPassword.Password;

						callback(null, {
							status: 200,
							message: `Projects found`,
							data: result.recordset,
						});
					}
				});
			});
		});
	},
	acceptProject: async (data, callback) => {
		logger.trace("ProjectService -> acceptProject");

		try {
			const poolPromise = await pool;
			await poolPromise.connect();

			const prepStatement = new sql.PreparedStatement(poolPromise);
			prepStatement.input("projectId", sql.BigInt);
			await prepStatement.prepare(`
				UPDATE Project SET IsAccepted = 1 WHERE ProjectId = @projectId
			`);
			const result = await prepStatement.execute({ projectId: data.projectId });
			await prepStatement.unprepare();
			if (result.rowsAffected[0] === 1) {
				logger.trace("ProjectService -> acceptProject: Project accepted");
				callback(null, {
					status: 200,
					message: "Project accepted",
				});
			} else {
				logger.error("ProjectService -> acceptProject: Project not accepted");
				callback({
					status: 404,
					message: "Project not accepted",
				});
			}
		} catch (error) {
			logger.error("ProjectService -> acceptProject: Error accepting project", error);
			callback({
				status: 500,
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	rejectProject: async (data, callback) => {
		logger.trace("ProjectService -> rejectProject");
		try {
			const poolPromise = await pool;
			await poolPromise.connect();

			const prepStatement = new sql.PreparedStatement(poolPromise);
			prepStatement.input("projectId", sql.BigInt);
			await prepStatement.prepare(`
				UPDATE Project SET IsAccepted = 0 WHERE ProjectId = @projectId
			`);
			const result = await prepStatement.execute({ projectId: data.projectId });
			await prepStatement.unprepare();
			if (result.rowsAffected[0] === 1) {
				logger.trace("ProjectService -> rejectProject: Project rejected");
				callback(null, {
					status: 200,
					message: "Project rejected",
				});
			} else {
				logger.error("ProjectService -> rejectProject: Project not rejected");
				callback({
					status: 404,
					message: "Project not rejected",
				});
			}
		} catch (error) {
			logger.error("ProjectService -> rejectProject: Error rejecting project", error);
			callback({
				status: 500,
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
};

module.exports = projectService;
