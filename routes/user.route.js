const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createJWTToken = require("../src/config/jwt");

router.post("/", async (req, res, next) => {
    try {
      const user = new User(req.body);
      const newUser= await user.save();
      res.send(newUser);
    } catch (err) {
      next(err);
    }
  });

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      // you are setting the cookie here, and the name of your cookie is `token`
      expires: expiryDate,
      httpOnly: true, // client-side js cannot access cookie info
      secure: true, // use HTTPS
    });

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;
  