# 🚀 QUICK REFERENCE - Exact Commands to Run

## 👉 First Time Setup (Do These Once)

```bash
# 1. Install dependencies (including Hardhat)
npm install

# 2. Get test BNB (go to link, takes 10 seconds)
# https://testnet.bnbchain.org/faucet-smart
# Paste your MetaMask wallet address

# 3. Update .env file with:
#    - PRIVATE_KEY (from MetaMask)
#    - OPENAI_API_KEY (from OpenAI)
#    - TELEGRAM_BOT_TOKEN (from BotFather)
#    - BSCSCAN_API_KEY (from BSCScan)

# 4. Deploy contracts to BNB Testnet
npm run deploy

# 5. Copy "TokenFactory deployed to: 0x..." address
# 6. Paste into .env as FACTORY_ADDRESS=0x...
```

---

## 🔄 Development Loop (Run These Every Time)

### 🖥️ Terminal 1 - Contracts & Deploy
```bash
npm run deploy
# Deploys latest contract changes to testnet
# Shows deployed addresses
```

### 🌐 Terminal 2 - Backend API Server
```bash
npm run backend
# http://localhost:3001
# Runs the Express API server
```

### 🤖 Terminal 3 - Bumblebee AI Agent
```bash
npm run agent
# Starts Telegram bot + AI replies
# Responds to messages in Telegram
```

### 💻 Terminal 4 - Frontend
```bash
npm run dev
# http://localhost:5173
# Opens React UI in browser
```

---

## 🧪 Testing

```bash
# Launch a test token on frontend:
# 1. Go to http://localhost:5173
# 2. Fill in: Name, Symbol, Supply
# 3. Click "Launch Token"
# 4. Watch transaction complete
# 5. Transaction appears on http://testnet.bscscan.com

# Or use API:
curl -X POST http://localhost:3001/api/launch \
  -H "Content-Type: application/json" \
  -d '{"name":"MyToken","symbol":"MTK","supply":1000000}'

# Check backend health:
curl http://localhost:3001/health

# Get all tokens:
curl http://localhost:3001/api/tokens
```

---

## 🐝 Bumblebee Commands

```bash
# In Telegram, send message to your bot:
"What tokens have launched?"
"Show me the latest data"
"How many coins are locked?"

# Bumblebee responds with AI answer using ChatGPT! Bzzzt! ⚡
```

---

## 🔧 Maintenance Commands

```bash
# Clean reinstall
rm -r node_modules package-lock.json
npm install

# Format code
npm run lint

# Test frontend
npm run test

# Build for production
npm run build

# Deploy to mainnet (advanced - use real BNB!)
npm run deploy-mainnet
```

---

## 📊 Blockchain Info

### BNB Testnet
- **RPC:** https://data-seed-prebsc-1-s1.binance.org:8545/
- **Chain ID:** 97
- **Explorer:** https://testnet.bscscan.com
- **Faucet:** https://testnet.bnbchain.org/faucet-smart

### Local Ports
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Contracts:** Deployed to BNB Testnet (see explorer)

---

## ⚡ Emergency Commands

```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3001    # Windows

# Clear cache
rm -rf node_modules/.cache

# Reinstall corrupted packages
npm ci

# View logs
npm run dev -- --debug
```

---

## 🎯 Typical Day Workflow

```bash
# Morning: Deploy new contract version
npm run deploy
# Update FACTORY_ADDRESS in .env if changed

# Throughout day: Use these 4 terminals
npm run dev        # Terminal 1: Frontend development
npm run backend    # Terminal 2: API
npm run agent      # Terminal 3: Telegram bot  
npm run deploy     # Terminal 4: Redeploy when contracts change

# Evening: Test everything
npm run test       # Run tests
npm run build      # Build production

# Production: Deploy to mainnet
npm run deploy-mainnet
# ⚠️ WARNING: Uses real BNB! Be careful!
```

---

## 🚨 Common Issues

```bash
# "Contract not deployed"
npm run deploy
# Then update FACTORY_ADDRESS in .env

# "Port 3001 already in use?"
npm run backend        # Try different port
# Or kill process: lsof -ti:3001 | xargs kill -9

# "Cannot find ethers"
npm install
# Make sure node_modules exists

# "Invalid private key"
# Check .env file - no spaces, no quotes around value
PRIVATE_KEY=abc...   # ✅ Correct
PRIVATE_KEY="abc..." # ❌ Wrong

# "Insufficient balance"
# Get more test BNB: https://testnet.bnbchain.org/faucet-smart
```

---

## 📚 File Structure

```
launchsafe/
├── contracts/         ← Edit Solidity here
├── scripts/
│   └── deploy.js     ← Run: npm run deploy
├── backend/
│   └── server.js    ← Run: npm run backend
├── agent/
│   └── bumblebee.js ← Run: npm run agent
├── src/
│   ├── App.tsx      ← Frontend React
│   └── pages/       ← Page components
├── hardhat.config.js ← Blockchain config
├── .env             ← Your secrets (in .gitignore)
├── package.json     ← All scripts
└── README.md        ← More info
```

---

## 🎓 Learning Path

1. **Understand Smart Contracts** → Read `contracts/TokenFactory.sol`
2. **Deploy Contracts** → Run `npm run deploy`
3. **Understand Backend** → Read `backend/server.js`  
4. **Test APIs** → Use curl commands above
5. **Understand Frontend** → Check `src/App.tsx`
6. **Customize Everything** → Modify and redeploy
7. **Deploy to Mainnet** → Run `npm run deploy-mainnet`

---

🐝 **Bzzzt! ⚡ You're all set! Start with: npm install**
