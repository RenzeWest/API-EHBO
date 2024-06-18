const pool = require("../doa/sql-database");
const logger = require("../util/logger");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecretKey = process.env.JWT_SECRETKEY;


const sessionDuration = { expiresIn: "1d" }; 

const loginService = {
	login: async (params, callback) => {
		logger.trace("login.service -> login");

		if (!pool.connected) {
			await pool.connect();
		}
		const prepStatement = new sql.PreparedStatement(pool);

	
		prepStatement.input("password", sql.NVarChar);
		prepStatement.input("emailaddress", sql.NVarChar);

		prepStatement.prepare("SELECT * FROM Member WHERE Emailaddress = @emailaddress AND Password = @password", (err) => {
			if (err) {
				callback(err, null);
				logger.error(err);
				return;
			}

			prepStatement.execute({ password: params.password, emailaddress: params.emailaddress }, (err, result) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}
				logger.debug("Login -> execute");

				if (result.recordset.length === 0) {
					logger.info("No user found");
					callback(
						{
							status: 404,
							message: "User not found or password invalid",
							data: {},
						},
						null
					);

					prepStatement.unprepare((err) => {
						logger.debug("Login -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
						}
					});
					return;
				}

				prepStatement.unprepare((err) => {
					logger.debug("Login -> statement unprepared");
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else {
						logger.info("Login Succesfull");

						const UserId = Number(result.recordset[0].UserId);
						const tokenPayload = { userId: UserId };

						jwt.sign(tokenPayload, jwtSecretKey, sessionDuration, (err, token) => {
							logger.info("User has succesfully logged in");
							callback(null, {
								status: 200,
								message: "User has succesfully logged in",
								data: {
									UserId: UserId,
									Permissions: result.recordset[0].Role,
									SessionToken: token,
								},
							});
						});
					}
				});
			});
		});
	},



	update: async (userId, params, callback) => {
		logger.trace("LoginService -> update");

		if (!pool.connected) {
			await pool.connect();
		}

		const prepStatement = new sql.PreparedStatement(pool);

		prepStatement.input("userId", sql.BigInt);
		prepStatement.input("emailaddress", sql.NVarChar);
		prepStatement.input("password", sql.NVarChar);
		prepStatement.input("newPassword", sql.NVarChar);
		prepStatement.input("firstName", sql.NVarChar);
		prepStatement.input("lastName", sql.NVarChar);
		prepStatement.input("street", sql.NVarChar);
		prepStatement.input("houseNumber", sql.NVarChar);
		prepStatement.input("postCode", sql.NVarChar);
		prepStatement.input("city", sql.NVarChar);
		prepStatement.input("phoneNumber", sql.NVarChar);
		prepStatement.input("gender", sql.NVarChar);
		prepStatement.input("dateOfBirth", sql.NVarChar);
		prepStatement.input("invoiceEmail", sql.NVarChar);
		prepStatement.input("invoiceStreet", sql.NVarChar);
		prepStatement.input("invoiceHouseNr", sql.NVarChar);
		prepStatement.input("invoiceCity", sql.NVarChar);

		if (params.newPassword) {
			prepStatement.prepare("UPDATE Member SET Emailaddress = @emailaddress, Password = @newPassword, FirstName = @firstName, LastName = @lastName, Street = @street, HouseNr = @houseNumber, PostCode = @postCode, City = @city, PhoneNumber = @phoneNumber, Gender = @gender, DateOfBirth = @dateOfBirth, InvoiceEmail = @invoiceEmail, InvoiceStreet = @invoiceStreet, InvoiceHouseNr = @invoiceHouseNr, InvoiceCity = @invoiceCity WHERE UserId = @userId AND Password = @password", (err) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}

				prepStatement.execute({ userId: userId, emailaddress: params.emailaddress, password: params.password, newPassword: params.newPassword, firstName: params.firstName, lastName: params.lastName, street: params.street, houseNumber: params.houseNumber, postCode: params.postCode, city: params.city, phoneNumber: params.phoneNumber, gender: params.gender, dateOfBirth: params.dateOfBirth, invoiceEmail: params.invoiceEmail, invoiceHouseNr: params.invoiceHouseNr, invoiceStreet: params.invoiceStreet, invoiceCity: params.invoiceCity }, (err, result) => {
					if (err) {
						callback(err, null);
						logger.error(err);
						return;
					}
					logger.debug("Update -> execute");

					if (result.rowsAffected[0] === 0) {
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
							logger.debug("Update -> statement unprepared");
							if (err) {
								logger.error(err);
								callback(err, null);
							}
						});
						return;
					}

					prepStatement.unprepare((err) => {
						logger.debug("Update -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
							return;
						} else {
							logger.info("User has been updated");
							callback(null, {
								status: 200,
								message: "User has been updated",
								data: {},
							});
						}
					});
				});
			});
		} else {
			prepStatement.prepare("UPDATE Member SET Emailaddress = @emailaddress, FirstName = @firstName, LastName = @lastName, Street = @street, HouseNr = @houseNumber, PostCode = @postCode, City = @city, PhoneNumber = @phoneNumber, Gender = @gender, DateOfBirth = @dateOfBirth, InvoiceEmail = @invoiceEmail, InvoiceStreet = @invoiceStreet, InvoiceHouseNr = @invoiceHouseNr, InvoiceCity = @invoiceCity WHERE UserId = @userId AND Password = @password", (err) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}

				prepStatement.execute({ userId: userId, emailaddress: params.emailaddress, password: params.password, firstName: params.firstName, lastName: params.lastName, street: params.street, houseNumber: params.houseNumber, postCode: params.postCode, city: params.city, phoneNumber: params.phoneNumber, gender: params.gender, dateOfBirth: params.dateOfBirth, invoiceEmail: params.invoiceEmail, invoiceHouseNr: params.invoiceHouseNr, invoiceStreet: params.invoiceStreet, invoiceCity: params.invoiceCity }, (err, result) => {
					if (err) {
						callback(err, null);
						logger.error(err);
						return;
					}
					logger.debug("Update -> execute");

					if (result.rowsAffected[0] === 0) {
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
							logger.debug("Update -> statement unprepared");
							if (err) {
								logger.error(err);
								callback(err, null);
							}
						});
						return;
					}

					prepStatement.unprepare((err) => {
						logger.debug("Update -> statement unprepared");
						if (err) {
							logger.error(err);
							callback(err, null);
							return;
						} else {
							logger.info("User has been updated");
							callback(null, {
								status: 200,
								message: "User has been updated",
								data: {},
							});
						}
					});
				});
			});
		}
	},
};

module.exports = loginService;

