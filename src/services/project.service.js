const pool = require("../doa/sql-database");
const logger = require("../util/logger");
const sql = require("mssql");

const projectService = {
	test: async (callback) => {
		logger.trace("ProjectService -> test");
		try {
			const pool = await pool.request().query("SELECT * FROM Project");

			if (result.recordset) {
				logger.trace("ProjectService -> test: Got a result");
				callback(null, {
					status: 200,
					message: "This is a message",
					data: result.recordset,
				});
			}
		} catch (error) {
			logger.error(`ProjectService -> test: ${error}`);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
			});
		}
	},
	create: async (data, callback) => {
		logger.trace("ProjectService -> create");
		try {
			const pool = await pool.request().input("company", sql.NVarChar, data.name).input("phonenumber", sql.NVarChar, data.phonenumber).input("landlinenumber", sql.NVarChar, data.landlinenumber).input("address", sql.NVarChar, data.adress).input("city", sql.NVarChar, data.city).input("Title", sql.NVarChar, data.Title).input("description", sql.NVarChar, data.description).input("contactperson", sql.NVarChar, data.contactperson).input("contactemail", sql.NVarChar, data.contactemail).input("housenumber", sql.NVarChar, data.housenumber).input("date", sql.DateTime, data.date).input("currentdate", sql.DateTime, date.currentdate).query("INSERT INTO Project (Company, PhoneNumber, LandlineNumber, Address, City, Title, Description, ContactPerson, ContactEmail, HouseNr, DateTime, RequestDate) VALUES (@company, @phonenuber,@landlinenumber, @address, @city , @Title, @description, @contactperson, @contactemail, @housenumber, @date, @currentdate)");

			if (result.rowsAffected[0] === 1) {
				logger.trace("ProjectService -> create: Created a project");
				callback(null, {
					status: 200,
					message: "Project created",
					data: {},
				});
			}
		} catch (error) {
			logger.error(`ProjectService -> create: ${error}`);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
			});
		}
	},
	update: async (id, data, callback) => {
		logger.trace("ProjectService -> update");
		try {
			const pool = await pool.request().input("id", sql.Int, id).input("company", sql.NVarChar, data.name).input("phonenumber", sql.NVarChar, data.phonenumber).input("landlinenumber", sql.NVarChar, data.landlinenumber).input("address", sql.NVarChar, data.adress).input("city", sql.NVarChar, data.city).input("Title", sql.NVarChar, data.Title).input("description", sql.NVarChar, data.description).input("contactperson", sql.NVarChar, data.contactperson).input("contactemail", sql.NVarChar, data.contactemail).input("housenumber", sql.NVarChar, data.housenumber).input("date", sql.DateTime, data.date).query("UPDATE Project SET Company = @company, PhoneNumber = @phonenumber, LandlineNumber = @landlinenumber, Address = @address, City = @city, Title = @Title, Description = @description, ContactPerson = @contactperson, ContactEmail = @contactemail, HouseNr = @housenumber, Date = @date WHERE ID = @id");

			if (result.rowsAffected[0] === 1) {
				logger.trace("ProjectService -> update: Updated a project");
				callback(null, {
					status: 200,
					message: "Project updated",
					data: {},
				});
			}
		} catch (error) {
			logger.error(`ProjectService -> update: ${error}`);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
			});
		}
	},
	delete: async (id, callback) => {
		logger.trace("ProjectService -> delete");
		try {
			const pool = await pool.request().input("id", sql.Int, id).query("DELETE FROM Project WHERE ID = @id");

			if (result.rowsAffected[0] === 1) {
				logger.trace("ProjectService -> delete: Deleted a project");
				callback(null, {
					status: 200,
					message: "Project deleted",
					data: {},
				});
			}
		} catch (error) {
			logger.error(`ProjectService -> delete: ${error}`);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
			});
		}
	},
};
