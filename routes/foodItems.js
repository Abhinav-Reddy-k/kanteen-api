const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { FoodItem, validateFoodItem } = require("../models/foodItem");
const validateObjectId = require("../middleware/validateObjectId");

// Getting all food items in db (Requires authentication)
router.get("/", auth, async (req, res) => {
  const foodItems = await FoodItem.find();
  res.send(foodItems);
});

// Getting fooditem with specific id (Requires authentication)
router.get("/:id", auth, validateObjectId, async (req, res) => {
  const foodItem = await FoodItem.findById(req.params.id).select("-__v");

  if (!foodItem)
    return res
      .status(404)
      .send("The food item with the given ID was not found.");

  res.send(foodItem);
});

// Adding a new food item to db (Requires Admin privilages)
router.post("/", auth, admin, async (req, res) => {
  const { error } = validateFoodItem(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let foodItem = new FoodItem(
    _.pick(req.body, ["name", "price", "category", "availability"])
  );
  foodItem = await foodItem.save();

  res.send(foodItem);
});

// Updating a food item with specific id (Requires Admin privilages)
router.put("/:id", validateObjectId, auth, admin, async (req, res) => {
  const { error } = validateFoodItem(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const foodItem = await FoodItem.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      availability: req.body.availability,
      category: req.body.category,
    },
    { new: true, useFindAndModify: true }
  );
  if (!foodItem)
    return res.status(404).send("The food item with give Id is not found");
  res.send(foodItem);
});

// Deleting a specific food item (Requires Admin privilages)
router.delete("/:id", validateObjectId, auth, admin, async (req, res) => {
  const foodItem = await FoodItem.findByIdAndDelete(req.params.id, {
    useFindAndModify: true,
  });
  if (!foodItem)
    return res.status(404).send("The food item with give Id is not found");
  res.send(foodItem);
});

module.exports = router;
