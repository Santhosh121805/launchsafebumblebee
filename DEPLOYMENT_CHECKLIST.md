# 🚀 LaunchSafe Deployment Checklist

## Phase 1: Local Setup ✓

- [ ] **Install Node.js**
  - [ ] Download from nodejs.org
  - [ ] Verify: `node --version` (should be v18+)
  
- [ ] **Install Project**
  - [ ] Run: `npm install`
  - [ ] Wait for all dependencies
  
- [ ] **Get MetaMask Ready**
  - [ ] Install MetaMask extension
  - [ ] Create wallet or import existing
  - [ ] Add BNB Testnet network:
    - [ ] Name: BNB Testnet
    - [ ] RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
    - [ ] Chain ID: 97
    - [ ] Symbol: BNB
  - [ ] Switch to BNB Testnet
  
- [ ] **Get Free Test BNB**
  - [ ] Copy wallet address
  - [ ] Go to: https://testnet.bnbchain.org/faucet-smart
  - [ ] Paste address, click "Give me BNB"
  - [ ] Verify 0.5 BNB received

---

## Phase 2: API Keys ✓

- [ ] **OpenAI API Key**
  - [ ] Go to: https://platform.openai.com/api-keys
  - [ ] Create new secret key
  - [ ] Copy to .env as OPENAI_API_KEY=
  
- [ ] **Telegram Bot Token**
  - [ ] Open Telegram app
  - [ ] Search: @BotFather
  - [ ] Type: /newbot
  - [ ] Follow setup (name, username)
  - [ ] Copy token to .env as TELEGRAM_BOT_TOKEN=
  
- [ ] **BSCScan API Key**
  - [ ] Go to: https://bscscan.com
  - [ ] Sign up → Verify email
  - [ ] Settings → API-KEYs
  - [ ] Create new key
  - [ ] Copy to .env as BSCSCAN_API_KEY=
  
- [ ] **Telegram Group ID (Optional)**
  - [ ] Create Telegram group for bot
  - [ ] Add your bot to group
  - [ ] Send a message in group
  - [ ] Go to: https://api.telegram.org/bot[YOUR_TOKEN]/getUpdates
  - [ ] Find the negative chat ID
  - [ ] Copy to .env as TELEGRAM_GROUP_ID=

---

## Phase 3: Environment Setup ✓

- [ ] **Create .env File**
  - [ ] Copy from .env.example
  - [ ] Fill in all values:
    - [ ] PRIVATE_KEY (from MetaMask Settings)
    - [ ] OPENAI_API_KEY (from Phase 2)
    - [ ] TELEGRAM_BOT_TOKEN (from Phase 2)
    - [ ] BSCSCAN_API_KEY (from Phase 2)
    - [ ] TELEGRAM_GROUP_ID (optional)
    - [ ] MONGODB_URL (optional)
  - [ ] Save file
  - [ ] Verify no spaces/quotes around values

---

## Phase 4: Smart Contracts Deployment ✓

- [ ] **Review Contracts**
  - [ ] Read contracts/TokenFactory.sol
  - [ ] Read contracts/VaultContract.sol
  - [ ] Understand the logic
  
- [ ] **Deploy to Testnet**
  - [ ] Run: `npm run deploy`
  - [ ] Wait for deployment (2-5 minutes)
  - [ ] Copy output:
    - [ ] TokenFactory address: 0x...
    - [ ] Vault address: 0x...
  
- [ ] **Update .env**
  - [ ] Add FACTORY_ADDRESS=0x... (from deploy)
  
- [ ] **Verify on BSCScan**
  - [ ] Go to: https://testnet.bscscan.com
  - [ ] Paste TokenFactory address
  - [ ] Verify contract appears
  - [ ] Check "Code" tab shows contract

---

## Phase 5: Backend Services ✓

- [ ] **Install Backend Dependencies**
  - [ ] Run: `cd backend && npm install && cd ..`
  - [ ] Verify express, ethers, cors installed
  
- [ ] **Start Backend Server**
  - [ ] Open new terminal
  - [ ] Run: `npm run backend`
  - [ ] Verify output shows:
    - [ ] ✅ "Backend running on http://localhost:3001"
    - [ ] ✅ Connected to BNB Testnet
    - [ ] ✅ Wallet address shown
  
- [ ] **Test Backend APIs**
  - [ ] Check health: `curl http://localhost:3001/health`
  - [ ] Get tokens: `curl http://localhost:3001/api/tokens`
  - [ ] Check wallet: `curl http://localhost:3001/api/wallet`

