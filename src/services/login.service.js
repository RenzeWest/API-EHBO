const pool = require("../doa/sql-database");
const logger = require("../util/logger");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../util/config").secretkey;

// Dit is voor hoelang een sessie moet duren
const sessionDuration = { expiresIn: "12d" }; // nu is het dus 1 uur

const loginService = {
	/**
	 * @deprecated - Is om te testen, zou niet moeten worden gebruikt
	 */
	test: async (callback) => {
		logger.trace("LoginService -> test");
		try {
			const result = await pool.request().query("SELECT * FROM Certificaat");

			if (result.recordset) {
				logger.trace("LoginService -> test: Got a result");
				callback(null, {
					status: 200,
					message: "This is a message",
					data: result.recordset,
				});
			}
		} catch (error) {
			logger.error(error);
			callback(error, null);
		}
	},

	/** Method to check if a user exists, if so it will send back a token, with the ID inside of it
	 * @deprecated - Gebruiker de preparedLogin
	 */
	loginDep: async (callback) => {
		logger.trace("LoginService -> login");
		try {
			// Controleer of er een gebruiker met de wachtwoord en email combinatie is
			const result = await pool.request().query("SELECT GebruikerID FROM Gebruiker WHERE Emailadres = 'rg.westerink@student.avans.nl' AND WachtwoordHash = 'secretPassword'");

			if (result.recordset.length > 0) {
				// Er is een gebruiker gevonden met de combinatie van wachtwoord en email
				logger.debug("User has email and password correct");

				// Creeër token (Ik weet dat dit in 1 regel kan, maar het is zo makkelijker voor jullie om te snappen, hoop ik...)
				const gebruikerID = result.recordset[0].GebruikerID; // Haal de ID uit de response
				const tokenPayload = { userID: gebruikerID };

				// Maak de token aan, gooi de payload erin, link de secretkey (wordt gebruikt om hem te versleutelen), zet hoelang het geldig is.
				jwt.sign(tokenPayload, jwtSecretKey, sessieDuur, (err, token) => {
					logger.info("User succesfully logged in");
					callback(null, {
						status: 200,
						message: "User logged in",
						data: {
							GebruikerID: gebruikerID,
							SessionToken: token,
						},
					});
				});
			} else {
				// Er is geen gebruiker gevonden met de combinatie van wachtwoord en email
				logger.debug("User does not have the correct password and email");
				callback(
					{
						status: 404,
						message: "User not found or password invalid",
						data: {},
					},
					null
				);
			}
		} catch (error) {
			// Er is iets foutgegaan
			callback(error, null);
		}
	},

	login: async (params, callback) => {
		logger.trace("login.service -> login");

		if (!pool.connected) {
			await pool.connect();
		}

		// Get a connection fore the prepared statement
		const prepStatement = new sql.PreparedStatement(pool);

		// Prepare valiables
		prepStatement.input("password", sql.NVarChar);
		prepStatement.input("emailaddress", sql.NVarChar);

		// Bereid het statement door
		prepStatement.prepare("SELECT * FROM Member WHERE Emailaddress = @emailaddress AND Password = @password", (err) => {
			if (err) {
				callback(err, null);
				logger.error(err);
				return;
			}

			// Geef de waarden mee en voer uit
			prepStatement.execute({ password: params.password, emailaddress: params.emailaddress }, (err, result) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}
				logger.debug("Login -> execute");

				// Controlleer of er een gebruiker is gevonden
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

				// Unprepare statment om connectie vrij te geven
				prepStatement.unprepare((err) => {
					logger.debug("Login -> statement unprepared");
					if (err) {
						logger.error(err);
						callback(err, null);
						return;
					} else {
						logger.info("Login Succesfull");

						// Creeër token (UserId wordt herbruikt)
						const UserId = Number(result.recordset[0].UserId); // Haal de ID uit de response
						const tokenPayload = { userId: UserId };

						// Maak de token aan, gooi de payload erin, link de secretkey (wordt gebruikt om hem te versleutelen), zet hoelang het geldig is.
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

	/**
	 * @deprecated -> We gebruiken de minder async variant
	 * @param {*} params User emailaddress and password
	 * @param {*} callback
	 */
	loginPrepared: async (params, callback) => {
		logger.trace("LoginService -> LoginPrepared");

		if (!pool.connected) {
			await pool.connect();
		}

		const prepStatement = new sql.PreparedStatement(pool);

		try {
			prepStatement.input("emailaddress", sql.VarChar);
			prepStatement.input("password", sql.VarChar);
			await prepStatement.prepare("SELECT * FROM Member WHERE Emailaddress = @emailaddress AND Password = @password");
			const result = await prepStatement.execute({ emailaddress: params.emailaddress, password: params.password });

			if (result.recordset.length > 0) {
				// Er is een gebruiker gevonden met de combinatie van wachtwoord en email
				logger.debug("User has email and password correct");

				// Creeër token UserId wordt herbruikt
				const UserId = result.recordset[0].UserId; // Haal de ID uit de response
				const tokenPayload = { userId: UserId };

				// Maak de token aan, gooi de payload erin, link de secretkey (wordt gebruikt om hem te versleutelen), zet hoelang het geldig is.
				jwt.sign(tokenPayload, jwtSecretKey, sessionDuration, (err, token) => {
					logger.info("User succesfully logged in");
					callback(null, {
						status: 200,
						message: "User logged in",
						data: {
							UserId: UserId,
							Permissions: result.recordset[0].Role,
							SessionToken: token,
						},
					});
				});
			} else {
				// Er is geen gebruiker met de wachtwoord en email combinatie gevonden
				callback({ status: 404, message: "User not found or password invalid", data: {} }, null);
			}
		} catch (error) {
			logger.error(error);
			callback(error, null);
		} finally {
			logger.debug("Made the finally");
			await prepStatement.unprepare();
		}
	},

	update: async (userId, params, callback) => {
		logger.trace("LoginService -> update");

		if (!pool.connected) {
			await pool.connect();
		}

		// Get a connection fore the prepared statement
		const prepStatement = new sql.PreparedStatement(pool);

		// Prepare valiables
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
			// Bereid het statement door
			prepStatement.prepare("UPDATE Member SET Emailaddress = @emailaddress, Password = @newPassword, FirstName = @firstName, LastName = @lastName, Street = @street, HouseNr = @houseNumber, PostCode = @postCode, City = @city, PhoneNumber = @phoneNumber, Gender = @gender, DateOfBirth = @dateOfBirth, InvoiceEmail = @invoiceEmail, InvoiceStreet = @invoiceStreet, InvoiceHouseNr = @invoiceHouseNr, InvoiceCity = @invoiceCity WHERE UserId = @userId AND Password = @password", (err) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}

				// Geef de waarden mee en voer uit
				prepStatement.execute({ userId: userId, emailaddress: params.emailaddress, password: params.password, newPassword: params.newPassword, firstName: params.firstName, lastName: params.lastName, street: params.street, houseNumber: params.houseNumber, postCode: params.postCode, city: params.city, phoneNumber: params.phoneNumber, gender: params.gender, dateOfBirth: params.dateOfBirth, invoiceEmail: params.invoiceEmail, invoiceHouseNr: params.invoiceHouseNr, invoiceStreet: params.invoiceStreet, invoiceCity: params.invoiceCity }, (err, result) => {
					if (err) {
						callback(err, null);
						logger.error(err);
						return;
					}
					logger.debug("Update -> execute");

					// Controlleer of er een gebruiker is gevonden
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

					// Unprepare statment om connectie vrij te geven
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
			// Bereid het statement door
			prepStatement.prepare("UPDATE Member SET Emailaddress = @emailaddress, FirstName = @firstName, LastName = @lastName, Street = @street, HouseNr = @houseNumber, PostCode = @postCode, City = @city, PhoneNumber = @phoneNumber, Gender = @gender, DateOfBirth = @dateOfBirth, InvoiceEmail = @invoiceEmail, InvoiceStreet = @invoiceStreet, InvoiceHouseNr = @invoiceHouseNr, InvoiceCity = @invoiceCity WHERE UserId = @userId AND Password = @password", (err) => {
				if (err) {
					callback(err, null);
					logger.error(err);
					return;
				}

				// Geef de waarden mee en voer uit
				prepStatement.execute({ userId: userId, emailaddress: params.emailaddress, password: params.password, firstName: params.firstName, lastName: params.lastName, street: params.street, houseNumber: params.houseNumber, postCode: params.postCode, city: params.city, phoneNumber: params.phoneNumber, gender: params.gender, dateOfBirth: params.dateOfBirth, invoiceEmail: params.invoiceEmail, invoiceHouseNr: params.invoiceHouseNr, invoiceStreet: params.invoiceStreet, invoiceCity: params.invoiceCity }, (err, result) => {
					if (err) {
						callback(err, null);
						logger.error(err);
						return;
					}
					logger.debug("Update -> execute");

					// Controlleer of er een gebruiker is gevonden
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

					// Unprepare statment om connectie vrij te geven
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

/*
if (err) {
            logger.error(err);
            callback(err, null);
        } else {
            logger.trace('LoginService -> test')
            callback(null, {
                status: 200,
                message: 'This is a message',
                data: {
                    message: 'Data is leeg'
                }
            });

        }
*/
