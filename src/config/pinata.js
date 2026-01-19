// src/config/pinata.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const pinata = axios.create({
  baseURL: "https://api.pinata.cloud",
  headers: {
    pinata_api_key: process.env.PINATA_API_KEY,
    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
  },
});
