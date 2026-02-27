#!/bin/bash

echo "🔍 LaunchSafe Setup Verification"
echo "=================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Download from https://nodejs.org"
  exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found"
  exit 1
fi
echo "✅ npm: $(npm --version)"

# Check if node_modules exists
echo "✓ Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "❌ node_modules not found. Run: npm install"
  exit 1
fi
echo "✅ Dependencies installed"

# Check .env
echo "✓ Checking .env file..."
if [ ! -f ".env" ]; then
  echo "❌ .env file not found. Copy .env.example and fill in values"
  exit 1
fi
echo "✅ .env file exists"

# Check required .env values
echo "✓ Checking .env values..."
if ! grep -q "PRIVATE_KEY" .env; then
  echo "⚠️  PRIVATE_KEY not set"
fi
if ! grep -q "OPENAI_API_KEY" .env; then
  echo "⚠️  OPENAI_API_KEY not set"
fi
if ! grep -q "TELEGRAM_BOT_TOKEN" .env; then
  echo "⚠️  TELEGRAM_BOT_TOKEN not set"
fi
echo "✅ .env configuration checked"

# Check contracts
echo "✓ Checking smart contracts..."
if [ ! -f "contracts/TokenFactory.sol" ]; then
  echo "❌ TokenFactory.sol not found"
  exit 1
fi
if [ ! -f "contracts/VaultContract.sol" ]; then
  echo "❌ VaultContract.sol not found"
  exit 1
fi
echo "✅ Smart contracts found"

# Check scripts
echo "✓ Checking scripts..."
if [ ! -f "scripts/deploy.js" ]; then
  echo "❌ deploy.js not found"
  exit 1
fi
echo "✅ Deploy script found"

# Check backend
echo "✓ Checking backend..."
if [ ! -f "backend/server.js" ]; then
  echo "❌ backend/server.js not found"
  exit 1
fi
if [ ! -f "backend/package.json" ]; then
  echo "❌ backend/package.json not found"
  exit 1
fi
echo "✅ Backend files found"

# Check agent
echo "✓ Checking Bumblebee agent..."
if [ ! -f "agent/bumblebee.js" ]; then
  echo "❌ agent/bumblebee.js not found"
  exit 1
fi
if [ ! -f "agent/package.json" ]; then
  echo "❌ agent/package.json not found"
  exit 1
fi
echo "✅ Bumblebee agent files found"

# Check hardhat config
echo "✓ Checking Hardhat config..."
if [ ! -f "hardhat.config.js" ]; then
  echo "❌ hardhat.config.js not found"
  exit 1
fi
echo "✅ Hardhat config found"

echo ""
echo "=================================="
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. Fill in .env file with API keys"
echo "2. Get free test BNB: https://testnet.bnbchain.org/faucet-smart"
echo "3. Run: npm run deploy"
echo "4. Run in separate terminals:"
echo "   - npm run backend"
echo "   - npm run agent"
echo "   - npm run dev"
echo ""
echo "🐝 Bzzzt! ⚡ Ready to launch!"
