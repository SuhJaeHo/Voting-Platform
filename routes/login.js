const express = require("express");
const loginController = require("../controllers/login.controller");
const { loginVerify } = require("../middlewares/inputValidate");

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.render("login", { message: null, from: req.headers.referer });
  } catch (err) {
    next(err);
  }
});

router.post("/", loginVerify, loginController.localLogin);

module.exports = router;
