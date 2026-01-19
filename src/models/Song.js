// src/models/Song.js
import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  percentage: { type: Number, required: true }
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  date: { type: Date, default: Date.now }
});

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipfsHash: { type: String, required: true },
    priceMonthly: { type: Number, default: 0 },
    priceYearly: { type: Number, default: 0 },
    contributors: [contributorSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);
