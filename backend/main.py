# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
from datetime import datetime
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import certifi
import ssl

# Load environment variables
load_dotenv()

# Import all agents
from agents.crypto_agent import crypto_agent
from agents.nft_agent import nft_agent
from agents.twitter_agent import twitter_agent
from agents.blog_agent import blog_agent

# ============================================
# MONGODB CONNECTION
# ============================================
MONGODB_URI = os.getenv("MONGODB_URI")

def connect_to_mongodb():
    """Connect to MongoDB with proper SSL certificates"""
    
    if not MONGODB_URI:
        print("⚠️ WARNING: MONGODB_URI not found in environment variables")
        return None
    
    try:
        # Use certifi for SSL certificates (fixed by your installation)
        client = MongoClient(
            MONGODB_URI,
            tlsCAFile=certifi.where(),  # This uses the certificates we just installed
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connected successfully with SSL")
        return client
        
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        return None

# Connect to MongoDB
client = connect_to_mongodb()

if client:
    db = client["innovat3"]
    agents_collection = db["agents"]
    ratings_collection = db["ratings"]
    
    # Create indexes for better performance
    try:
        agents_collection.create_index("id", unique=True)
        agents_collection.create_index("creator")
        agents_collection.create_index("category")
        agents_collection.create_index("type")
        ratings_collection.create_index("agent_id")
        print("✅ MongoDB indexes created successfully")
    except Exception as e:
        print(f"⚠️ Index creation warning: {e}")
else:
    print("❌ FATAL: Could not connect to MongoDB")
    print("⚠️ Please check your MONGODB_URI in .env file")
    exit(1)

# ============================================
# SEED DEFAULT AGENTS
# ============================================
def seed_default_agents():
    """Seed default agents if database is empty"""
    if agents_collection.count_documents({}) == 0:
        default_agents = [
            {
                "id": "crypto_1",
                "name": "Crypto Analysis Agent",
                "type": "crypto",
                "category": "Finance",
                "description": "Analyzes cryptocurrency trends and provides market insights",
                "price": 0.05,
                "creator": "GnQ8VhQQBoNvhK6TNmn8gP7PNBNo3odppgLZsxtejfAe",
                "rating": 4.5,
                "total_runs": 127,
                "created_at": "2024-01-15T00:00:00"
            },
            {
                "id": "nft_1",
                "name": "NFT Analysis Agent",
                "type": "nft",
                "category": "NFTs",
                "description": "Analyzes NFT collections and provides market insights",
                "price": 0.04,
                "creator": "GnQ8VhQQBoNvhK6TNmn8gP7PNBNo3odppgLZsxtejfAe",
                "rating": 4.3,
                "total_runs": 98,
                "created_at": "2024-01-20T00:00:00"
            },
            {
                "id": "twitter_1",
                "name": "Twitter Growth Agent",
                "type": "twitter",
                "category": "Social Media",
                "description": "Creates Twitter growth strategies and content ideas",
                "price": 0.03,
                "creator": "GnQ8VhQQBoNvhK6TNmn8gP7PNBNo3odppgLZsxtejfAe",
                "rating": 4.1,
                "total_runs": 156,
                "created_at": "2024-02-01T00:00:00"
            },
            {
                "id": "blog_1",
                "name": "Blog Writer Agent",
                "type": "blog",
                "category": "Content",
                "description": "Writes high-quality blog posts on any topic",
                "price": 0.03,
                "creator": "GnQ8VhQQBoNvhK6TNmn8gP7PNBNo3odppgLZsxtejfAe",
                "rating": 4.2,
                "total_runs": 89,
                "created_at": "2024-02-20T00:00:00"
            }
        ]
        agents_collection.insert_many(default_agents)
        print("✅ Default agents seeded to MongoDB")
    else:
        print(f"✅ MongoDB already has {agents_collection.count_documents({})} agents")

# Seed default agents
seed_default_agents()

# ============================================
# INITIALIZE FASTAPI
# ============================================
app = FastAPI(
    title="Innovat3 AI Agent API",
    description="Backend API for AI Agent Marketplace on Solana",
    version="1.0.0"
)

# ============================================
# CORS CONFIGURATION
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://ai-agent-marketplacesite.vercel.app",  # ⚠️ REMOVED trailing slash!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# PYDANTIC MODELS
# ============================================

class AgentRequest(BaseModel):
    agent_type: str  # "crypto", "nft", "twitter", "blog"
    input: str

class RatingRequest(BaseModel):
    agent_id: str
    rating: int  # 1-5
    wallet: str

class SearchRequest(BaseModel):
    query: Optional[str] = ""
    category: Optional[str] = ""
    min_price: Optional[float] = 0
    max_price: Optional[float] = 10

class CreateAgentRequest(BaseModel):
    name: str
    description: str
    price: float
    creator: str
    category: str = "Custom"
    type: str  # "crypto", "nft", "twitter", "blog"

# ============================================
# HELPER FUNCTIONS
# ============================================

def get_agent_by_type(agent_type: str):
    """Get agent instance by type"""
    agents = {
        "crypto": crypto_agent,
        "nft": nft_agent,
        "twitter": twitter_agent,
        "blog": blog_agent
    }
    return agents.get(agent_type)

def format_agent_for_response(agent_doc):
    """Remove MongoDB _id and format for response"""
    if agent_doc and "_id" in agent_doc:
        agent_doc["_id"] = str(agent_doc["_id"])  # Convert ObjectId to string
    return agent_doc

# ============================================
# API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "name": "Innovat3 AI Agent API",
        "version": "1.0.0",
        "description": "Backend API for AI Agent Marketplace on Solana",
        "status": "running",
        "database": "MongoDB Atlas",
        "agents_count": agents_collection.count_documents({}),
        "endpoints": [
            "/agents - Get all agents",
            "/agents/search - Search agents",
            "/agents/categories - Get categories",
            "/agents/{agent_id} - Get specific agent",
            "/execute-agent - Run an agent",
            "/rate-agent - Rate an agent",
            "/dashboard/{wallet} - Creator dashboard",
            "/leaderboard - Top agents",
            "/stats - Platform statistics",
            "/health - Health check"
        ]
    }

