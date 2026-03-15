# backend/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Get MongoDB URI from environment variable
MONGODB_URI = os.getenv("MONGODB_URI")

# Create MongoDB client
client = MongoClient(MONGODB_URI)
db = client["innovat3"]  # database name
agents_collection = db["agents"]  # collection for agents
ratings_collection = db["ratings"]  # collection for ratings

def init_db():
    """Initialize database with indexes"""
    # Create indexes for faster queries
    agents_collection.create_index("id", unique=True)
    agents_collection.create_index("creator")
    agents_collection.create_index("category")
    ratings_collection.create_index("agent_id")

def seed_initial_agents():
    """Add default agents if database is empty"""
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
                "created_at": "2024-01-15"
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
                "created_at": "2024-01-20"
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
                "created_at": "2024-02-01"
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
                "created_at": "2024-02-20"
            }
        ]
        agents_collection.insert_many(default_agents)
        print("✅ Default agents seeded to MongoDB")