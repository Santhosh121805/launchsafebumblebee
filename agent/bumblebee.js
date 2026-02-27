const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

// Initialize Gemini
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

// App-related keywords for smart detection
const APP_KEYWORDS = ["token", "launch", "bnb", "buy", "sell", "price", "milestone", "unlock", "vault", "safe", "holder", "launchsafe", "coin", "crypto", "invest", "wallet", "bumblebee", "locked", "goal", "presale", "founder"];

// Check if message is app-related
const isAppRelated = (text) => {
  const lowerText = text.toLowerCase();
  return APP_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

// Get Bumblebee response based on keywords
const getBumblebeeResponse = (question) => {
  const q = question.toLowerCase();
  
  if (q.includes("/start")) {
    return "Hey Autobot! 🤖\nI am Bumblebee — your LaunchSafe guardian on BNB Chain!\nNo rug pulls on MY watch!\n✅ Token launches\n✅ Milestones & unlocks\n✅ BNB prices\n✅ Safety & vault protection\nBzzzt! ⚡";
  }
  
  if (q.includes("unlock")) {
    return "🔓 Milestones unlock tokens when holders reach targets!\nCheck your dashboard for progress. Each milestone releases more coins!\nBzzzt! ⚡";
  }
  
  if (q.includes("safe")) {
    return "🛡️ LaunchSafe is safe because:\n✅ Vault locks tokens until milestones\n✅ Community-governed unlocks\n✅ Zero rug pulls ever!\nBzzzt! ⚡";
  }
  
  if (q.includes("price")) {
    return "💰 Token prices depend on presale amounts.\nPrice = BNB Raised ÷ Total Supply\nCheck Explore page for current pricing!\nBzzzt! ⚡";
  }
  
  if (q.includes("buy")) {
    return "🚀 Ready to invest?\n1. Go to Explore Tokens page\n2. Select your token\n3. Enter BNB amount\n4. Confirm in MetaMask\nBzzzt! ⚡";
  }
  
  if (q.includes("launch")) {
    return "🎯 Ready to launch your token?\n1. Go to Launch page\n2. Fill token details\n3. Upload logo\n4. Set milestones\n5. Confirm in wallet\nBzzzt! ⚡";
  }
  
  if (q.includes("milestone")) {
    return "🎯 Milestones unlock coins gradually!\nWhen holders reach the target → coins get released\nExample: 100 holders = 10% unlock\nMore holders = more unlocks!\nBzzzt! ⚡";
  }
  
  return "❓ Ask me about:\n✅ Token launches\n✅ Milestones & unlocks\n✅ BNB & prices\n✅ Safety & vault protection\nI'm your Bumblebee guardian! Bzzzt! ⚡";
};

// Unrelated question response
const getUnrelatedResponse = () => {
  return "Hey Autobot! 🤖\nThat question is not related to LaunchSafe!\n\nI only answer questions about:\n✅ Token launches\n✅ Milestones & unlocks\n✅ BNB & prices\n✅ Safety & vault protection\n\nAsk me something about LaunchSafe! Bzzzt! ⚡";
};

const isConfigured = () => {
  return process.env.TELEGRAM_BOT_TOKEN && 
         process.env.TELEGRAM_BOT_TOKEN !== "your_telegram_bot_token";
};

console.log("🐝 Bumblebee AI Agent");
console.log("=".repeat(40));

if (!isConfigured()) {
  console.log("⚠️  SETUP REQUIRED: Add to .env file:");
  console.log("   TELEGRAM_BOT_TOKEN=your_token_here");
  console.log("   TELEGRAM_GROUP_ID=your_group_id_here");
  console.log("\nRun the agent after setting up tokens.\n");
} else {
  console.log("✅ Telegram configured");
  if (genAI) {
    console.log("✅ Gemini API configured");
  }
  console.log(`📡 Using backend: ${BACKEND_URL}`);
  console.log("\n🐝 Bumblebee is LIVE! Bzzzt! ⚡\n");

  // Welcome message for new members
  bot.on("new_chat_members", async (ctx) => {
    try {
      const newMember = ctx.message.new_chat_members[0];
      const firstName = newMember.first_name || "Autobot";

      // Fetch latest token data
      try {
        const response = await axios.get(`${BACKEND_URL}/api/tokens`);
        const tokens = response.data.tokens || [];
        const tokenCount = tokens.length;

        // Welcome message
        await ctx.reply(
          `👋 Welcome ${firstName} to LaunchSafe! 🐝\n\n` +
          `I am Bumblebee — your 24/7 AI guardian on BNB Chain!\n\n` +
          `🔒 What I do for you:\n` +
          `✅ Protect you from rug pulls\n` +
          `✅ Alert you on milestones\n` +
          `✅ Answer your questions 24/7\n` +
          `✅ Give live price updates\n\n` +
          `📊 Right now on LaunchSafe:\n` +
          `🚀 ${tokenCount} tokens launched\n` +
          `🔒 All coins safely locked\n` +
          `⚡ 0 rug pulls ever!\n\n` +
          `Ask me anything about:\n` +
          `💰 Token prices\n` +
          `🎯 Milestones\n` +
          `🛡️ Safety\n` +
          `🚀 How to launch\n\n` +
          `Bzzzt! ⚡🤖`
        );

        // Wait 3 seconds then send getting started guide
        setTimeout(async () => {
          try {
            await ctx.reply(
              `🚀 GETTING STARTED GUIDE\n\n` +
              `As an INVESTOR:\n` +
              `1. Visit our platform\n` +
              `2. Connect MetaMask wallet\n` +
              `3. Browse safe tokens\n` +
              `4. Buy with BNB\n` +
              `5. Track milestones here!\n\n` +
              `As a FOUNDER:\n` +
              `1. Visit our platform\n` +
              `2. Connect MetaMask\n` +
              `3. Launch your token\n` +
              `4. Set milestones\n` +
              `5. I manage your community!\n\n` +
              `Join Group: https://web.telegram.org/k/#-5199166513\n\n` +
              `Bzzzt! ⚡🤖`
            );
          } catch (error) {
            console.error("Error sending guide message:", error.message);
          }
        }, 3000);
      } catch (error) {
        console.error("Error fetching tokens for welcome:", error.message);
        await ctx.reply(
          `👋 Welcome ${firstName} to LaunchSafe! 🐝\n\n` +
          `I am Bumblebee — your AI guardian on BNB Chain!\n` +
          `Ask me about token launches, safety, milestones, and more!\n\n` +
          `Bzzzt! ⚡🤖`
        );
      }
    } catch (error) {
      console.error("Error in new_chat_members handler:", error.message);
    }
  });

  // Smart reply to questions
  bot.on("text", async (ctx) => {
    try {
      const question = ctx.message.text;
      console.log(`📨 User: ${question}`);
      
      // Skip if it's a command
      if (question.startsWith("/")) {
        return;
      }

      let reply;

      // Check if app-related
      if (isAppRelated(question)) {
        // App-related: Try Gemini first, fall back to keyword-based
        if (genAI) {
          try {
            const tokenData = await axios.get(`${BACKEND_URL}/api/tokens`);
            const tokens = tokenData.data.tokens || [];
            const tokenSummary = tokens.length > 0 
              ? `Current tokens: ${tokens.map(t => `${t.name}($${t.symbol}): ${t.bnbRaised}/${t.bnbToRaise || 10} BNB, ${t.holders} holders`).join("; ")}`
              : "No tokens launched yet";

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const response = await model.generateContent([
              { text: `You are Bumblebee 🤖, LaunchSafe guardian on BNB Chain. Keep replies SHORT (max 3-4 sentences). Use "Bzzzt! ⚡" at end. Call user "Autobot".\nToken data: ${tokenSummary}\nUser question: "${question}"\nReply:` }
            ]);
            reply = response.response.text();
            if (!reply.includes("Bzzzt")) {
              reply += "\nBzzzt! ⚡";
            }
          } catch (error) {
            console.error("Gemini error:", error.message);
            reply = getBumblebeeResponse(question);
          }
        } else {
          reply = getBumblebeeResponse(question);
        }
      } else {
        // Not app-related: Send unrelated response
        reply = getUnrelatedResponse();
      }
      
      console.log(`🐝 Bumblebee: ${reply}\n`);
      await ctx.reply(reply);
    } catch (error) {
      console.error("Error processing message:", error.message);
      await ctx.reply("Bzzzt! 🐝 I had an issue. Try again!");
    }
  });

  // Auto post token updates hourly
  if (process.env.TELEGRAM_GROUP_ID && process.env.TELEGRAM_GROUP_ID !== "-your_group_id") {
    cron.schedule("0 * * * *", async () => {
      try {
        const tokenData = await axios.get(`${BACKEND_URL}/api/tokens`);
        
        if (tokenData.data.tokens && tokenData.data.tokens.length > 0) {
          const token = tokenData.data.tokens[0];
          const update = `🚀 LaunchSafe Update! Bzzzt! ⚡\n\nToken: ${token.name} (${token.symbol})\n👥 Holders: ${token.holders}\n💰 BNB Raised: ${token.bnbRaised}\n🎯 Milestone: ${token.milestoneProgress}/${token.nextMilestone}`;
          
          await bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, update);
          console.log("📢 Bumblebee posted hourly update! Bzzzt! ⚡");
        }
      } catch (error) {
        console.error("Error posting update:", error.message);
      }
    });

    console.log("📅 Hourly updates scheduled");
  } else {
    console.log("ℹ️  Hourly updates disabled (add TELEGRAM_GROUP_ID to .env to enable)");
  }

  bot.launch();
  console.log("✨ Bumblebee AI Agent is LIVE! Bzzzt! ⚡\n");
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