# ========== AGENT MANAGEMENT ==========

@app.get("/agents")
async def get_agents(category: Optional[str] = None):
    """Get all agents, optionally filtered by category"""
    query = {}
    if category:
        query["category"] = category
    
    cursor = agents_collection.find(query).sort("rating", -1)
    agents = [format_agent_for_response(agent) for agent in cursor]
    return agents

@app.get("/agents/search")
async def search_agents(
    q: str = "", 
    category: str = "", 
    min_price: float = 0, 
    max_price: float = 10
):
    """Search agents by name, category, and price range"""
    query = {}
    
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}}
        ]
    
    if category:
        query["category"] = category
    
    query["price"] = {"$gte": min_price, "$lte": max_price}
    
    cursor = agents_collection.find(query).sort("rating", -1)
    agents = [format_agent_for_response(agent) for agent in cursor]
    
    return {
        "count": len(agents),
        "results": agents
    }

@app.get("/agents/categories")
async def get_categories():
    """Get all unique categories"""
    categories = agents_collection.distinct("category")
    return {"categories": categories}

@app.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get a specific agent by ID"""
    agent = agents_collection.find_one({"id": agent_id})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return format_agent_for_response(agent)

@app.post("/agents")
async def create_agent(agent: CreateAgentRequest):
    """Create a new agent (called from deploy page)"""
    try:
        # Count existing agents to generate new ID
        agent_count = agents_collection.count_documents({"type": agent.type})
        new_id = f"{agent.type}_{agent_count + 1}"
        
        # Create new agent entry
        new_agent = {
            "id": new_id,
            "name": agent.name,
            "type": agent.type,
            "category": agent.category,
            "description": agent.description,
            "price": agent.price,
            "creator": agent.creator,
            "rating": 0.0,
            "total_runs": 0,
            "created_at": datetime.now().isoformat()
        }
        
        # Insert into MongoDB
        agents_collection.insert_one(new_agent)
        
        print(f"✅ New agent created: {agent.name} (ID: {new_id})")
        return format_agent_for_response(new_agent)
        
    except Exception as e:
        print(f"❌ Error creating agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== AGENT EXECUTION ==========

@app.post("/execute-agent")
async def execute_agent(request: AgentRequest):
    """Execute an AI agent"""
    
    try:
        # Get the appropriate agent
        agent = get_agent_by_type(request.agent_type)
        
        if not agent:
            raise HTTPException(
                status_code=400, 
                detail=f"Unknown agent type: {request.agent_type}. Available: crypto, nft, twitter, blog"
            )
        
        # Execute the agent
        result = agent.run(request.input)
        
        # Update run count in MongoDB
        agents_collection.update_one(
            {"type": request.agent_type},
            {"$inc": {"total_runs": 1}}
        )
        
        # Return response
        return {
            "success": True,
            "agent": request.agent_type,
            "agent_info": {
                "name": agent.name,
                "category": agent.category,
                "price": agent.price
            },
            "input": request.input,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        print(f"❌ Error executing agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== RATING SYSTEM ==========

@app.post("/rate-agent")
async def rate_agent(request: RatingRequest):
    """Rate an agent after execution"""
    
    # Validate rating
    if not 1 <= request.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Find agent
    agent = agents_collection.find_one({"id": request.agent_id})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Store rating
    rating_entry = {
        "agent_id": request.agent_id,
        "rating": request.rating,
        "wallet": request.wallet,
        "timestamp": datetime.now().isoformat()
    }
    ratings_collection.insert_one(rating_entry)
    
    # Calculate new average rating
    all_ratings = list(ratings_collection.find({"agent_id": request.agent_id}))
    avg_rating = sum(r["rating"] for r in all_ratings) / len(all_ratings)
    new_rating = round(avg_rating, 1)
    
    # Update agent's rating
    agents_collection.update_one(
        {"id": request.agent_id},
        {"$set": {"rating": new_rating}}
    )
    
    return {
        "success": True,
        "message": "Rating saved successfully",
        "agent_id": request.agent_id,
        "your_rating": request.rating,
        "new_average": new_rating,
        "total_ratings": len(all_ratings)
    }

# ========== DASHBOARD & ANALYTICS ==========

@app.get("/dashboard/{wallet}")
async def get_dashboard(wallet: str):
    """Get creator dashboard data for a wallet address"""
    
    # Find all agents created by this wallet
    creator_agents = list(agents_collection.find({"creator": wallet}))
    
    if not creator_agents:
        return {
            "wallet": wallet,
            "agents_deployed": 0,
            "total_earnings": 0,
            "total_runs": 0,
            "average_rating": 0,
            "agents": []
        }
    
    # Format agents for response
    formatted_agents = [format_agent_for_response(a) for a in creator_agents]
    
    # Calculate totals
    total_earnings = sum(a["price"] * a["total_runs"] for a in creator_agents)
    total_runs = sum(a["total_runs"] for a in creator_agents)
    avg_rating = sum(a["rating"] for a in creator_agents) / len(creator_agents)
    
    return {
        "wallet": wallet,
        "agents_deployed": len(creator_agents),
        "total_earnings": round(total_earnings, 2),
        "total_runs": total_runs,
        "average_rating": round(avg_rating, 1),
        "agents": formatted_agents
    }

@app.get("/leaderboard")
async def get_leaderboard():
    """Get top agents by ratings and runs"""
    
    # Top rated agents
    top_rated_cursor = agents_collection.find().sort("rating", -1).limit(5)
    top_rated = [format_agent_for_response(a) for a in top_rated_cursor]
    
    # Most run agents
    most_run_cursor = agents_collection.find().sort("total_runs", -1).limit(5)
    most_run = [format_agent_for_response(a) for a in most_run_cursor]
    
    return {
        "top_rated": top_rated,
        "most_popular": most_run
    }

@app.get("/stats")
async def get_stats():
    """Get platform statistics"""
    
    total_agents = agents_collection.count_documents({})
    
    # Aggregation for total runs
    total_runs_pipeline = [{"$group": {"_id": None, "total": {"$sum": "$total_runs"}}}]
    total_runs_result = list(agents_collection.aggregate(total_runs_pipeline))
    total_runs = total_runs_result[0]["total"] if total_runs_result else 0
    
    # Aggregation for total earnings
    total_earnings_pipeline = [{"$group": {"_id": None, "total": {"$sum": {"$multiply": ["$price", "$total_runs"]}}}}]
    total_earnings_result = list(agents_collection.aggregate(total_earnings_pipeline))
    total_earnings = total_earnings_result[0]["total"] if total_earnings_result else 0
    
    total_creators = len(agents_collection.distinct("creator"))
    total_ratings = ratings_collection.count_documents({})
    categories = agents_collection.distinct("category")
    
    return {
        "total_agents": total_agents,
        "total_runs": total_runs,
        "total_earnings": round(total_earnings, 2),
        "total_creators": total_creators,
        "total_ratings": total_ratings,
        "categories": categories
    }

# ========== HEALTH CHECK ==========

@app.get("/health")
async def health():
    """Health check endpoint"""
    # Test MongoDB connection
    mongodb_status = "connected"
    try:
        client.admin.command('ping')
    except:
        mongodb_status = "disconnected"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "groq_connected": bool(os.getenv("GROQ_API_KEY")),
        "mongodb_status": mongodb_status,
        "agents_loaded": agents_collection.count_documents({}),
        "ratings_count": ratings_collection.count_documents({}),
        "version": "1.0.0"
    }

# ============================================
# RUN WITH: uvicorn main:app --reload --port 8000
# ============================================