// src/controllers/songController.js

import Song from "../models/Song.js";
import Purchase from "../models/Purchase.js";
import { uploadToIPFS } from "../services/pinataService.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * UPLOAD SONG
 * Option 1: backend-only upload, no blockchain tokenId required
 */
export const uploadSong = async (req, res) => {
  try {
    const { title, monthlyPrice, yearlyPrice, contributors } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Audio file required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Song title required" });
    }

    // Upload file to IPFS (Pinata)
    const ipfsHash = await uploadToIPFS(req.file);

    // Save song in database
    const song = await Song.create({
      title,
      artist: req.user._id,
      ipfsHash,
      monthlyPrice: Number(monthlyPrice) || 0,
      yearlyPrice: Number(yearlyPrice) || 0,
      contributors: contributors
        ? contributors.split(",").map((c) => c.trim())
        : [],
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

    const formattedSongs = songs.map((song) => ({
      ...song.toObject(),
      likes: song.likes.length, // convert array → count
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
      title: { $regex: q || "", $options: "i" },
    }).populate("artist", "name");

    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

/**
 * PREVIEW SONG (10 seconds) - WITH RANGE SUPPORT
 */
export const previewSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const ipfsURL = `${process.env.PINATA_GATEWAY_URL}/ipfs/${song.ipfsHash}`;

    const response = await axios.get(ipfsURL, {
      responseType: "stream",
    });

    res.set({
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
    });

    response.data.pipe(res);
  } catch (err) {
    console.error("Preview failed:", err.message);
    res.status(500).json({ message: "Preview failed" });
  }
};

/**
 * STREAM FULL SONG (Purchased only) - WITH RANGE SUPPORT FOR INSTANT PLAYBACK
 */
export const streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song)
      return res.status(404).json({ message: "Song not found" });

    const purchase = await Purchase.findOne({
      buyer: req.user._id,
      song: song._id,
      accessExpiresAt: { $gt: new Date() },
    });

    if (!purchase) {
      return res.status(403).json({ message: "Purchase required" });
    }

    const ipfsURL = `${process.env.PINATA_GATEWAY_URL}/ipfs/${song.ipfsHash}`;

    const range = req.headers.range;

    const response = await axios.get(ipfsURL, {
      responseType: "stream",
      headers: range ? { Range: range } : {},
    });

    // Use status from IPFS (200 or 206)
    res.status(response.status);

    res.set({
      "Content-Type":
        response.headers["content-type"] || "audio/mpeg",
      "Content-Length": response.headers["content-length"],
      "Content-Range": response.headers["content-range"],
      "Accept-Ranges": "bytes",
    });

    response.data.pipe(res);
  } catch (err) {
    console.error(
      "Streaming failed:",
      err.response?.data || err.message
    );
    res
      .status(err.response?.status || 500)
      .json({ message: "Streaming failed" });
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
    res
      .status(500)
      .json({ message: "Failed to fetch your songs" });
  }
};