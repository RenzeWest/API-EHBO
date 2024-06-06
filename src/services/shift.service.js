const pool = require("../doa/sql-database");
const sql = require("mssql");
const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../util/config").secretkey;

const shiftService = {
	getShifts: async (callback) => {
		logger.trace("shiftService -> getShifts");

		if (!pool.connected) {
			await pool.connect();
		}

		const request = new sql.Request(pool);
		request.query("SELECT * FROM Shift", (error, result) => {
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

		// Prepare SQL statement
		const prepStatement = new sql.PreparedStatement(poolPromise);
		request.input("userId", sql.Int);
		request.input("projectId", sql.Int);
		request.input("beginTime", sql.NVarChar);
		request.input("endTime", sql.NVarChar);

		request.query(
			"INSERT INTO Shift (UserId, ProjectId, BeginTime, EndTime) VALUES (@userId, @projectId, @beginTime, @endTime)",
			{
				userId: data.userId,
				projectId: data.projectId,
				beginTime: data.beginTime,
				endTime: data.endTime,
			},
			(error, result) => {
				if (error) {
					logger.error(error);
					callback(error, null);
				} else {
					callback(null, {
						status: 200,
						message: "Shift created",
						data: {},
					});
				}
			}
		);
	},
};