---

## Phase 6: Bumblebee AI Agent ✓

- [ ] **Install Agent Dependencies**
  - [ ] Run: `cd agent && npm install && cd ..`
  - [ ] Verify telegraf, openai, axios installed
  
- [ ] **Start Bumblebee**
  - [ ] Open new terminal
  - [ ] Run: `npm run agent`
  - [ ] Verify output shows:
    - [ ] ✅ API keys configured
    - [ ] ✅ "Bumblebee AI Agent is LIVE! Bzzzt! ⚡"
  
- [ ] **Test Bumblebee on Telegram**
  - [ ] Open your Telegram bot
  - [ ] Send message: "Hello Bumblebee"
  - [ ] Wait for AI response (10-30 seconds)
  - [ ] Verify response is about tokens

---

## Phase 7: Frontend ✓

- [ ] **Start Frontend**
  - [ ] Open new terminal
  - [ ] Run: `npm run dev`
  - [ ] Verify output shows:
    - [ ] ✅ "Local: http://localhost:5173"
  
- [ ] **Check UI in Browser**
  - [ ] Go to http://localhost:5173
  - [ ] Page loads without errors
  - [ ] All buttons visible
  - [ ] Console shows no errors (F12)

---

## Phase 8: End-to-End Testing ✓

- [ ] **Launch a Test Token**
  - [ ] From frontend OR API:
    ```bash
    curl -X POST http://localhost:3001/api/launch \
      -H "Content-Type: application/json" \
      -d '{"name":"TestToken","symbol":"TEST","supply":1000000}'
    ```
  - [ ] Get transaction hash
  - [ ] Wait 30-60 seconds for confirmation
  
- [ ] **Verify Token on BSCScan**
  - [ ] Go to https://testnet.bscscan.com
  - [ ] Paste transaction hash
  - [ ] See token creation event
  - [ ] View token contract
  
- [ ] **Test All APIs**
  - [ ] POST /api/launch - Create token
  - [ ] GET /api/tokens - List all tokens
  - [ ] GET /api/wallet - Check wallet balance
  - [ ] POST /api/unlock - Unlock milestone

---

## Phase 9: Production Prep ✓

- [ ] **Code Review**
  - [ ] Review all smart contracts
  - [ ] Check for security issues
  - [ ] Verify gas optimization
  
- [ ] **Documentation**
  - [ ] Update README.md with real addresses
  - [ ] Document all API endpoints
  - [ ] Create deployment guide
  
- [ ] **Security Audit**
  - [ ] Check .gitignore includes .env
  - [ ] Verify no keys in code
  - [ ] No secrets in git history
  
- [ ] **Mainnet Prep (When Ready)**
  - [ ] Verify all testnet functionality
  - [ ] Review contracts again
  - [ ] Update hardhat.config.js for mainnet
  - [ ] Get real BNB (not test)
  - [ ] Update .env with mainnet RPC
  - [ ] Test deploy on dry-run: `npm run deploy-mainnet`

---

## Phase 10: Launch! 🚀

- [ ] **Mainnet Deployment** (When ready)
  - [ ] Double-check all settings
  - [ ] Run: `npm run deploy-mainnet`
  - [ ] Update contract addresses
  
- [ ] **Post-Launch**
  - [ ] Monitor gas prices
  - [ ] Watch token transactions
  - [ ] Bumblebee posts updates to group
  - [ ] Celebrate! 🎉

---

## ✅ Success Criteria

- [x] All 4 terminals running (frontend, backend, agent, blockchain)
- [x] Frontend loads at http://localhost:5173
- [x] Backend responds at http://localhost:3001
- [x] Bumblebee responds to Telegram messages
- [x] Can launch tokens successfully
- [x] Tokens appear on BSCScan
- [x] All transactions confirmed on blockchain
- [x] No errors in any console

---

## 🎯 Checklist Template Commands

```bash
# Run all these to verify setup
echo "✓ Node.js"
node --version

echo "✓ npm"
npm --version

echo "✓ Dependencies"
ls -la node_modules | head -5

echo "✓ Contracts"
ls contracts/

echo "✓ Backend"
ls backend/

echo "✓ Agent"
ls agent/

echo "✓ Environment"
cat .env | grep -v "^#"
```

---

## 🐝 You're Ready When:

✅ All checklist items are checked
✅ All 4 services running without errors
✅ Token launches successfully
✅ Bumblebee responds on Telegram
✅ All transactions visible on BSCScan

---

**🚀 When complete, you have a fully functional token launch platform!**
