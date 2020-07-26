const Joi = require("joi");
const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: true,
    max: 500,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

function validateFoodItem(foodItem) {
  const schema = {
    name: Joi.string().required(),
    price: Joi.number().min(0).max(500).required(),
    category: Joi.string().required(),
    availability: Joi.boolean(),
  };

  return Joi.validate(foodItem, schema);
}

exports.foodItemSchema = foodItemSchema;
exports.FoodItem = FoodItem;
exports.validateFoodItem = validateFoodItem;
