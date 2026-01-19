// src/utils/jwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES = "7d"; // token expires in 7 days

/**
 * Generate JWT token for a user
 * @param {string} userId
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

/**
 * Middleware to protect routes
 */
export const protect = (req, res, next) => {
  let token;

  // Token in Authorization header: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    console.error("JWT error:", error);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
