const Vote = require("../models/Vote");
const User = require("../models/User");

exports.getMyVoting = async(req, res, next) => {
  const userId = req.user._id;
  
  const votesId = await User.findById(userId).select("createdVotes").lean();
}
