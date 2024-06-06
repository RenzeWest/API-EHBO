const logger = require("../util/logger");
const projectService = require("../services/project.service");

const projectController = {
	test: (req, res, next) => {
		logger.trace("ProjectController -> test");
		projectService.test((error, success) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (success) {
				res.status(200).json({
					status: success.status,
					message: success.message,
					data: success.data,
				});
			}
		});
	},

	create: (req, res, next) => {
		projectService.create(req.body, (error, success) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (success) {
				res.status(200).json({
					status: success.status,
					message: success.message,
					data: success.data,
				});
			}
		});
	},

	update: (req, res, next) => {
		projectService.update(req.params.id, req.body, (error, success) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (success) {
				res.status(200).json({
					status: success.status,
					message: success.message,
					data: success.data,
				});
			}
		});
	},

	delete: (req, res, next) => {
		projectService.delete(req.params.id, (error, success) => {
			if (error) {
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (success) {
				res.status(200).json({
					status: success.status,
					message: success.message,
					data: success.data,
				});
			}
		});
	},

	getAllUndecidedProject: (req, res, next) => {
        logger.trace('projectController -> getAllUndecidedProject');

        projectService.getAllUndecidedProject((error, succes) => {
            if (error) {
                logger.error('projectController -> getAllUndecidedProject');
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message || 'Hoi',
                    data: succes.data || 'Hoi'
                })
            }
        });

    },

	getProject: (req, res, next) => {
		logger.trace('projectController -> getAllUndecidedProject');
		if(error) {
			return next({
				status: error.status,
				message: error.message,
				data: {}
			})
		}
		if (succes) {
			res.status(200).json({
				status: succes.status,
				message: succes.message || 'Hoi',
				data: succes.data || 'Hoi'
			})
		}
	}
};

module.exports = projectController;
