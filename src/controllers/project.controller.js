const logger = require("../util/logger");
const projectService = require("../services/project.service");

const projectController = {
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

	setProjectActive: (req, res, next) => {
		projectService.setProjectActive(req.body, (error, success) => {
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
		logger.trace("projectController -> getAllUndecidedProject");

		projectService.getAllUndecidedProject((error, succes) => {
			if (error) {
				logger.error("projectController -> getAllUndecidedProject");
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (succes) {
				res.status(200).json({
					status: succes.status,
					message: succes.message,
					data: succes.data,
				});
			}
		});
	},
	getAcceptedProjects: (req, res, next) => {
		logger.trace("projectController -> getAcceptedProjects");
		projectService.getAcceptedProjects((error, success) => {
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

	getProject: (req, res, next) => {
		logger.trace("projectController -> getProject");

		const projectId = req.query.projectId;

		if (!projectId) {
			return res.status(400).json({
				status: 400,
				message: "ProjectId is required",
				data: {},
			});
		}

		projectService.getProject(projectId, (error, success) => {
			if (error) {
				logger.error(error);
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
	getActiveProjects: (req, res, next) => {
		logger.trace("projectController -> getActiveProjects");

		projectService.getActiveProjects((error, succes) => {
			if (error) {
				logger.error("projectController -> getActiveProjects");
				return next({
					status: error.status,
					message: error.message,
					data: {},
				});
			}
			if (succes) {
				res.status(200).json({
					status: succes.status,
					message: succes.message,
					data: succes.data,
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
