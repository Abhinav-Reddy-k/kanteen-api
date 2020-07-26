const express = require("express");
const foodItems = require("../routes/foodItems");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/foodItems", foodItems);
};
