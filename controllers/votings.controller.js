const Vote = require("../models/Vote");
const User = require("../models/User");

exports.createVoting = async(req, res, next) => {
  const { options, title, expiredTime } = req.body;
  const { _id, email } = req.user;
  const optionsArr = [];

  for (const option of options) {
    optionsArr.push({ [option]: 0 });
  }

  if (req.user) {
    try {
      const newVote = new Vote({
        creatorId: _id,
        creatorEmail: email,
        title,
        options: optionsArr,
        expiredTime, 
      });

      newVote.save(async(err, createdVote) => {
        if (err) {
          next(err);
        } else {
          // await을 안붙이면 작동이 왜 안될까?
          await User.findByIdAndUpdate(_id, { $push: { createdVotes: createdVote._id.valueOf() } }).lean();
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
  const { id } = req.params;

  const userId = req.user === undefined ? undefined : req.user._id.valueOf();
  const vote = await Vote.findById(id).lean();

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
  // 개선 필요
  const { id } = req.params;
  const [ index, option ] = req.body.option.split(",");

  // new ObjectId("").valueOf() -> _id 문자열로 추출

  try {
    await Vote.findByIdAndUpdate(id, { $inc: { [`options.${index}.${option}`]: 1 }, $push: { participants: req.user._id.valueOf() } }).lean();
    await User.findByIdAndUpdate(req.user._id, { $push: { participatingVotes: id } }).lean();
    res.redirect(`/votings/${id}`);
  } catch (err) {
    next(err);
  }
}

exports.deleteVoting = async(req, res, next) => {
  const { id } = req.params;

  try {
    await Vote.findByIdAndDelete(id).lean();
    await User.findByIdAndUpdate(req.user._id, { $pull: { createdVotes: id.valueOf() }}).lean();
    res.render("vote");
  } catch (err) {
    next(err);
  }
}
