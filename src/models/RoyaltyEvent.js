// src/models/RoyaltyEvent.js
import mongoose from "mongoose";

const royaltyEventSchema = new mongoose.Schema(
  {
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
    wallet: { type: String, required: true },
    amount: { type: Number, required: true },
    txHash: { type: String }, // blockchain tx hash
    status: { type: String, enum: ["pending", "paid"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("RoyaltyEvent", royaltyEventSchema);
