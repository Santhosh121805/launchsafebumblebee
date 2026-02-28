<img width="1880" height="931" alt="image" src="https://github.com/user-attachments/assets/a0f4884b-3939-4c53-9ab0-e87b2771076b" />LaunchSafe - SAFE.SECURE.UNSTOPPABLE [](file:///c%3A/Users/Santhosh%20S/Desktop/Santhosh-Tem/bumblebee-launchpad/README.md)
<img width="1857" height="1239" alt="image" src="https://github.com/user-attachments/assets/1236c874-f4f5-422b-aa3e-49bfbae334d2" />

## **User Journey Diagram**
```
┌─────────────────────────────────────────────────────────────┐
│                    BUMBLEBEE LAUNCHPAD                      │
│                    User Journey & Flow                       │
└─────────────────────────────────────────────────────────────┘

1. TOKENOMICS EXPLORATION
   User → ExploreTokens Page → View All Tokens → Analyze via Bumblebee Bot

2. TOKEN CREATION FLOW
   User → LaunchToken Page → Fill Details → Deploy Smart Contract

3. TOKEN MANAGEMENT
   Dashboard → View Holdings → Monitor Performance → Receive Alerts

4. BOT INTERACTION
   Telegram User → /start → View Options → /analyze → Get AI Insights
                                         → /tokens → View Holdings
                                         → /alerts → Subscribe Updates
```

## **Architecture Section**
```
┌──────────────────────────────────────────────────────────────────┐
│                   BUMBLEBEE PLATFORM ARCHITECTURE                │
└──────────────────────────────────────────────────────────────────┘

CLIENT LAYER
├─ Frontend (React + Vite + TypeScript)
│  ├─ ExploreTokens Component
│  ├─ LaunchToken Component
│  ├─ Dashboard Component
│  └─ Bumblebee Guide AI Chat

BACKEND LAYER
├─ Node.js Express Server
│  ├─ /api/tokens (GET, POST)
│  ├─ /api/deploy (POST)
│  ├─ /api/analyze (POST)
│  └─ Health Check Routes

AI & BOT LAYER
├─ Telegram Bot (Telegraf)
│  ├─ Message Handler
│  ├─ Command Handler
│  └─ Gemini Integration

DATA LAYER
├─ MongoDB Atlas
│  ├─ Tokens Collection
│  ├─ Users Collection
│  └─ Transactions Collection

BLOCKCHAIN LAYER
├─ BNB Smart Chain Testnet
│  ├─ TokenFactory Contract
│  ├─ VaultContract
│  └─ ethers.js Integration
```
<img width="7439" height="4523" alt="Mermaid Chart - Create complex, visual diagrams with text -2026-02-28-080308" src="https://github.com/user-attachments/assets/1852f104-bd13-4a1b-8e24-c095732b2e3a" />



## **Open-Source Dependencies**

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "vite": "^5.2.0",
    "typescript": "^5.2.2",
    "tailwindcss": "^3.4.3",
    "@radix-ui/react-dialog": "^1.1.1",
    "ethers": "^6.10.0",
    "recharts": "^2.10.3"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "telegraf": "^4.16.0",
    "@google/generative-ai": "^0.1.3",
    "ethers": "^6.10.0",
    "dotenv": "^16.3.1",
    "node-cron": "^3.0.2",
    "cors": "^2.8.5"
  }
}
```



## **Deployment Instructions**

### Prerequisites
- Node.js >= 18
- npm or bun
- Vercel Account
- MongoDB Atlas Account
- Telegram Bot Token
- Google Gemini API Key
- BNB Smart Chain Testnet RPC

<img width="1880" height="931" alt="Screenshot 2026-02-28 140007" src="https://github.com/user-attachments/assets/9dd86aa3-575f-4124-b9ee-606c1bf76183" />


### Step-by-Step Deployment

#### 1. **Environment Variables Setup**

Create .env.local (Frontend):
```env
VITE_BACKEND_URL=https://your-backend-vercel-url
VITE_CONTRACT_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
VITE_VAULT_ADDRESS=0x5B51Bd77152c2A4Da3574AC627f43Ec4B59eCAeD
VITE_FACTORY_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
```

Create .env (Backend):
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=bumblebee
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_GROUP_ID=-your_group_id
GEMINI_API_KEY=your_gemini_api_key
CONTRACT_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
VAULT_ADDRESS=0x5B51Bd77152c2A4Da3574AC627f43Ec4B59eCAeD
FACTORY_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
BACKEND_URL=https://your-backend-vercel-url
```

#### 2. **Frontend Deployment (Vercel)**

```bash
# Login to Vercel
vercel login

# Deploy frontend
vercel deploy --prod

# Set environment variables in Vercel dashboard
```

#### 3. **Backend Deployment (Vercel)**

```bash
cd backend
vercel deploy --prod

# Add environment variables in Vercel dashboard
```

#### 4. **Telegram Bot Deployment (Vercel)**

```bash
cd agent
vercel deploy --prod

# Configure webhook: https://your-bot-vercel-url/receive
```

#### 5. **Database Setup**

```bash
# MongoDB Atlas
1. Create cluster: bumblebee
2. Create database user
3. Add connection string to .env
4. Create indexes on tokens collection
```

#### 6. **Smart Contract Deployment**

```bash
# Deploy contracts to BNB Testnet
npx hardhat run scripts/deploy.js --network testnet

# Verify on BSCscan
npx hardhat verify --network testnet <contract_address>
```



#### 7. **Verification Checklist**

- [ ] Frontend loads at Vercel URL
- [ ] Backend API responds at `/health`
- [ ] Database connection successful
- [ ] Telegram bot commands working
- [ ] Smart contract functions callable
- [ ] Environment variables all set
- [ ] CORS enabled for frontend domain
- [ ] MongoDB credentials secure in .env
