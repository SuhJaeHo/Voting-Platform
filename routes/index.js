const express = require("express");
const Vote = require("../models/Vote");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/", checkLogin, async(req, res, next) => {
  try {
    const votes = await Vote.find({}).lean();
    res.render("index", { votes: votes });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
