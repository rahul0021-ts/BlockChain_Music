// src/routes/royaltyRoutes.js
import express from "express";
import {
  myRoyalties,
  withdrawRoyalties
} from "../controllers/royaltyController.js";

import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

// View royalties
router.get("/mine", authMiddleware, myRoyalties);

// Withdraw
router.post("/withdraw", authMiddleware, withdrawRoyalties);

export default router;
