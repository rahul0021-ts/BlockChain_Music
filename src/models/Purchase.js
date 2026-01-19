// src/models/Purchase.js
import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
    accessType: { type: String, enum: ["monthly", "yearly"], required: true },
    accessExpiresAt: { type: Date, required: true },
    txHash: { type: String } // ETH transaction hash
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
