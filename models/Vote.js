const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  creator: { type: String, required: true },
  participants: { type: Array, default: [] },
  title: { type: String, required: true },
  options: { type: Array },
  expiredDate: { type: Date, required: true },
  isFinished: { type: Boolean, default: false },
});

module.exports = mongoose.model("Vote", voteSchema);