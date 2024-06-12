const pool = require("../doa/sql-database");
const sql = require("mssql");
const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
const { assignShift } = require("../controllers/shift.controller");
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
};

module.exports = shiftService;
