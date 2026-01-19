// src/controllers/interactionController.js
import Song from "../models/Song.js";

/**
 * LIKE SONG
 */
export const likeSong = async (req, res) => {
  try {
    const { songId } = req.body;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    if (!song.likes.includes(req.user._id)) {
      song.likes.push(req.user._id);
      await song.save();
    }

    res.json({ message: "Song liked", likes: song.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Like failed" });
  }
};

/**
 * UNLIKE SONG
 */
export const unlikeSong = async (req, res) => {
  try {
    const { songId } = req.body;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    song.likes = song.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await song.save();
    res.json({ message: "Song unliked", likes: song.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Unlike failed" });
  }
};

/**
 * COMMENT SONG
 */
export const commentSong = async (req, res) => {
  try {
    const { songId, text } = req.body;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    song.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });

    await song.save();
    res.json({ message: "Comment added", comments: song.comments });
  } catch (error) {
    res.status(500).json({ message: "Comment failed" });
  }
};

/**
 * ADD VIEW
 */
export const addView = async (req, res) => {
  try {
    const { songId } = req.body;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    song.views += 1;
    await song.save();

    res.json({ message: "View added", views: song.views });
  } catch (error) {
    res.status(500).json({ message: "View failed" });
  }
};
