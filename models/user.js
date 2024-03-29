const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { FoodItem } = require("./foodItem");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  cart: [
    {
      item: mongoose.Schema.Types.ObjectId,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  wishlist: [mongoose.Schema.Types.ObjectId],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.path("cart.item").ref(FoodItem);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

exports.validateUser = validateUser;
exports.User = User;
