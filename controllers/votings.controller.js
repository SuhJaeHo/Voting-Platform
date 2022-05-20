const Vote = require("../models/Vote");
const User = require("../models/User");
const { dateFormat } = require("../utils/dateFormat");

exports.createVoting = async(req, res, next) => {
  const { option, title, expiredTime } = req.body;
  const { _id, name } = req.user;
  const optionsArr = [];

  for (const optionName of option) {
    optionsArr.push({ [optionName]: 0 });
  }

  if (req.user) {
    try {
      const newVote = new Vote({
        creatorId: req.user._id,
        creatorName: name,
        title,
        options: optionsArr,
        expiredTime, 
      });

      newVote.save(async(err, createdVote) => {
        if (err) {
          next(err);
        } else {
          await User.findByIdAndUpdate(_id, { $push: { createdVotes: createdVote._id } }).lean();
          await res.render("index", { user: _id, votes: null, success: true });
        }
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/login");
  }
}

exports.readVoting = async(req, res, next) => {
  const voteId = req.params.id;

  const currentTime = new Date();
  await Vote.updateMany({ expiredTime: { $lt: currentTime }, isExpired: false }, { isExpired: true });

  const userId = !req.user ? undefined : req.user._id.valueOf();
  const vote = await Vote.findById(voteId).lean();
  vote.expiredTime = dateFormat(new Date(vote.expiredTime));

  try {
    if (!vote.isExpired) {
      vote.participants.includes(userId) ? res.render("vote", { userId, vote, isVoted: true }) : res.render("vote", { userId, vote, isVoted: false });
    } else {
      vote.participants.includes(userId) ? res.render("vote", { userId, vote, isVoted: true }) : res.render("vote", { userId, vote, isVoted: false });
    }
  } catch (err) {
    next(err);
  }
}

exports.completeVoting = async(req, res, next) => {
  const voteId = req.params.id;
  const userId = req.user._id.valueOf();

  const [ index, option ] = req.body.option.split(",");

  try {
    await Vote.findByIdAndUpdate(voteId, { $inc: { [`options.${index}.${option}`]: 1 }, $push: { participants: userId } }).lean();
    await User.findByIdAndUpdate(userId, { $push: { participatingVotes: voteId } }).lean();
    res.redirect(`/votings/${voteId}`);
  } catch (err) {
    next(err);
  }
}

exports.deleteVoting = async(req, res, next) => {
  const voteId = req.params.id;

  try {
    await Vote.findByIdAndDelete(voteId).lean();
    await User.findByIdAndUpdate(req.user._id, { $pull: { createdVotes: voteId }}).lean();
    res.render("vote");
  } catch (err) {
    next(err);
  }
}
