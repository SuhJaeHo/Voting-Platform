const express = require("express");
const Vote = require("../models/Vote");
const checkLogin = require("../middlewares/checkLogin");
const { dateFormat } = require("../utils/dateFormat");

const router = express.Router();

router.get("/", checkLogin, async(req, res, next) => {
  try {
    const votes = (await Vote.find({}).lean()).map((vote) => {
      vote.isFinished ? vote.isFinished = "투표완료" : vote.isFinished = "투표 진행중";
      vote.expiredTime = dateFormat(new Date(vote.expiredTime));

      return vote;
    });
    res.render("index", { votes });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
