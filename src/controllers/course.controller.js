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

    getCertificates: (req, res, next) => {
        logger.trace('courseController -> getAllCertificates');

        courseService.getAllCertificates((error, succes) => {
            if (error) {
                logger.error('courseController -> getAllCertificates');
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
    },

    getAvailebleCourses: (req, res, next) => {
        logger.trace('courseController -> getAvailebleCourses');

        // Haal de userid uuit de req en zet het in de body, beetje onnodig I know
        

        courseService.getAvailebleCourses(req.userId, (error, succes) => {
            if (error) {
                logger.error('courseController -> getAvailebleCourses');
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

    enrollInCourse: (req, res, next) => {
        logger.trace('courseController -> enrollInCourse');

        // Haal de userid uuit de req en zet het in de body, beetje onnodig I know
        req.body.userId = req.userId;

        courseService.enrollInCourse(req.body, (error, succes) => {
            if (error) {
                logger.error('courseController -> enrollInCourse');
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

    deleteCourse: (req, res, next) => {
        logger.trace('CourseController -> deleteCourse');

        courseService.deleteCourse(req.body.courseId, (error, succes) => {
            if(error) {
                logger.error('courseController -> deleteCourse');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if(succes) {
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