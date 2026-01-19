// src/services/pinataService.js
import FormData from "form-data";
import { pinata } from "../config/pinata.js";

/**
 * Upload a file to Pinata IPFS
 * @param {Object} file - multer file object
 * @returns {Promise<string>} - IPFS hash
 */
export const uploadToIPFS = async (file) => {
  try {
    const data = new FormData();

    // Multer memory storage required
    data.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await pinata.post(
      "/pinning/pinFileToIPFS", // ✅ FIXED PATH
      data,
      {
        headers: {
          ...data.getHeaders(), // multipart boundary
        },
        maxBodyLength: Infinity,
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error(
      "❌ Pinata upload error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to upload file to Pinata");
  }
};
