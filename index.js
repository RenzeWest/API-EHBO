// The index and main file of this API
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const logger = require('./src/util/logger');

app.use(express.json())

app.get('/', (req, res) => {
    logger.trace('route: "/" called')
    res.status(200).json({
        status: 200,
        message: "Hello World",
        data: {}
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

module.exports = app;
