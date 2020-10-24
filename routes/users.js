const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

// For getting the logged in user details

router.post("/me", auth, async (req, res) => {
  const user = await User.findById(req.body._id).select("-password");
  res.send(user);
});

// For registering new User

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  const newUserParams = ["name", "email", "password"];
  if (req.body.phone) newUserParams.push("phone");
  user = new User(_.pick(req.body, newUserParams));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/cart", auth, async (req, res) => {
  let { cartFoodId, userId } = req.body;
  console.log(cartFoodId);
  let user = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        cart: cartFoodId,
      },
    },
    { new: true }
  );
  // console.log(user.cart);
  res.send(user.cart);
});

router.post("/removecart", auth, async (req, res) => {
  let { cartFoodId, userId } = req.body;
  console.log(cartFoodId);
  let user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        cart: cartFoodId,
      },
    },
    { new: true }
  );
  // console.log(user.cart);
  res.send(user.cart);
});

module.exports = router;
