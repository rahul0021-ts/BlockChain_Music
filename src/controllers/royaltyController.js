// src/controllers/royaltyController.js
import Song from "../models/Song.js";
import RoyaltyEvent from "../models/RoyaltyEvent.js";

// Artist royalties
export const myRoyalties = async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.user._id });
    const royalties = await RoyaltyEvent.find({ song: { $in: songs.map(s => s._id) } });
    res.json({ totalSongs: songs.length, royaltyEvents: royalties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Withdraw royalty (blockchain)
export const withdrawRoyalties = async (req, res) => {
  try {
    const { amount, txHash } = req.body;
    if (!amount || !txHash) return res.status(400).json({ msg: "Amount & txHash required" });
    res.json({ msg: "Withdrawal successful", txHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
