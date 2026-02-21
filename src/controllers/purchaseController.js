import Purchase from "../models/Purchase.js";
import Song from "../models/Song.js";

/**
 * 🔹 Get song price
 * Used BEFORE MetaMask transaction
 * Route: GET /purchase/:songId/price?type=monthly
 */
export const getSongPrice = async (req, res) => {
  try {
    const { songId } = req.params;
    const { type } = req.query; // monthly or yearly

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    let price;

    if (type === "monthly") {
      price = song.monthlyPrice;
    } else if (type === "yearly") {
      price = song.yearlyPrice;
    }else {
      return res.status(400).json({ msg: "Invalid access type" });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({ msg: "Price not set for this access type" });
    }
    
    return res.json({ price });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


/**
 * 🔹 Save purchase AFTER blockchain success
 * Route: POST /purchase/:songId
 */
export const purchaseSong = async (req, res) => {
  try {
    const { accessType, txHash } = req.body;
    const { songId } = req.params;

    if (!txHash) {
      return res.status(400).json({ msg: "Transaction hash required" });
    }

    if (!accessType) {
      return res.status(400).json({ msg: "Access type required" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    // Prevent duplicate active purchase
    const existing = await Purchase.findOne({
      buyer: req.user._id,
      song: song._id,
      accessExpiresAt: { $gt: new Date() },
    });

    if (existing) {
      return res.status(400).json({ msg: "Already purchased" });
    }

    const expiryDate = new Date();

    if (accessType === "monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (accessType === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      return res.status(400).json({ msg: "Invalid access type" });
    }

    const purchase = await Purchase.create({
      buyer: req.user._id,
      song: song._id,
      accessType,
      accessExpiresAt: expiryDate,
      txHash,
    });

    return res.status(201).json({ purchase });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


/**
 * 🔹 List user's purchases
 * Route: GET /purchase/mine
 */
export const myPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      buyer: req.user._id,
    }).populate("song");

    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
