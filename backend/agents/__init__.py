# backend/agents/__init__.py
# This makes importing agents easier

from .crypto_agent import CryptoAgent, crypto_agent
from .blog_agent import BlogAgent, blog_agent
from .base import BaseAgent

# Define what gets imported with "from agents import *"
__all__ = [
    'CryptoAgent',
    'crypto_agent', 
    'BlogAgent',
    'blog_agent',
    'BaseAgent'
]

# Optional: Print when package loads (for debugging)
print("✅ Agents package loaded successfully")