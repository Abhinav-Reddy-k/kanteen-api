const config = require("config");
module.exports = function (req, res, next) {
  if (!config.get("requiresAuth")) return next();
  if (!req.isAdmin) return res.status(403).send("Access denied.");
  next();
};
