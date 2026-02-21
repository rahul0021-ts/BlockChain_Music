// src/services/contractService.js
import { ethers } from "ethers";
import { provider, wallet } from "../config/web3.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Load contract ABI
const abi = JSON.parse(
  fs.readFileSync("src/abis/RoyaltyDistributor.json", "utf-8")
);

const contractAddress = process.env.CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error("CONTRACT_ADDRESS not defined in environment variables");
}

// Contract instance (admin signer for backend-only actions)
export const contract = new ethers.Contract(
  contractAddress,
  abi,
  wallet
);

/**
 * Add song on-chain (Admin Only)
 * - title: string
 * - contributors: array of addresses
 * - shares: array of numbers (sum 100)
 */
export const addSongOnChain = async (title, contributors, shares) => {
  const tx = await contract.registerSong(title, contributors, shares);
  return await tx.wait();
};

/**
 * Withdraw royalty (Admin/Platform Wallet)
 */
export const withdrawRoyalty = async () => {
  const tx = await contract.withdraw();
  return await tx.wait();
};

/**
 * Get on-chain balance for wallet
 */
export const getBalance = async (walletAddress) => {
  const balance = await contract.getBalance(walletAddress);
  return ethers.formatEther(balance);
};
