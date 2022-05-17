const Vote = require("../models/Vote");
const User = require("../models/User");

exports.createVoting = async(req, res, next) => {
  const { options, title, expiredTime } = req.body;
  const { _id, email } = req.user;

  if (req.user) {
    try {
      const newVote = new Vote({
        creatorId: _id,
        creatorEmail: email,
        title,
        options,
        expiredTime, 
      });

      newVote.save(async(err, createdVote) => {
        if (err) {
          next(err);
        } else {
          // await을 안붙이면 작동이 왜 안될까?
          await User.findByIdAndUpdate(_id, { $push: { createdVotes: createdVote._id } }).lean();
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
}
