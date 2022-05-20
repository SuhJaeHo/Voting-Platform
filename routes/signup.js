const express = require("express");
const signupController = require("../controllers/signup.controller");
const { signupVerify } = require("../middlewares/inputValidate");

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.render("signup", { message: null});
  } catch (err) {
    next(err);
  }
});

router.post("/", signupVerify, signupController.createUser);

module.exports = router;
