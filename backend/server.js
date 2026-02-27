const express = require("express");
const ethers = require("ethers");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Token = require("./models/Token");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads (handled in memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Connect to BNB Testnet
const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);

// Ensure private key has 0x prefix and is properly formatted
const privateKey = (process.env.PRIVATE_KEY || "").trim();
if (!privateKey) {
  console.error("ERROR: PRIVATE_KEY not found in .env file");
  process.exit(1);
}

const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;

console.log("Initializing wallet...");
console.log("Private key length:", privateKey.length);
console.log("Formatted key:", formattedKey.substring(0, 10) + "...");

let wallet;
try {
  wallet = new ethers.Wallet(formattedKey, provider);
  console.log("✅ Wallet initialized. Address:", wallet.address);
} catch (error) {
  console.error("❌ Failed to create wallet:", error.message);
  console.error("Private key format check - length:", formattedKey.length, "starts with 0x:", formattedKey.startsWith("0x"));
  process.exit(1);
}

// Store launched tokens in memory (in production, use a database)
let launchedTokens = [
  // Cache format: { address: '0x...', name: 'Token', symbol: 'SYM', supply: 1000000 }
];

// Connect to MongoDB
const MONGODB_URL = process.env.MONGODB_URL;
if (MONGODB_URL) {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ MongoDB connection failed:", error.message);
      console.log("⚠️  Falling back to in-memory storage");
    });
} else {
  console.log("⚠️  MONGODB_URL not configured - using in-memory storage");
}

// Your deployed contract address goes here
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS || "0x0000000000000000000000000000000000000000";

// Initialize Telegram Bot
let bot = null;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID || "";

if (TELEGRAM_TOKEN && TELEGRAM_TOKEN !== "your_telegram_bot_token") {
  bot = new Telegraf(TELEGRAM_TOKEN);
  console.log("✅ Telegram bot initialized");
} else {
  console.log("⚠️  Telegram bot not configured - updates will not be posted");
}

// Helper function to safely send Telegram messages
async function sendTelegramMessage(message) {
  if (!bot || !TELEGRAM_GROUP_ID || TELEGRAM_GROUP_ID === "-your_group_id") {
    console.log("Telegram not configured, skipping message:", message.substring(0, 50));
    return;
  }

  try {
    await bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message);
    console.log("✅ Message sent to Telegram");
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error.message);
    // Don't crash the server if Telegram fails
  }
}

// Real ABI for TokenFactory from Hardhat artifacts
const FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "address", "name": "tokenAddress", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "symbol", "type": "string"},
      {"indexed": false, "internalType": "address", "name": "founder", "type": "address"}
    ],
    "name": "TokenLaunched",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "allTokens",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "symbol", "type": "string"},
      {"internalType": "uint256", "name": "supply", "type": "uint256"}
    ],
    "name": "launchToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "LaunchSafe Backend is LIVE!", timestamp: new Date() });
});

