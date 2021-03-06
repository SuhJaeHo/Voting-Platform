const express = require("express");
const Vote = require("../models/Vote");
const { dateFormat } = require("../utils/dateFormat");

const router = express.Router();

router.get("/", async(req, res, next) => {
  const user = req.user;
  
  try {
    const currentTime = new Date();
    await Vote.updateMany({ expiredTime: { $lt: currentTime }, isExpired: false }, { isExpired: true });

    const votes = (await Vote.find({}).lean()).map((vote) => {
      vote.expiredTime = dateFormat(new Date(vote.expiredTime));

      return vote;
    });

    res.render("index", { user, votes, success: false });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
