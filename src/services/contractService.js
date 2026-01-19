// src/services/contractService.js
import { ethers } from "ethers";
import { provider, wallet } from "../config/web3.js";
import dotenv from "dotenv";
dotenv.config();

// Load contract ABI and address
import fs from "fs";
const abi = JSON.parse(fs.readFileSync("src/abis/RoyaltyDistributor.json", "utf-8"));
const contractAddress = process.env.CONTRACT_ADDRESS;

// Contract instance
export const contract = new ethers.Contract(contractAddress, abi, wallet);

/**
 * Add song on-chain
 * @param {string} title
 * @param {Array<string>} contributors
 * @param {Array<number>} shares
 * @param {number} royaltyPeriodDays
 */
export const addSongOnChain = async (title, contributors, shares, royaltyPeriodDays) => {
  const tx = await contract.registerSong(title, contributors, shares, royaltyPeriodDays);
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Record payment (buy song)
 * @param {number|string} songId
 * @param {string} valueInEth
 */
export const recordPayment = async (songId, valueInEth) => {
  const tx = await contract.recordPayment(songId, { value: ethers.parseEther(valueInEth) });
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Withdraw royalty for connected wallet
 */
export const withdrawRoyalty = async () => {
  const tx = await contract.withdraw();
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Get on-chain balance for wallet
 * @param {string} walletAddress
 */
export const getBalance = async (walletAddress) => {
  const balance = await contract.getBalance(walletAddress);
  return ethers.formatEther(balance);
};
