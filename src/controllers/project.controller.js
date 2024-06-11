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
	getUnwatchedProjects: (req, res, next) => {
		projectService.getUnwatchedProjects((error, success) => {
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
	acceptProject: (req, res, next) => {
		projectService.acceptProject(req.body, (error, success) => {
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
	rejectProject: (req, res, next) => {
		projectService.rejectProject(req.body, (error, success) => {
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
};

module.exports = projectController;
