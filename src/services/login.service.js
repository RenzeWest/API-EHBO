const pool = require('../doa/sql-database');
const logger = require('../util/logger');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../util/config').secretkey;

// Dit is voor hoelang een sessie moet duren
const sessieDuur = { expiresIn: '1h' } // nu is het dus 1 uur

const loginService = {
    test: async (callback) => {
        logger.trace('LoginService -> test');
        try {
            const result = await pool.request().query('SELECT * FROM Certificaat');

            if (result.recordset) {
                logger.trace('LoginService -> test: Got a result');
                callback(null, {
                    status: 200,
                    message: 'This is a message',
                    data: result.recordset
                });

            }

        } catch (error) {
            logger.error(error);
            callback(error, null);

        }
    },

    // Method to check if a user exists, if so it will send back a token, with the ID inside of it
    login: async (callback) => {
        logger.trace('LoginService -> login');
        try {
            // Controleer of er een gebruiker met de wachtwoord en email combinatie is
            const result = await pool.request().query("SELECT GebruikerID FROM Gebruiker WHERE Emailadres = 'rg.westerink@student.avans.nl' AND WachtwoordHash = 'secretPassword'");

            if (result.recordset.length > 0) {
                // Er is een gebruiker gevonden met de combinatie van wachtwoord en email
                logger.debug('User has email and password correct');

                // Creeër token (Ik weet dat dit in 1 regel kan, maar het is zo makkelijker voor jullie om te snappen, hoop ik...)
                const gebruikerID = result.recordset[0].GebruikerID; // Haal de ID uit de response
                const tokenPayload = {userID: gebruikerID}

                // Maak de token aan, gooi de payload erin, link de secretkey (wordt gebruikt om hem te versleutelen), zet hoelang het geldig is.
                jwt.sign(tokenPayload, jwtSecretKey, sessieDuur, (err, token) => {
                    logger.info('User succesfully logged in');
                    callback(null, {
                        status: 200,
                        message: 'User logged in',
                        data: {
                            GebruikerID: gebruikerID,
                            SessionToken: token
                        }
                    });
                });
                
            } else {
                // Er is geen gebruiker gevonden met de combinatie van wachtwoord en email
                logger.debug('User does not have the correct password and email');
                callback({
                    status: 404,
                    message: 'User not found or password invalid',
                    data: {}}, null);
            }

        } catch (error) {
            // Er is iets foutgegaan
            callback(error, null);
        }
    },

    loginPrepared: async (params, callback) => {
        logger.trace('LoginService -> Login');
        const prepStatement = new sql.PreparedStatement(pool);
        logger.debug(`Email: ${params.emailadres}, wachtwoord: ${params.wachtwoord}`)

        try {
            prepStatement.input('emailAdres', sql.VarChar);
            prepStatement.input('wachtwoordHash', sql.VarChar);
            await prepStatement.prepare('SELECT * FROM Gebruiker WHERE Emailadres = @emailAdres AND WachtwoordHash = @wachtwoordHash');
            const result = await prepStatement.execute({emailAdres: params.emailadres, wachtwoordHash: params.wachtwoord});

            if (result.recordset.length > 0) {
                // Er is een gebruiker gevonden met de combinatie van wachtwoord en email
                logger.debug('User has email and password correct');

                // Creeër token (Ik weet dat dit in 1 regel kan, maar het is zo makkelijker voor jullie om te snappen, hoop ik...)
                const gebruikerID = result.recordset[0].GebruikerID; // Haal de ID uit de response
                const tokenPayload = {userID: gebruikerID}

                // Maak de token aan, gooi de payload erin, link de secretkey (wordt gebruikt om hem te versleutelen), zet hoelang het geldig is.
                jwt.sign(tokenPayload, jwtSecretKey, sessieDuur, (err, token) => {
                    logger.info('User succesfully logged in');
                    callback(null, {
                        status: 200,
                        message: 'User logged in',
                        data: {
                            GebruikerID: gebruikerID,
                            SessionToken: token
                        }
                    });
                });

            } else {
                // Er is geen gebruiker met de wachtwoord en email combinatie gevonden
                callback({status: 404,
                    message: 'User not found or password invalid',
                    data: {}}, null);
            }

        } catch (error) {
            logger.error(error);
            callback(error, null);
        } finally {
            logger.debug('Made the finally')
            await prepStatement.unprepare();
        }
    },

    

    update: async (userId, params, callback) => {
        logger.trace('loginService -> update')
        const prepStatement = new sql.PreparedStatement(pool);

        prepStatement.input('firstName', sql.NVarChar);
        prepStatement.input('lastName', sql.NVarChar);
        prepStatement.input('emailAddress', sql.NVarChar);
        prepStatement.input('phoneNumber', sql.NVarChar);
        prepStatement.input('street', sql.NVarChar);
        prepStatement.input('number', sql.NVarChar);
        prepStatement.input('postCode', sql.NVarChar);
        prepStatement.input('city', sql.NVarChar);
        prepStatement.input('role', sql.NVarChar);
        prepStatement.input('gender', sql.NVarChar);
        prepStatement.input('dateOfBirth', sql.Date);
        prepStatement.input('userID', sql.BigInt)
        console.log('voor prepare')


        prepStatement.prepare('UPDATE Member SET FirstName = @firstName, LastName = @lastName, Emailaddress = @emailAddress, PhoneNumber = @phoneNumber, Street = @street, HouseNr = @number, PostCode = @postCode, City = @city, Role = @role, DateOfBirth = @dateOfBirth, Gender = @gender WHERE UserId = @userID', err => {
            if (err) {
                callback(err, null)
                logger.error(err)
            }
            logger.debug('prepare')
            prepStatement.execute({firstName: params.firstName, lastName: params.lastName, emailAddress: params.emailAddress, phoneNumber: params.phoneNumber, street: params.street, number: params.number, postCode: params.postCode, city: params.city, role: params.role, dateOfBirth: params.dateOfBirth, gender: params.gender, userID: 1}, (err, result) => {
                if (err) {
                    callback(err, null)
                    logger.error(err)
                }
                logger.debug('execute')
                prepStatement.unprepare(err => {
                    logger.debug('unprepare')
                    if(err) {
                        logger.error(err)
                        callback(err, null)
                    } else {
                        logger.info('User updated')
                        callback(null, {
                            status: 200,
                            message: 'User updated',
                            data: {}
                            // TO-DO User data teruggeven
                        })
                    }
                    
                })
            })
        })
    }
}
        
    



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