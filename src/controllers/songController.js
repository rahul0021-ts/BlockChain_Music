// src/controllers/songController.js
import Song from "../models/Song.js";
import Purchase from "../models/Purchase.js";
import { uploadToIPFS } from "../services/pinataService.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
/**
 * UPLOAD SONG
 */
export const uploadSong = async (req, res) => {
  try {
    const { title, monthlyPrice, yearlyPrice } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Audio file required" });
    }

    const ipfsHash = await uploadToIPFS(req.file);

    const song = await Song.create({
      title,
      artist: req.user._id,
      ipfsHash,
      prices: {
        monthly: Number(monthlyPrice),
        yearly: Number(yearlyPrice)
      }
    });

    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/**
 * GET ALL SONGS
 */
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate("artist", "name");

    const formattedSongs = songs.map(song => ({
      ...song.toObject(),
      likes: song.likes.length // ✅ convert array → count
    }));

    res.json(formattedSongs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * SEARCH SONGS
 */
export const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;

    const songs = await Song.find({
      title: { $regex: q || "", $options: "i" }
    }).populate("artist", "name");

    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

/**
 * PREVIEW SONG (10 seconds)
 * Frontend will stop playback at 10s
 */
export const previewSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    const ipfsURL = `${process.env.PINATA_GATEWAY_URL}/ipfs/${song.ipfsHash}`;

    const response = await axios.get(ipfsURL, {
      responseType: "stream",
      headers: {
        Accept: "audio/*", // ✅ tell gateway we want audio
      },
    });

    // ✅ REQUIRED for HTML5 <audio>
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "no-store");

    response.data.pipe(res);
  } catch (err) {
    console.error("Preview failed:", err.message);
    res.status(500).json({ message: "Preview failed" });
  }
};


/**
 * STREAM FULL SONG (Purchased only)
 */
export const streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    const purchase = await Purchase.findOne({
      buyer: req.user._id,
      song: song._id,
      accessExpiresAt: { $gt: new Date() }
    });

    if (!purchase) {
      return res.status(403).json({ message: "Purchase required" });
    }

    const ipfsURL = `${process.env.PINATA_GATEWAY_URL}/ipfs/${song.ipfsHash}`;
    const response = await axios.get(ipfsURL, { responseType: "stream" });

    res.setHeader("Content-Type", "audio/mpeg");
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Streaming failed" });
  }
};

/**
 * GET MY SONGS (Uploaded by logged-in artist)
 */
export const getMySongs = async (req, res) => {
  try {
    const userId = req.user._id;
    const songs = await Song.find({ artist: userId });
    res.json({ songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your songs" });
  }
};
