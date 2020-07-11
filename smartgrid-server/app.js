const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const microgridRoutes = require("./api/routes/microgrid");
const prosumerRoutes = require("./api/routes/prosumer");
const adminRoutes = require("./api/routes/admin");
const smartMeterRoutes = require("./api/routes/smartmeter");
const apiRoutes = require("./api/routes/api");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/microgrid', microgridRoutes);
app.use('/prosumer', prosumerRoutes);
app.use('/admin', adminRoutes);
app.use('/smartmeter', smartMeterRoutes);
app.use('/api', apiRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.stack(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;