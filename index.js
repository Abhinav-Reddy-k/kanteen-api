const express = require("express");
const app = express();
const config = require("config");
const logger = require("./startup/logger");
require("./startup/routes")(app);
require("./startup/db")();

const port = config.get("port");
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
