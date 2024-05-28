const pool = require('../doa/sql-database');
const logger = require('../util/logger');
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