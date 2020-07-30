const express = require("express");
const app = express();
const winston = require("winston");
const config = require("config");
const logger = require("./startup/logger");
// Get-ChildItem Env:
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
