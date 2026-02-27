# LaunchSafe - Token Launch Platform on BNB Chain 🚀

Complete setup for launching tokens on BNB Testnet/Mainnet with automated vaults and Bumblebee AI agent.

## Project Structure

```
launchsafe/
├── contracts/              # Solidity smart contracts
│   ├── TokenFactory.sol    # Creates new tokens
│   └── VaultContract.sol   # Locks tokens until milestones
├── scripts/
│   └── deploy.js           # Deployment script
├── backend/
│   ├── server.js           # Express API server
│   └── package.json
├── agent/
│   ├── bumblebee.js        # Telegram bot + AI
│   └── package.json
├── src/                    # React frontend
├── hardhat.config.js       # Hardhat configuration
├── .env                    # Environment variables (NEVER COMMIT)
└── package.json
```

## Prerequisites

- **Node.js 18+** - Download from https://nodejs.org
- **MetaMask** wallet with BNB Testnet configured
- **API Keys:**
  - OpenAI API key (for Bumblebee AI)
  - Telegram Bot Token (for Bumblebee)
  - BSCScan API key (for contract verification)
  - MongoDB URL (optional, for data storage)

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# This will install everything for Hardhat and frontend
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
# Blockchain
PRIVATE_KEY=your_metamask_private_key
BSCSCAN_API_KEY=your_bscscan_key

# AI & Telegram
OPENAI_API_KEY=your_openai_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_GROUP_ID=your_group_id

# Backend
BACKEND_URL=http://localhost:3001

# Database (optional)
MONGODB_URL=your_mongodb_url
```

⚠️ **IMPORTANT:** Never commit `.env` file. It's already in `.gitignore`.

### 3. Get Free Test BNB

Get free BNB Testnet tokens:
- Go to: https://testnet.bnbchain.org/faucet-smart
- Paste your MetaMask wallet address
- Receive 0.5 BNB instantly

### 4. Deploy Smart Contracts

```bash
# Deploy to BNB Testnet
npm run deploy

# You'll see:
# TokenFactory deployed to: 0x...
# Vault deployed to: 0x...
```

Then update `.env` with the returned contract address:
```env
FACTORY_ADDRESS=0x...
```

### 5. Start Services

Open 3 separate terminals:

**Terminal 1 - Backend Server:**
```bash
npm run backend
# Runs on http://localhost:3001
```

**Terminal 2 - Bumblebee AI Agent:**
```bash
npm run agent
# Starts your Telegram bot
```

**Terminal 3 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

## API Endpoints

### `/health`
Check if backend is running
```bash
curl http://localhost:3001/health
```

### `POST /api/launch`
Launch a new token

```bash
curl -X POST http://localhost:3001/api/launch \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyToken",
    "symbol": "MTK",
    "supply": 1000000
  }'
```

### `GET /api/tokens`
Get all launched tokens

```bash
curl http://localhost:3001/api/tokens
```

### `GET /api/wallet`
Get wallet info

```bash
curl http://localhost:3001/api/wallet
```

### `POST /api/unlock`
Unlock a milestone

```bash
curl -X POST http://localhost:3001/api/unlock \
  -H "Content-Type: application/json" \
  -d '{
    "vaultAddress": "0x...",
    "milestoneIndex": 0
  }'
```

## Token Launch Flow

1. Founder submits token details
2. Smart contract creates ERC20 token
3. Tokens locked in vault
4. 3 milestones: 20% → 30% → 50% unlock
5. Bumblebee celebrates each milestone! 🐝

## Smart Contracts

### TokenFactory
- Creates new ERC20 tokens
- Stores all token addresses
- Each token minted to vault

**Main Function:**
```solidity
function launchToken(
    string name,
    string symbol,
    uint256 supply
) public returns (address);
```

### Vault
- Locks tokens until milestones
- 3 milestone tiers: 20%, 30%, 50%
- Controlled by platform admin

**Main Functions:**
```solidity
function lockCoins(uint256 amount) public;
function unlockMilestone(uint256 milestoneIndex) public;
function getLockedAmount() public view returns (uint256);
```

## Frontend Features

- ✨ Launch new tokens with 1 click
- 📊 View all launched tokens
- 🔒 Milestone tracker
- 💬 Bumblebee chat integration
- 🎨 Beautiful Shadcn UI components

## Bumblebee AI Agent

Auto-responds to Telegram questions using OpenAI gpt-3.5-turbo:
- Answers questions about tokens
- Posts hourly market updates
- 100% energy using Bzzzt! ⚡
- Celebrates milestones

## Troubleshooting

### "Contract not deployed"
```bash
npm run deploy
# Copy contract address to .env FACTORY_ADDRESS=
```

### "Invalid private key"
```bash
# Export private key from MetaMask:
# Settings → Security & Privacy → Show Private Key
```

### "Insufficient balance"
```bash
# Get more test BNB from faucet:
# https://testnet.bnbchain.org/faucet-smart
```

### "connection timeout"
```bash
# Check BNB Testnet RPC status
# Use fallback RPC: https://bsc-testnet.publicnode.com
```

## Network Info

### BNB Testnet
- **URL:** https://data-seed-prebsc-1-s1.binance.org:8545/
- **Chain ID:** 97
- **Block Explorer:** https://testnet.bscscan.com

### BNB Mainnet
- **URL:** https://bsc-dataseed.binance.org/
- **Chain ID:** 56
- **Block Explorer:** https://bscscan.com

## Next Steps

1. ✅ Deploy contracts to testnet
2. ✅ Launch test token
3. ✅ Test vault milestones
4. ✅ Connect frontend
5. 🎯 Deploy to mainnet when ready
6. 📢 Launch Telegram bot
7. 🚀 Promote to users

## Security Checklist

- [ ] Private key never in code
- [ ] .env in .gitignore
- [ ] Use testnet first
- [ ] Test all milestones
- [ ] Verify contracts on BSCScan
- [ ] Audit smart contracts (recommended)
- [ ] Use hardware wallet for mainnet
- [ ] Set up monitoring alerts

## Support

- Hardhat Docs: https://hardhat.org/docs
- OpenZeppelin Docs: https://docs.openzeppelin.com/
- BNB Chain Docs: https://docs.bnbchain.org/
- Ethers.js Docs: https://docs.ethers.org/

---

Built with ❤️ using Hardhat, React & BNB Chain. Bzzzt! ⚡
