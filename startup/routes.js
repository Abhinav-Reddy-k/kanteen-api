const express = require("express");
const foodItems = require("../routes/foodItems");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/foodItems", foodItems);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
};
