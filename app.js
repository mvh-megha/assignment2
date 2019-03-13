const express = require('express')
const body_parser = require('body-parser')

/** create express app */
const app = express();

/** parse requests of content type application/x-www-form-urlencoded */
app.use(body_parser.urlencoded({ extended: true }))

/** parse requests of content-type - application/json */
app.use(body_parser.json())

/** Server health check */
app.get('/', (req, res) => {
    res.json({ "message": "Server is up and running" })
});

/** configuring the database */
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

/** connecting to database */
mongoose.connect("mongodb://localhost:27017/master")
    .then(() => {
        console.log('Succesfully connected to database')
    }).catch((err) => {
        console.log('Couldnot connect to the database... Exiting now.....\n' + err);
        process.exit();
    });

/** Link the router */
var router = require("./app/routes/mainrouter");
app.use('/', router);
var { syncData } = require('./helpers/syncDataHelper')
/** Run the server */
app.listen(8080, () => {
    console.log("Server is up and running")
    syncData();
});