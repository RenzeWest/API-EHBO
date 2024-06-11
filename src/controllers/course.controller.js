const logger = require('../util/logger');
const courseService = require('../services/course.service');

const courseContoller = {
    getCourses: (req, res, next) => {
        logger.trace('courseController -> getCourse');

        courseService.getCourses((error, succes) => {
            if (error) {
                logger.error('courseController -> getCourse');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                })
            }
        });

    },

    addCourse: (req, res, next) => {
        logger.trace('courseController -> getCourse');

        req.body.teacherId = req.userId;

        courseService.addCourse(req.body, (error, succes) => {
            if (error) {
                logger.error('courseController -> getCourse');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                })
            }
        });
    }
}

module.exports = courseContoller;