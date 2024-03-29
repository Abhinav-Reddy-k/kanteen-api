const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../models/user");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();
const debug = require("debug")("app:users");

// For getting the logged in user details

router.post("/me", auth, async (req, res) => {
  const user = await User.findById(req.body._id).select("-password");
  debug(user);
  res.send(user);
});

// For registering new User

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/get_user_wishlist", auth, async (req, res) => {
  const user = await User.findById(req.body._id).select("-password");
  res.send(user.wishlist);
});

router.post("/get_user_cart", auth, async (req, res) => {
  const user = await User.findById(req.body._id).select("-password");
  res.send(user.cart);
});

//  adding an item to wishlist
router.post("/wishlist", auth, async (req, res) => {
  let { itemId, userId } = req.body;
  let user = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        wishlist: itemId,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  debug(user.wishlist);
  res.send(user.wishlist);
});

// removing an item from wishlist
router.post("/remove_wishlist", auth, async (req, res) => {
  let { itemId, userId } = req.body;
  let user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        wishlist: itemId,
      },
    },
    { new: true, useFindAndModify: false }
  );
  debug(user.wishlist);
  res.send(user.wishlist);
});

// removing all wishlist items of a user
router.post("/empty_wishlist", auth, async (req, res) => {
  let { userId } = req.body;
  let user = await User.findByIdAndUpdate(
    userId,
    {
      wishlist: [],
    },
    { new: true, useFindAndModify: false }
  );
  debug(user.wishlist);
  res.send(user.wishlist);
});

//  storing users cart details

router.post("/cart", auth, async (req, res) => {
  let { cartFoodId, userId, quantity } = req.body;
  const result = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        cart: {
          item: cartFoodId,
          quantity: quantity,
        },
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  debug(result.cart);
  res.send(result.cart);
});

// setting cart item quantity

router.post("/setQuantity", auth, async (req, res) => {
  let { cartFoodId, userId, quantity } = req.body;
  const item = await User.updateOne(
    { _id: userId, "cart.item": cartFoodId },
    { $set: { "cart.$.quantity": quantity } }
  );
  debug({ quantity, cartFoodId });
  res.send({ quantity, cartFoodId });
});

// Removing cart item

router.post("/removecart", auth, async (req, res) => {
  let { cartFoodId, userId } = req.body;
  console.log(cartFoodId);
  let user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        cart: { item: cartFoodId },
      },
    },
    { new: true, useFindAndModify: false }
  );
  debug(user.cart);
  res.send(user.cart);
});

// removing a cart & wishlist item from all users / used when admin deletes a foodItem
router.post("/removeDeletedItem", auth, admin, async (req, res) => {
  let { cartFoodId } = req.body;
  let result = await User.updateMany(
    {},
    { $pull: { cart: { item: cartFoodId }, wishlist: cartFoodId } }
  );
  debug(result);
  res.send(result);
});

// removing all cart items of a user
router.post("/emptycart", auth, async (req, res) => {
  let { userId } = req.body;
  let user = await User.findByIdAndUpdate(
    userId,
    {
      cart: [],
    },
    { new: true, useFindAndModify: false }
  );
  debug(user.cart);
  res.send(user.cart);
});

module.exports = router;
