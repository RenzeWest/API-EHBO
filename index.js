const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const logger = require("./src/util/logger");

const projectRoutes = require("./src/routes/project.routes");
const loginRoutes = require("./src/routes/login.routes").router;
const memberRoutes = require("./src/routes/member.routes");
const courseRoutes = require("./src/routes/course.routes");
const shiftRoutes = require("./src/routes/shift.routes");

app.use(express.json());

const corsOptions = {
	origin: "*",
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
	logger.trace('route: "/" called');
	res.status(200).json({
		status: 200,
		message: "Hello World",
		data: {},
	});
});

app.use(memberRoutes);
app.use(loginRoutes);
app.use(shiftRoutes);
app.use(projectRoutes);
app.use(courseRoutes);

app.use((req, res, next) => {
	next({
		status: 404,
		message: "Route not found",
		data: {},
	});
});

app.use((req, res, next) => {
	logger.warn("Route not found");
	next({
		status: 404,
		message: "Route not found",
		data: {},
	});
});

app.use((error, req, res, next) => {
	logger.warn(`An error has occured: error (${error.status || 500}), message (${error.message})`);
	res.status(error.status || 500).json({
		status: error.status || 500,
		message: error.message || "Internal Server Error",
		data: {},
	});
});

app.listen(port, () => {
	logger.info(`The API is listening on port ${port}`);
});

module.exports = app;
