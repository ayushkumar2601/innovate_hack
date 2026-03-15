# AgentForge - Project Structure

```
ai-agent-marketplace-1/
│
├── 📁 .git/                           # Git version control
│
├── 📄 .env.local                      # Environment variables (root level)
├── 📄 .gitignore                      # Git ignore rules
├── 📄 README.md                       # Project documentation
├── 📄 runtime.txt                     # Python runtime version
├── 📄 vercel.json                     # Vercel deployment config
├── 📄 eslint.config.mjs              # ESLint configuration
├── 📄 postcss.config.mjs             # PostCSS configuration
│
├── 📁 api/                           # Vercel API wrapper
│   └── 📄 index.py                   # FastAPI app wrapper for Vercel
│
├── 📁 backend/                       # Python FastAPI Backend
│   ├── 📄 .env                       # Backend environment variables
│   ├── 📄 main.py                    # FastAPI application entry point
│   ├── 📄 database.py                # MongoDB connection & setup
│   ├── 📄 requirements.txt           # Python dependencies
│   ├── 📄 test_groq.py              # Groq API testing script
│   ├── 📄 migrate_local_to_mongodb.py # Database migration script
│   │
│   ├── 📁 agents/                    # AI Agent System
│   │   ├── 📄 __init__.py           # Package initialization
│   │   ├── 📄 base.py               # BaseAgent class (inheritance)
│   │   ├── 📄 utils.py              # Agent utilities
│   │   ├── 📄 crypto_agent.py       # Cryptocurrency analysis agent
│   │   ├── 📄 nft_agent.py          # NFT collection analysis agent
│   │   ├── 📄 twitter_agent.py      # Social media growth agent
│   │   ├── 📄 blog_agent.py         # Content creation agent
│   │   └── 📁 __pycache__/          # Python bytecode cache
│   │
│   └── 📁 __pycache__/              # Python bytecode cache
│
├── 📁 frontend/                      # Next.js React Frontend
│   ├── 📄 package.json              # Node.js dependencies
│   ├── 📄 package-lock.json         # Dependency lock file
│   ├── 📄 next.config.ts            # Next.js configuration
│   ├── 📄 tsconfig.json             # TypeScript configuration
│   │
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📄 layout.tsx            # Root layout component
│   │   ├── 📄 page.tsx              # Homepage component
│   │   ├── 📄 providers.tsx         # Context providers (Wallet)
│   │   ├── 📄 globals.css           # Global CSS styles
│   │   ├── 📄 favicon.ico           # Website favicon
│   │   │
│   │   ├── 📁 agent/                # Agent detail pages
│   │   │   └── 📁 [id]/             # Dynamic route for agent ID
│   │   │       └── 📄 page.tsx      # Individual agent page
│   │   │
│   │   ├── 📁 marketplace/          # Marketplace page
│   │   │   └── 📄 page.tsx          # Agent marketplace listing
│   │   │
│   │   ├── 📁 dashboard/            # Creator dashboard
│   │   │   └── 📄 page.tsx          # Creator analytics page
│   │   │
│   │   └── 📁 deploy/               # Agent deployment
│   │       └── 📄 page.tsx          # Deploy new agent form
│   │
│   ├── 📁 components/               # Reusable React Components
│   │   ├── 📄 AgentCard.tsx         # Agent display card
│   │   ├── 📄 Navbar.tsx            # Navigation header
│   │   ├── 📄 Footer.tsx            # Website footer
│   │   └── 📄 WalletButton.tsx      # Solana wallet connection
│   │
│   ├── 📁 lib/                      # Utility libraries
│   │   └── 📄 config.ts             # API configuration & endpoints
│   │
│   ├── 📁 public/                   # Static assets
│   │   ├── 📄 ss1.png               # Homepage screenshot
│   │   ├── 📄 ss2.png               # Marketplace screenshot
│   │   ├── 📄 ss3.png               # Deploy page screenshot
│   │   ├── 📄 ss4.png               # Dashboard screenshot
│   │   └── 📄 vercel.svg            # Vercel logo
│   │
│   └── 📁 node_modules/             # Node.js dependencies (auto-generated)
│
├── 📁 data/                         # Data files
│   ├── 📄 agents.json               # Agent data (currently empty)
│   └── 📄 agents.ts                 # TypeScript agent definitions
│
└── 📁 types/                        # TypeScript type definitions
    └── 📄 agent.ts                  # Agent interface definitions
```

## 🏗️ Architecture Overview

### **Backend (Python FastAPI)**
- **Entry Point**: `backend/main.py` - FastAPI application with 15+ REST endpoints
- **Database**: `backend/database.py` - MongoDB Atlas connection with SSL
- **AI Agents**: `backend/agents/` - Modular agent system with inheritance
- **Dependencies**: `backend/requirements.txt` - FastAPI, Groq, PyMongo, etc.

### **Frontend (Next.js React)**
- **App Router**: `frontend/app/` - File-based routing system
- **Components**: `frontend/components/` - Reusable UI components
- **Configuration**: `frontend/lib/config.ts` - API endpoints & settings
- **Styling**: TailwindCSS + Framer Motion animations

### **Deployment**
- **Vercel**: `vercel.json` + `api/index.py` for serverless deployment
- **Environment**: `.env.local` (root) + `backend/.env` for secrets

### **Key Technologies**
- **Backend**: FastAPI 0.104.1, Python 3.x, MongoDB Atlas, Groq LLM
- **Frontend**: Next.js 16.1.6, React 19.2.3, TypeScript 5.x, TailwindCSS 4.x
- **Blockchain**: Solana Web3.js, Wallet Adapters (Phantom, Backpack)
- **AI**: Groq API with LLaMA 3.3-70B model integration

### **Data Flow**
```
User Browser → Next.js Frontend → FastAPI Backend → MongoDB Atlas
                     ↓                    ↓
              Solana Wallet ←→ Groq AI API
```

## 🚀 Quick Start Commands

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs