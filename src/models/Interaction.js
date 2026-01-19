// src/models/Interaction.js
import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment", "view"], required: true },
    content: { type: String } // used for comments
  },
  { timestamps: true }
);

export default mongoose.model("Interaction", interactionSchema);
