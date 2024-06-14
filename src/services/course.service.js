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
        request.query("WITH EnrollmentCount AS (SELECT CourseId, COUNT(UserId) AS EnrolledCount FROM Enrollment GROUP BY CourseId) SELECT Course.*, Member.FirstName AS Teacher, COALESCE(EnrollmentCount.EnrolledCount, 0) AS EnrolledCount FROM Course JOIN Member ON Member.UserId = Course.TeacherId LEFT JOIN EnrollmentCount ON Course.CourseId = EnrollmentCount.CourseId",
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

	getAvailebleCourses: async (userId, callback) => {
		logger.trace('courseService -> getAvailebleCourses');
        
        try {

            if (!pool.connected) {
			    await pool.connect();
		    }

			// Prepare SQL statement
			const prepStatement = new sql.PreparedStatement(pool);
			prepStatement.input("userId", sql.BigInt);

			await prepStatement.prepare(`SELECT * FROM Course WHERE CourseId NOT IN (SELECT CourseId FROM Enrollment WHERE userId = @userId) AND DateTime > GETDATE();`);

			// Execute SQL statement
			const result = await prepStatement.execute({
				userId: userId,
			});

			await prepStatement.unprepare();

			// Check if Course was successfully created
			if (result.rowsAffected[0] >= 1) {
				logger.trace("CourseService -> create: Courses found");
				callback(null, {
					status: 200,
					message: "Courses found",
					data: result.recordset,
				});
			} else {
				logger.error("CourseService -> create: No Courses found");
				console.log(result.recordset)
				callback({
					status: 200,
					message: "No Courses found",
					data: {},
				});
			}
		} catch (error) {
			// Log and return error
			logger.error("CourseService -> create: Error getting courses", error);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
				error: error.message,
			});
		}
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

	},

	deleteCourse: async(courseId, callback) => {
		logger.trace('Courseservice -> deleteCourse')

		try{
			if(!pool.connected){
				await pool.connect()
			}

			const prepStatement = new sql.PreparedStatement(pool);
			prepStatement.input("courseID", sql.BigInt);

			await prepStatement.prepare(`DELETE FROM Course WHERE CourseId = @courseID;`);

			// Execute SQL statement
			const result = await prepStatement.execute({
				courseID: courseId
			});

			if (result.rowsAffected[0] >= 1) {
				logger.trace("CourseService -> delete: course deleted");
				callback(null, {
					status: 200,
					message: "Course deleted",
					data: {},
				});
			} else {
				logger.error("CourseService -> delete: No Course found");
				console.log(result.recordset)
				callback({
					status: 404,
					message: "Course not found",
					data: {},
				});
			}
		} catch (error) {
			// Log and return error
			logger.error("CourseService -> delete: Error deleting course", error);
			callback({
				status: 500,
				message: "Internal Server Error",
				data: {},
				error: error.message,
			});


		} 
			
		
	}
}

module.exports = courseService;