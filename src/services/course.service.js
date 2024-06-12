const pool = require('../doa/sql-database');
const logger = require('../util/logger');
const sql = require('mssql');

const courseService = {
    getCourses: async (callback) => {
        logger.trace('courseService -> getCourses');

        if (!pool.connected) {
            await pool.connect();
        }

        const request = new sql.Request(pool);
        request.query("SELECT * FROM Course",
         (error, result) => {
            if (error) {
                logger.error(error);
                callback(error, null);
            } else {
                callback(null, {
                    status: 200,
                    message: 'Courses found',
                    data: result.recordset
                });
            }
        })
    },

	getAllCertificates: async (callback) => {
		logger.trace('courseService -> getAllCourses');

		if (!pool.connected) {
            await pool.connect();
        }

        const request = new sql.Request(pool);
        request.query("SELECT * FROM Certificate",
         (error, result) => {
            if (error) {
                logger.error(error);
                callback(error, null);
            } else {
                callback(null, {
                    status: 200,
                    message: 'Certificates found',
                    data: result.recordset
                });
            }
        })
	},

    addCourse: async (courseInformation, callback) => {
        logger.trace('courseService -> addCourse');
        
        try {

            if (!pool.connected) {
			    await pool.connect();
		    }

			// Prepare SQL statement
			const prepStatement = new sql.PreparedStatement(pool);
			prepStatement.input("title", sql.NVarChar);
			prepStatement.input("description", sql.NVarChar);
			prepStatement.input("datetime", sql.DateTime);
			prepStatement.input("cost", sql.NVarChar);
			prepStatement.input("maxParticipants", sql.Int);
			prepStatement.input("location", sql.NVarChar);
			prepStatement.input("teacherId", sql.BigInt);
			prepStatement.input("certificateTitle", sql.NVarChar);

			await prepStatement.prepare(`
                INSERT INTO [dbo].[Course] ([Title], [Description], [DateTime], [Cost], [MaxParticipants], [Location], [TeacherId], [CertificateTitel])
                VALUES (@title, @description, @datetime, @cost, @maxParticipants, @location, @teacherId, @certificateTitle);`);

			// Execute SQL statement
			const result = await prepStatement.execute({
				title: courseInformation.title,
				description: courseInformation.description,
				datetime: courseInformation.datetime,
				cost: courseInformation.cost,
				maxParticipants: courseInformation.maxParticipants,
				location: courseInformation.location,
				teacherId: courseInformation.teacherId,
				certificateTitle: courseInformation.certificatieTitle
			});

			await prepStatement.unprepare();

			// Check if Course was successfully created
			if (result.rowsAffected[0] === 1) {
				logger.trace("CourseService -> create: Created a Course");
				callback(null, {
					status: 200,
					message: "Course created",
					data: {},
				});
			} else {
				logger.error("CourseService -> create: No Course created");
				callback({
					status: 500,
					message: "No Course Created",
					data: {},
				});
			}
		} catch (error) {
			// Log and return error
			logger.error("CourseService -> create: Error Creating Course", error);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
				error: error.message,
			});
		}
    },

	enrollInCourse: async (enrollmentInformation, callback) => {
		logger.trace('CourseService -> enrollInCourse');

		try {

            if (!pool.connected) {
			    await pool.connect();
		    }

			// Prepare SQL statement
			const prepStatement = new sql.PreparedStatement(pool);
			prepStatement.input("userId", sql.BigInt);
			prepStatement.input("courseId", sql.BigInt);

			await prepStatement.prepare(`INSERT INTO Enrollment (UserId, CourseId, DateOfEnrollment) VALUES(@userId, @courseId, GETDATE());`);

			// Execute SQL statement
			const result = await prepStatement.execute({
				userId: enrollmentInformation.userId,
				courseId: enrollmentInformation.courseId
			});

			await prepStatement.unprepare();

			// Check if Course was successfully created
			if (result.rowsAffected[0] === 1) {
				logger.trace("CourseService -> enrollInCourse: Created a enrollment");
				callback(null, {
					status: 200,
					message: "enrollment created",
					data: {},
				});
			} else {
				logger.error("CourseService -> enrollInCourse: No enrollment created");
				callback({
					status: 500,
					message: "No enrollment Created",
					data: {},
				});
			}
		} catch (error) {
			// Log and return error
			if (error.message.startsWith("Violation of PRIMARY KEY constraint 'PK_Inschrijving'")) {
				logger.error('Gebruiker is al ingeschreven bij deze cursus');

				callback({
					status: 500,
					message: 'De gebruiker is al aangemeld bij deze cursus',
					data: {}
				});
			} else {
				logger.error("CourseService -> enrolleInCourse: Error Creating enrollement", error.message);
				callback({
					status: 500,
					message: "Internal Server Error",
					data: {},
					error: error.message,
				});
			}

		}

	}
}

module.exports = courseService;