// src/controllers/purchaseController.js
import Purchase from "../models/Purchase.js";
import Song from "../models/Song.js";

// Buy song (monthly / yearly)
export const purchaseSong = async (req, res) => {
  try {
    const { accessType, txHash } = req.body;
    const { songId } = req.params;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ msg: "Song not found" });

    const expiryDate = new Date();
    if (accessType === "monthly") expiryDate.setMonth(expiryDate.getMonth() + 1);
    else if (accessType === "yearly") expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    else return res.status(400).json({ msg: "Invalid access type" });

    const purchase = await Purchase.create({
      buyer: req.user._id,
      song: song._id,
      accessType,
      accessExpiresAt: expiryDate,
      txHash
    });

    res.status(201).json({ purchase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// List user's purchases
export const myPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user._id })
      .populate("song");
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
