# Step-by-Step Commands to Run Immediately 🚀

Run these commands one by one in order. Open VS Code terminal and paste each command.

## ✅ STEP 1: Install Node.js

If you don't have Node.js 18+:
1. Go to https://nodejs.org
2. Download LTS version
3. Run installer, click Next until done
4. Restart VS Code

**Verify:**
```bash
node --version
npm --version
```

---

## ✅ STEP 2: Install Hardhat

Open VS Code terminal in your project folder and run:

```bash
npm install
```

This installs everything from package.json including Hardhat and all dependencies.

---

## ✅ STEP 3: Get Private Key from MetaMask

1. Open MetaMask extension
2. Click your account icon (top right)
3. Click "Settings"
4. Click "Security & Privacy"
5. Scroll down to "Show Private Key"
6. Enter your password
7. Copy the private key (looks like: 0x123abc...)
8. **KEEP IT SECRET - NEVER SHARE!**

---

## ✅ STEP 4: Create .env File

Open your `.env` file in VS Code and fill in:

```env
PRIVATE_KEY=paste_your_private_key_here
BSCSCAN_API_KEY=get_from_bscscan.com
OPENAI_API_KEY=get_from_openai.com
TELEGRAM_BOT_TOKEN=get_from_botfather
TELEGRAM_GROUP_ID=get_from_your_group
MONGODB_URL=mongodb_connection_string
BACKEND_URL=http://localhost:3001
FACTORY_ADDRESS=will_get_after_deploy
```

**Getting API Keys:**

### Get OpenAI Key:
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy it to `.env` OPENAI_API_KEY=

### Get Telegram Bot Token:
1. Open Telegram and search "BotFather"
2. Type `/newbot`
3. Follow instructions
4. Copy token to `.env` TELEGRAM_BOT_TOKEN=

### Get BSCScan Key:
1. Go to https://bscscan.com
2. Create account
3. Click your profile → API-KEYs
4. Create new key
5. Copy to `.env` BSCSCAN_API_KEY=

### Get Telegram Group ID:
1. Add bot to your Telegram group
2. Send a message in the group
3. Go to https://api.telegram.org/bot[YOUR_TOKEN]/getUpdates
4. Look for "chat": {"id": -123456789}
5. Copy that number to `.env` TELEGRAM_GROUP_ID=

---

## ✅ STEP 5: Get Free Test BNB

You need BNB to pay for gas (transaction fees):

1. Open your MetaMask wallet
2. Make sure you're on **BNB Testnet** network
   - Click network selector (top center)
   - Click "Add Network" if not listed
   - Use name: "BNB Testnet"
   - RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
   - Chain ID: `97`
   - Currency: `BNB`

3. Copy your wallet address from MetaMask
4. Go to: https://testnet.bnbchain.org/faucet-smart
5. Paste your address
6. Click "Give me BNB"
7. Wait ~10 seconds
8. You'll see 0.5 BNB in your wallet ✅

---

## ✅ STEP 6: Deploy Smart Contracts

Run this command:

```bash
npm run deploy
```

**You'll see output like:**
```
TokenFactory deployed to: 0xabcd1234...
Vault deployed to: 0xefgh5678...
```

**COPY THESE ADDRESSES!** You need them for the backend.

---

## ✅ STEP 7: Update .env with Contract Addresses

Edit your `.env` file and add:

```env
FACTORY_ADDRESS=0xabcd1234...
```

(Use the address you got from Step 6)

---

## ✅ STEP 8: Start Backend Server

**Open new terminal** (don't close the current one) and run:

```bash
npm run backend
```

You'll see:
```
🚀 LaunchSafe Backend running on http://localhost:3001
📡 Connected to BNB Testnet
👛 Wallet: 0x...
```

✅ Backend is running!

---

## ✅ STEP 9: Start Bumblebee AI Agent

**Open another new terminal** and run:

```bash
npm run agent
```

It will show:
```
✅ API keys configured
📡 Using backend: http://localhost:3001
✨ Bumblebee AI Agent is LIVE! Bzzzt! ⚡
```

✅ Bumblebee is running!

---

## ✅ STEP 10: Start Frontend

**Open another new terminal** and run:

```bash
npm run dev
```

You'll see:
```
VITE v5.4.19 ready in XX ms
Local: http://localhost:5173
```

Click the link or go to http://localhost:5173

✅ Everything is running!

---

## 🧪 Test Launch a Token

### Option 1: Use Frontend UI
1. Open http://localhost:5173
2. Fill in token name, symbol, supply
3. Click "Launch Token"
4. Wait for transaction
5. See your token on the blockchain!

### Option 2: Use API
```bash
curl -X POST http://localhost:3001/api/launch \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestToken",
    "symbol": "TEST",
    "supply": 1000000
  }'
```

You'll get:
```json
{
  "success": true,
  "txHash": "0x...",
  "message": "Token launched on BNB Testnet successfully! Bzzzt! ⚡"
}
```

---

## 📊 Check Your Contract on BSCScan

1. Go to: https://testnet.bscscan.com
2. Paste your contract address (from Step 6)
3. See your contract live on blockchain!
4. View all transactions
5. Verify your contract code (optional)

---

## 🐝 Test Bumblebee

Send your Bumblebee bot a message on Telegram:

```
"How many tokens have been launched?"
```

Bumblebee will reply with AI-generated response about your tokens! Bzzzt! ⚡

---

## ❌ Troubleshooting

### "Cannot find module 'hardhat'"
```bash
npm install
npm run deploy
```

### "Invalid private key"
- Check your .env file
- Make sure PRIVATE_KEY is correct
- No spaces before or after

### "Insufficient balance"
- Go to testnet faucet again
- Get more free BNB
- https://testnet.bnbchain.org/faucet-smart

### "Connection timeout"
- Check internet connection
- BNB RPC might be down
- Use this fallback: `https://bsc-testnet.publicnode.com`

### "Backend not running on port 3001"
- Kill process: `netstat -ano | findstr :3001`
- Delete node_modules and reinstall
- Change port in backend/server.js

### "No token data showing"
- Make sure backend is running
- Make sure FACTORY_ADDRESS is in .env
- Deploy new contract: `npm run deploy`

---

## ✅ Success Checklist

- [ ] Node.js installed (node --version shows v18+)
- [ ] .env file filled with all API keys
- [ ] Test BNB received in MetaMask wallet
- [ ] Contracts deployed (got addresses)
- [ ] Backend running on localhost:3001
- [ ] Bumblebee running (Telegram bot responding)
- [ ] Frontend running on localhost:5173
- [ ] Token deployed successfully
- [ ] Token visible on BSCScan
- [ ] Bumblebee replied to message

---

## 🚀 What's Next?

1. ✅ Launch more test tokens
2. ✅ Test milestone unlocking
3. ✅ Customize frontend UI
4. ✅ Add more features to Bumblebee
5. ✅ Deploy to BNB Mainnet when ready
   - Change network in hardhat.config.js
   - Use `npm run deploy-mainnet`
   - Requires real BNB (not test BNB!)

---

## 🎁 Commands Reference

```bash
# Frontend
npm run dev              # Start frontend on localhost:5173
npm run build           # Build for production
npm run lint            # Check code quality

# Blockchain
npm run deploy          # Deploy to testnet
npm run deploy-mainnet  # Deploy to mainnet

# Services
npm run backend         # Start backend on localhost:3001
npm run agent           # Start Bumblebee AI agent

# Quick deploy + backend + agent
npm run deploy && npm run backend
```

---

**🐝 Bzzzt! ⚡ Happy Launching! 🚀**

Built with Hardhat, React, and BNB Chain
