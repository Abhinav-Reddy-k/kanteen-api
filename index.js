const express = require("express");
const app = express();
const winston = require("winston");
const config = require("config");
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
