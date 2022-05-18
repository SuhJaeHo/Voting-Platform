const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  creatorEmail: { type: String, required: true },
  participants: { type: Array, default: [] },
  title: { type: String, required: true },
  options: { type: Array },
  isExpired: { type: Boolean, default: false },
  expiredTime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Vote", voteSchema);
