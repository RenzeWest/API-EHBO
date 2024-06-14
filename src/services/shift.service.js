const pool = require("../doa/sql-database");
const sql = require("mssql");
const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
const { assignShift, getAssignedShifts } = require("../controllers/shift.controller");
const jwtSecretKey = require("../util/config").secretkey;

const shiftService = {
	getShifts: async (projectId, callback) => {
		logger.trace("shiftService -> getShifts");

		if (!pool.connected) {
			await pool.connect();
		}

		const request = new sql.Request(pool);
		request.input("projectId", sql.BigInt, projectId);

		request.query("SELECT * FROM Shift WHERE ProjectId = @projectId", (error, result) => {
			if (error) {
				logger.error(error);
				callback(error, null);
			} else {
				callback(null, {
					status: 200,
					message: "Shifts found",
					data: result.recordset,
				});
			}
		});
	},
	createShifts: async (data, callback) => {
		logger.trace("shiftService -> createShifts");

		const poolPromise = await pool;
		await poolPromise.connect();
		const beginTime = data.beginTime + ":00";
		const endTime = data.endTime + ":00";
		const prepStatement = new sql.PreparedStatement(poolPromise);
		prepStatement.input("startDate", sql.Date);
		prepStatement.input("endDate", sql.Date);
		prepStatement.input("startTime", sql.NVarChar);
		prepStatement.input("endTime", sql.NVarChar);
		prepStatement.input("projectId", sql.BigInt);

		prepStatement.prepare("INSERT INTO Shift (StartDate, EndDate, StartTime, EndTime, ProjectId) VALUES (@startDate, @endDate,  @startTime, @endTime, @projectId)", (err) => {
			if (err) {
				callback(err, null);
				logger.error(err);
			}
			prepStatement.execute({ startDate: data.beginDate, endDate: data.endDate, startTime: beginTime, endTime: endTime, projectId: data.projectId }, (err) => {
				if (err) {
					callback(err, null);
					logger.error(err);
				}
				prepStatement.unprepare((err) => {
					if (err) {
						logger.error(err);
						callback(err, null);
					} else {
						logger.debug("shift inserted");
						callback(null, {
							status: 200,
							message: "Shifts inserted",
							data: {},
						});
					}
				});
			});
		});
	},
	assignShift: async (data, callback) => {
		logger.trace("shiftService -> assignShift");

		try {
			const poolPromise = await pool;
			const poolConnection = await poolPromise.connect();
			const prepStatement = new sql.PreparedStatement(poolConnection);
			prepStatement.input("shiftId", sql.BigInt);
			prepStatement.input("userId", sql.BigInt);
			prepStatement.input("projectId", sql.BigInt);

			await prepStatement.prepare("INSERT INTO AssignedShift (ShiftId, UserId, ProjectId) VALUES (@shiftId, @userId, @projectId)");

			await prepStatement.execute({ shiftId: data.shiftId, userId: data.userId, projectId: data.projectId });

			await prepStatement.unprepare();

			logger.debug("shift assigned");

			callback(null, {
				status: 200,
				message: "Shift assigned",
				data: {},
			});
		} catch (err) {
			logger.error(err);
			callback(err, null);
		}
	},

	getMyShifts: async (userId, callback) => {
		logger.trace("shiftService -> getMyShift");

		if (!pool.connected) {
			await pool.connect();
		}

		// Get a connection fore the prepared statement
		const prepStatement = new sql.PreparedStatement(pool);

		// Prepare valiables
		prepStatement.input("userId", sql.BigInt);

		// Bereid het statement door
		prepStatement.prepare(
			`SELECT AssignedShift.UserId, AssignedShift.ShiftId, 
								Shift.StartDate, Shift.EndDate, Shift.StartTime, Shift.EndTime, 
								Project.Title, Project.Address + ' ' + Project.HouseNr + ', ' + Project.City AS Address, Project.Company, Project.Description
								FROM AssignedShift
								INNER JOIN Shift ON AssignedShift.ShiftId = Shift.ShiftId
								INNER JOIN Project ON AssignedShift.ProjectId = Project.ProjectId
								WHERE AssignedShift.UserId = @userId;`,
			(err) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}

				// Geef de waarden mee en voer uit
				prepStatement.execute({ userId: userId }, (err, result) => {
					if (err) {
						callback(err, null);
						logger.error(err);
						return;
					}
					logger.debug("getMyShifts -> execute");

					// Unprepare statment om connectie vrij te geven
					prepStatement.unprepare((err) => {
						logger.debug("Login -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
							return;
						} else {
							logger.info("Query executed");
							callback(null, {
								status: 200,
								message: "Shifts for userId: " + userId,
								data: result.recordset,
							});
						}
					});
				});
			}
		);
	},

	acceptForShift: async (assignedShiftInformation, callback) => {
		logger.trace("shiftService -> acceptForShift");

		if (!pool.connected) {
			await pool.connect();
		}

		// Get a connection fore the prepared statement
		const prepStatement = new sql.PreparedStatement(pool);

		// Prepare valiables
		prepStatement.input("userId", sql.BigInt);
		prepStatement.input("shiftId", sql.BigInt);
		prepStatement.input("projectId", sql.BigInt);

		// Bereid het statement door
		prepStatement.prepare(`UPDATE AssignedShift SET IsAccepted = 1 WHERE UserId = @userId AND ShiftId = @shiftId AND ProjectId = @projectId AND IsAccepted IS NULL`, (err) => {
			if (err) {
				callback(err, null);
				logger.error(err);
				return;
			}
			console.log(assignedShiftInformation);
			// Geef de waarden mee en voer uit
			prepStatement.execute({ userId: assignedShiftInformation.userId, projectId: assignedShiftInformation.projectId, shiftId: assignedShiftInformation.shiftId }, (err, result) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}
				logger.debug("acceptForShift -> execute");
				console.log(result);
				// Unprepare statment om connectie vrij te geven
				prepStatement.unprepare((err) => {
					logger.debug("acceptForShift -> statement unprepared");
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else {
						logger.info("Query executed");

						if (result.rowsAffected[0] === 0) {
							callback(null, {
								status: 400,
								message: "No rows affected...",
								data: {},
							});
						} else {
							callback(
								{
									status: 200,
									message: "AssignedShift Updated",
									data: {},
								},
								null
							);
						}
					}
				});
			});
		});
	},

	getShiftInformationById: async (shiftInformation, callback) => {
		logger.trace("shiftService -> getShiftInformationById");

		if (!pool.connected) {
			await pool.connect();
		}

		// Get a connection fore the prepared statement
		const prepStatement = new sql.PreparedStatement(pool);

		// Prepare valiables
		prepStatement.input("userId", sql.BigInt);
		prepStatement.input("shiftId", sql.BigInt);

		// Bereid het statement door
		prepStatement.prepare(
			`SELECT AssignedShift.UserId, AssignedShift.ShiftId, 
								Shift.StartDate, Shift.EndDate, Shift.StartTime, Shift.EndTime, 
								Project.Title, Project.Address + ' ' + Project.HouseNr + ', ' + Project.City AS Address, Project.Company, Project.Description
								FROM AssignedShift
								INNER JOIN Shift ON AssignedShift.ShiftId = Shift.ShiftId
								INNER JOIN Project ON AssignedShift.ProjectId = Project.ProjectId
								WHERE AssignedShift.UserId = @userId AND AssignedShift.ShiftId = @shiftId`,
			(err) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}

				// Geef de waarden mee en voer uit
				prepStatement.execute({ userId: shiftInformation.userId, shiftId: shiftInformation.shiftId }, (err, result) => {
					if (err) {
						callback(err, null);
						logger.error(err);
						return;
					}
					logger.debug("getShiftInformationById -> execute");

					// Unprepare statment om connectie vrij te geven
					prepStatement.unprepare((err) => {
						logger.debug("getShiftInformationById -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
							return;
						} else {
							logger.info("Query executed");
							callback(null, {
								status: 200,
								message: "Shifts for userId: " + shiftInformation.userId + " and shiftID: " + shiftInformation.shiftId,
								data: result.recordset,
							});
						}
					});
				});
			}
		);
	},

	deleteAssignedShift: async (shiftInformation, callback) => {
		logger.trace("shiftService -> deleteAssignedShift");

		if (!pool.connected) {
			await pool.connect();
		}

		// Get a connection fore the prepared statement
		const prepStatement = new sql.PreparedStatement(pool);

		// Prepare valiables
		prepStatement.input("userId", sql.BigInt);
		prepStatement.input("shiftId", sql.BigInt);

		// Bereid het statement door
		prepStatement.prepare(`DELETE FROM AssignedShift WHERE UserId = @userId AND ShiftId = @shiftId`, (err) => {
			if (err) {
				callback(err, null);
				logger.error(err);
				return;
			}

			// Geef de waarden mee en voer uit
			prepStatement.execute({ userId: shiftInformation.userId, shiftId: shiftInformation.shiftId }, (err, result) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}
				logger.debug("deleteAssignedShift -> execute");

				// Unprepare statment om connectie vrij te geven
				prepStatement.unprepare((err) => {
					logger.debug("deleteAssignedShift -> statement unprepared");
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else if (result.rowsAffected[0] !== 0) {
						logger.info("Query executed");
						callback(null, {
							status: 200,
							message: "Succesfully deleted assigned shift",
							data: {},
						});
					} else {
						logger.info("Delete Failed");
						callback(
							{
								status: 500,
								message: "Unsuccesfully deleted assigned shift",
								data: {},
							},
							null
						);
					}
				});
			});
		});
	},

	getAssignedShifts: async (projectId, callback) => {
		logger.trace("shiftService -> getAssignedShifts");

		try {
			const poolPromise = await pool;
			const poolConnection = await poolPromise.connect();
			const request = new sql.Request(poolConnection);
			request.input("projectId", sql.BigInt, projectId);

			request.query(
				`SELECT * 
				FROM AssignedShift 
				JOIN Member ON AssignedShift.UserId = Member.UserId 
				JOIN Shift ON AssignedShift.ShiftId = Shift.ShiftId
				JOIN Project ON AssignedShift.ProjectId = Project.ProjectId 
				WHERE AssignedShift.ProjectId = @projectId 
				AND AssignedShift.IsAccepted IS NULL`,
				(error, result) => {
					if (error) {
						logger.error(error);
						callback(error, null);
					} else {
						callback(null, {
							status: 200,
							message: "Shifts found",
							data: result.recordset,
						});
					}
					poolConnection.release();
				}
			);
		} catch (error) {
			logger.error(error);
			callback(error, null);
		}
	},
};

module.exports = shiftService;
