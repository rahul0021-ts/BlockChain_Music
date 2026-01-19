// src/routes/songRoutes.js
import express from "express";
import {
  uploadSong,
  getAllSongs,
  searchSongs,
  previewSong,
  streamSong,
  getMySongs, // <-- imported here
} from "../controllers/songController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Upload song (artist)
router.post(
  "/upload",
  authMiddleware,
  upload.single("song"),
  uploadSong
);

// Discover
router.get("/", getAllSongs);
router.get("/search", searchSongs);

// My songs (artist only)
router.get("/my", authMiddleware, getMySongs); // <-- added route

// Streaming
router.get("/:id/preview", previewSong); // free 10s
router.get("/:id/stream", authMiddleware, streamSong); // paid only

export default router;
