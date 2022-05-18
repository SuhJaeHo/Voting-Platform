const Vote = require("../models/Vote");
const User = require("../models/User");
const { dateFormat } = require("../utils/dateFormat");

exports.getMyVoting = async(req, res, next) => {
  const userId = req.user._id;
  
  const createdVotes = await Vote.find({ creatorId: userId }).lean();
  
  for (const vote of createdVotes) {
    vote.expiredTime = dateFormat(new Date(vote.expiredTime));
    vote.isExpired ? vote.isExpired = "투표완료" : vote.isExpired = "투표 진행중";
  }

  res.render("myVotes", { createdVotes });
}
