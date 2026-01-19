// src/config/web3.js
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

export const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);

// Wallet with provider
export const wallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);

console.log(`✅ Wallet loaded: ${wallet.address}`);
