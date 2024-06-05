// The index and main file of this API
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const logger = require("./src/util/logger");

// Routes requirements

const loginRoutes = require("./src/routes/login.routes");
const projectRoutes = require("./src/routes/project.routes");


const loginRoutes = require('./src/routes/login.routes').router;
const memberRoutes = require('./src/routes/member.routes');

const firstResponderRoutes = require('./src/routes/firstResponder.routes')


app.use(express.json());

const corsOptions = {
	origin: "*",
};
// Enable all cors
app.use(cors(corsOptions));

app.get("/", (req, res) => {
	logger.trace('route: "/" called');
	res.status(200).json({
		status: 200,
		message: "Hello World",
		data: {},
	});
});

// Routes


app.use(memberRoutes);
app.use(loginRoutes);

app.use(projectRoutes);

// Remaining routes
app.use((req, res, next) => {
	// This will run if a route isn't found
	next({
		status: 404,
		message: "Route not found",
		data: {},
	});

app.use(firstResponderRoutes)


// Remaining routes
app.use((req, res, next) => { // This will run if a route isn't found
    logger.warn('Route not found');
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    });

});

// Als er een error is (next) dan komt hij hier. Hij kijkt of er een status en massage is, zo ja geeft hij die mee, zo nee geeft hij 500 en server error.
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

// Deze kan chai gebruiker om in de tests de server op te starten
module.exports = app;
