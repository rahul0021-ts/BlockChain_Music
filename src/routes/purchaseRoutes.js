// src/routes/purchaseRoutes.js
import express from "express";
import {
  purchaseSong,
  myPurchases
} from "../controllers/purchaseController.js";

import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Buy song (monthly / yearly)
router.post("/:songId", authMiddleware, purchaseSong);

// My purchases
router.get("/mine", authMiddleware, myPurchases);

export default router;
