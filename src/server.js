import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import royaltyRoutes from "./routes/royaltyRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

// Load env vars
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Web3 Music Backend Running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/royalties", royaltyRoutes);
app.use("/api/interactions", interactionRoutes);

// Error handler (must be last)
app.use(errorMiddleware);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);
