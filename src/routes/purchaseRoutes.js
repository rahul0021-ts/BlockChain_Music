// src/routes/purchaseRoutes.js
import express from "express";
import {
  purchaseSong,
  myPurchases,
  getSongPrice
} from "../controllers/purchaseController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * IMPORTANT:
 * Static routes must come BEFORE dynamic routes
 */

// 🔹 My purchases
router.get("/mine", authMiddleware, myPurchases);

// 🔹 Get song price (before MetaMask payment)
router.get("/:songId/price", authMiddleware, getSongPrice);

// 🔹 Buy song (after blockchain success)
router.post("/:songId", authMiddleware, purchaseSong);

export default router;