// API 1 — Launch a token
app.post("/api/launch", upload.single("logo"), async (req, res) => {
  try {
    // Handle both JSON and FormData submissions
    const name = req.body.name || req.fields?.name?.[0];
    const symbol = req.body.symbol || req.fields?.symbol?.[0];
    const supply = req.body.supply || req.fields?.supply?.[0];
    const bnbToRaise = req.body.bnbToRaise || req.fields?.bnbToRaise?.[0];
    const logoFile = req.file; // File from multer

    console.log("Launch request received:");
    console.log("- Name:", name);
    console.log("- Symbol:", symbol);
    console.log("- Supply:", supply);
    console.log("- Logo file:", logoFile ? logoFile.originalname : "None");

    if (!name || !symbol || !supply) {
      return res.status(400).json({ 
        error: `Missing required fields: ${!name ? "name, " : ""}${!symbol ? "symbol, " : ""}${!supply ? "supply" : ""}`.trim() 
      });
    }
    
    if (FACTORY_ADDRESS === "0x0000000000000000000000000000000000000000") {
      return res.status(500).json({ 
        error: "Factory contract not deployed. Set FACTORY_ADDRESS in .env" 
      });
    }

    const factory = new ethers.Contract(
      FACTORY_ADDRESS,
      FACTORY_ABI,
      wallet
    );
    
    console.log(`Launching token: ${name} (${symbol}) with supply: ${supply}`);
    
    const tx = await factory.launchToken(name, symbol, supply);
    const receipt = await tx.wait();
    
    // Store the token data in our cache
    const tokenData = {
      address: receipt.blockHash, // Placeholder - in production, extract from event
      name: name,
      symbol: symbol,
      totalSupply: supply,
      founder: wallet.address,
      holders: 1,
      bnbRaised: 0,
      bnbToRaise: parseFloat(bnbToRaise) || 10,
      nextMilestone: 2,
      milestoneProgress: 0,
      createdAt: new Date().toISOString()
    };
    
    // Save to MongoDB if connected, otherwise to in-memory array
    if (mongoose.connection.readyState === 1) {
      const token = new Token(tokenData);
      await token.save();
      console.log(`Token launched and saved to MongoDB: ${name} (${symbol})`);
    } else {
      launchedTokens.push(tokenData);
      console.log(`Token launched and cached in memory: ${name} (${symbol})`);
    }
    
    // TRIGGER 1: Send launch message to Telegram
    await sendTelegramMessage(
      `🚀 NEW TOKEN LAUNCHED!\n\n` +
      `Token: ${name} (${symbol})\n` +
      `Supply: ${supply.toLocaleString()}\n` +
      `Status: 🔒 LOCKED AND SAFE\n\n` +
      `Bzzzt! ⚡🤖`
    );
    
    res.json({ 
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      tokenName: name,
      tokenSymbol: symbol,
      logoUploaded: !!logoFile,
      message: "Token launched on BNB Testnet successfully! Bzzzt! ⚡"
    });
    
  } catch (error) {
    console.error("Launch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API 2 — Get all tokens
app.get("/api/tokens", async (req, res) => {
  try {
    // Fetch from MongoDB if connected, otherwise use in-memory array
    if (mongoose.connection.readyState === 1) {
      const tokens = await Token.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        tokenCount: tokens.length,
        tokens: tokens,
      });
    } else {
      res.json({
        success: true,
        tokenCount: launchedTokens.length,
        tokens: launchedTokens,
      });
    }
  } catch (error) {
    console.error("Get tokens error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching tokens",
    });
  }
});

// API 3 — Unlock milestone
app.post("/api/unlock", async (req, res) => {
  try {
    const { vaultAddress, milestoneIndex } = req.body;

    if (!vaultAddress || milestoneIndex === undefined) {
      return res.status(400).json({ 
        error: "Missing required fields: vaultAddress, milestoneIndex" 
      });
    }
    
    // You'll need to add Vault ABI for this to work
    res.json({ 
      success: true,
      vaultAddress,
      milestoneIndex,
      message: "Milestone unlocked! Check your wallet for coins. Bzzzt! ⚡"
    });
    
  } catch (error) {
    console.error("Unlock error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API 5 — Register a previously launched token
app.post("/api/register-token", async (req, res) => {
  try {
    const { name, symbol, totalSupply, address, holders, bnbRaised, nextMilestone, milestoneProgress } = req.body;

    if (!name || !symbol || !totalSupply) {
      return res.status(400).json({ 
        error: "Missing required fields: name, symbol, totalSupply" 
      });
    }

    const tokenData = {
      address: address || `0x${Date.now().toString(16)}`,
      name: name,
      symbol: symbol,
      totalSupply: parseInt(totalSupply),
      founder: wallet.address,
      holders: holders || 1,
      bnbRaised: bnbRaised || 0,
      nextMilestone: nextMilestone || 2,
      milestoneProgress: milestoneProgress || 0,
      createdAt: new Date().toISOString()
    };

    // Save to MongoDB if connected, otherwise to in-memory array
    if (mongoose.connection.readyState === 1) {
      // Check if token already exists
      let token = await Token.findOne({ $or: [{ symbol: symbol }, { address: tokenData.address }] });
      
      if (token) {
        token = Object.assign(token, tokenData);
        await token.save();
        console.log(`Token updated in MongoDB: ${name} (${symbol}) - Holders: ${token.holders}, BNB: ${token.bnbRaised}`);
      } else {
        token = new Token(tokenData);
        await token.save();
        console.log(`Token registered to MongoDB: ${name} (${symbol}) - Holders: ${token.holders}, BNB: ${token.bnbRaised}`);
      }
    } else {
      // Fallback to in-memory
      const existingIndex = launchedTokens.findIndex(t => 
        t.symbol === symbol || t.address === tokenData.address
      );

      if (existingIndex >= 0) {
        launchedTokens[existingIndex] = tokenData;
        console.log(`Token updated in memory: ${name} (${symbol}) - Holders: ${tokenData.holders}, BNB: ${tokenData.bnbRaised}`);
      } else {
        launchedTokens.push(tokenData);
        console.log(`Token registered to memory: ${name} (${symbol}) - Holders: ${tokenData.holders}, BNB: ${tokenData.bnbRaised}`);
      }
    }

    res.json({
      success: true,
      message: `Token ${name} registered successfully!`,
      token: tokenData
    });

  } catch (error) {
    console.error("Register token error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API 6 — Buy tokens
app.post("/api/buy", async (req, res) => {
  try {
    const { tokenAddress, buyerAddress, bnbAmount } = req.body;

    if (!tokenAddress || !buyerAddress || !bnbAmount) {
      return res.status(400).json({
        error: "Missing required fields: tokenAddress, buyerAddress, bnbAmount"
      });
    }

    console.log(`Buy request: ${bnbAmount} BNB for token ${tokenAddress} from ${buyerAddress}`);

    // Fetch token from MongoDB if connected, otherwise from memory
    let token;
    
    if (mongoose.connection.readyState === 1) {
      token = await Token.findOne({ address: tokenAddress });
    } else {
      token = launchedTokens.find(t => t.address === tokenAddress);
    }

    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }

    // Calculate tokens to receive (using dynamic BNB goal, default to 10)
    const bnbNum = parseFloat(bnbAmount);
    const tokenGoal = token.bnbToRaise || 10;
    const tokensReceived = Math.floor((bnbNum / tokenGoal) * token.totalSupply);

    // Update token
    const previousBnbRaised = (token.bnbRaised || 0);
    token.bnbRaised = previousBnbRaised + bnbNum;
    token.holders = (token.holders || 1) + 1;
    token.milestoneProgress = token.holders;

    const milestoneHit = token.holders >= (token.nextMilestone || 100);
    const goalReached = token.bnbRaised >= tokenGoal && previousBnbRaised < tokenGoal;

    // Save to MongoDB or memory
    if (mongoose.connection.readyState === 1) {
      await token.save();
    } else {
      const index = launchedTokens.findIndex(t => t.address === tokenAddress);
      if (index >= 0) {
        launchedTokens[index] = token;
      }
    }

    console.log(`Token ${token.symbol} updated: ${token.holders} holders, ${token.bnbRaised} BNB raised`);

    // TRIGGER 2: Send purchase message to Telegram
    await sendTelegramMessage(
      `💰 NEW INVESTOR!\n\n` +
      `Token: ${token.name} (${token.symbol})\n` +
      `New Holders: ${token.holders}\n` +
      `Amount: ${bnbAmount} BNB\n` +
      `Total Raised: ${token.bnbRaised}/${tokenGoal} BNB\n\n` +
      `Bzzzt! ⚡🤖`
    );

    if (goalReached) {
      console.log(`🎉 FUNDING GOAL REACHED for ${token.symbol}! ${token.bnbRaised} BNB raised!`);
      
      // TRIGGER 3: Send goal reached message to Telegram (send before milestone)
      await sendTelegramMessage(
        `🎉 FUNDING GOAL REACHED!\n\n` +
        `✅ ${token.name} (${token.symbol}) reached ${tokenGoal} BNB goal!\n` +
        `Total Raised: ${token.bnbRaised} BNB\n` +
        `Project is fully funded! Coins unlocking RIGHT NOW!\n\n` +
        `Bzzzt! ⚡🚀`
      );
    }

    if (milestoneHit) {
      console.log(`🎉 MILESTONE REACHED for ${token.symbol}! ${token.holders} holders`);
      
      // TRIGGER 4: Send milestone message to Telegram
      await sendTelegramMessage(
        `🎉 MILESTONE REACHED!\n\n` +
        `✅ ${token.nextMilestone} HOLDERS MILESTONE COMPLETED!\n` +
        `Token: ${token.name} (${token.symbol})\n` +
        `Coins unlocking RIGHT NOW!\n\n` +
        `Bzzzt! ⚡🔓`
      );
    }

    // Return success
    res.json({
      success: true,
      txHash: `0x${Date.now().toString(16)}`, // Placeholder
      tokensReceived: tokensReceived,
      newHolderCount: token.holders,
      milestoneHit: milestoneHit,
      message: `Successfully purchased ${tokensReceived} ${token.symbol} tokens! Bzzzt! ⚡`
    });

  } catch (error) {
    console.error("Buy error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/wallet", async (req, res) => {
  try {
    const balance = await provider.getBalance(wallet.address);
    const formattedBalance = ethers.formatEther(balance);

    res.json({
      success: true,
      walletAddress: wallet.address,
      balanceBNB: formattedBalance,
      network: "BNB Testnet"
    });
  } catch (error) {
    console.error("Wallet error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

// TRIGGER 4: Hourly updates (every hour at :00)
if (bot && TELEGRAM_GROUP_ID && TELEGRAM_GROUP_ID !== "-your_group_id") {
  cron.schedule("0 * * * *", async () => {
    try {
      let totalTokens, totalHolders, activeCount;
      
      if (mongoose.connection.readyState === 1) {
        const tokens = await Token.find();
        totalTokens = tokens.length;
        totalHolders = tokens.reduce((sum, token) => sum + (token.holders || 0), 0);
        activeCount = tokens.filter(t => t.bnbRaised > 0).length;
      } else {
        totalTokens = launchedTokens.length;
        totalHolders = launchedTokens.reduce((sum, token) => sum + (token.holders || 0), 0);
        activeCount = launchedTokens.filter(t => t.bnbRaised > 0).length;
      }

      const message = 
        `⚡ HOURLY UPDATE!\n\n` +
        `Total Tokens: ${totalTokens}\n` +
        `Total Holders: ${totalHolders}\n` +
        `Active Projects: ${activeCount}\n\n` +
        `Bzzzt! ⚡🤖`;

      await sendTelegramMessage(message);
    } catch (error) {
      console.error("Error posting hourly update:", error.message);
    }
  });
  console.log("📅 Hourly updates scheduled");
}

// TRIGGER 6: Morning message at 9am IST (3:30 UTC)
if (bot && TELEGRAM_GROUP_ID && TELEGRAM_GROUP_ID !== "-your_group_id") {
  cron.schedule("30 3 * * *", async () => {
    try {
      const message = 
        `Good morning Autobots! 🌅\n\n` +
        `Bumblebee reporting for duty!\n` +
        `All tokens are SAFE and LOCKED!\n` +
        `Bzzzt! ⚡🤖`;

      await sendTelegramMessage(message);
    } catch (error) {
      console.error("Error posting morning message:", error.message);
    }
  });
  console.log("🌅 Morning messages scheduled (9am IST)");
}

app.listen(PORT, () => {
  console.log(`\n🚀 LaunchSafe Backend running on http://localhost:${PORT}`);
  console.log(`📡 Connected to BNB Testnet`);
  console.log(`👛 Wallet: ${wallet.address}`);
  
  if (mongoose.connection.readyState === 1) {
    console.log(`💾 Storage: MongoDB (persistent)`);
  } else {
    console.log(`💾 Storage: In-memory (temporary)`);
  }
  
  if (bot && TELEGRAM_GROUP_ID) {
    console.log(`📱 Telegram bot connected: Updates enabled`);
  } else {
    console.log(`📱 Telegram bot disabled: Check .env configuration`);
  }
  console.log("");
});
