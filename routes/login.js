const express = require("express");
const loginController = require("../controllers/login.controller");

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.render("login", { message: null, from: req.headers.referer });
  } catch (err) {
    next(err);
  }
});

router.post("/", loginController.localLogin);

module.exports = router;
