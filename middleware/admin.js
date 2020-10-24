const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!config.get("requiresAuth")) return next();
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  if (!decoded.isAdmin) return res.status(403).send("Access denied.");

  next();
};
