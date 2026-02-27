const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalSupply: {
      type: Number,
      required: true,
    },
    founder: {
      type: String,
      required: true,
    },
    holders: {
      type: Number,
      default: 1,
    },
    bnbRaised: {
      type: Number,
      default: 0,
    },
    bnbToRaise: {
      type: Number,
      default: 10,
    },
    nextMilestone: {
      type: Number,
      default: 2,
    },
    milestoneProgress: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
