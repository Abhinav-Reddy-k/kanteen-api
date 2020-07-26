const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { FoodItem, validateFoodItem } = require("../models/foodItem");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const foodItems = await FoodItem.find();
  res.send(foodItems);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const foodItem = await FoodItem.findById(req.params.id).select("-__v");

  if (!foodItem)
    return res
      .status(404)
      .send("The food item with the given ID was not found.");

  res.send(foodItem);
});

router.post("/", async (req, res) => {
  const { error } = validateFoodItem(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let foodItem = new FoodItem(
    _.pick(req.body, ["name", "price", "category", "availability"])
  );
  foodItem = await foodItem.save();

  res.send(foodItem);
});

module.exports = router;
