// src/models/Song.js
import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  percentage: { type: Number, required: true },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
  date: { type: Date, default: Date.now },
});

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ipfsHash: { type: String, required: true },

    // ✅ Make tokenId optional for backend-only upload
    tokenId: {
      type: Number,
      required: false,
    },

    // ✅ STANDARDIZED PRICING (optional)
    monthlyPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    yearlyPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ✅ Contributors optional, array of objects
    contributors: {
      type: [contributorSchema],
      default: [],
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    comments: [commentSchema],

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);
