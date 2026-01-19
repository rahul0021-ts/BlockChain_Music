// src/routes/interactionRoutes.js
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  likeSong,
  unlikeSong,
  commentSong,
  addView
} from "../controllers/interactionController.js";

const router = express.Router();

router.post("/like", authMiddleware, likeSong);
router.post("/unlike", authMiddleware, unlikeSong);
router.post("/comment", authMiddleware, commentSong);
router.post("/view", addView);

export default router;
