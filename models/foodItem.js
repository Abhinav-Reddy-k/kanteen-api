const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  label: {
    type: String,
  },
  url: {
    type: String,
  },
  url2: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    max: 500,
    min: 0,
  },
  category: {
    type: String,
    enum: ["MilkShake", "Drinks", "Fried Rice"],
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  discount: {
    type: Number,
  },
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

function validateFoodItem(foodItem) {
  const schema = Joi.object({
    name: Joi.string().required().max(255).min(1),
    url: Joi.string(),
    url2: Joi.string(),
    price: Joi.number().min(0).max(500).required(),
    category: Joi.string().required().max(200).min(1),
    availability: Joi.boolean(),
    discount: Joi.number(),
    label: Joi.string(),
  });

  return schema.validate(foodItem);
}

exports.foodItemSchema = foodItemSchema;
exports.FoodItem = FoodItem;
exports.validateFoodItem = validateFoodItem;
