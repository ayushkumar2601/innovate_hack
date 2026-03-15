# backend/agents/nft_agent.py

from .base import BaseAgent

class NFTAnalysisAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "NFT Analysis Agent"
        self.category = "NFTs"
        self.description = "Analyzes NFT collections and provides market insights"
        self.price = 0.04  # in SOL
    
    def run(self, user_input):
        """
        Analyze an NFT collection based on user input
        Example: "Analyze Bored Ape Yacht Club" or "Thoughts on Pudgy Penguins?"
        """
        
        prompt = f"""
        Analyze this NFT collection and provide a report:
        
        Collection: {user_input}
        
        Please include:
        1. What is this collection? (brief overview)
        2. Market metrics (floor price, volume, holders)
        3. Community strength and engagement
        4. Long-term potential
        5. Risks to consider
        
        Keep it informative but concise (under 300 words).
        """
        
        system_message = """You are an NFT market analyst specializing in digital collectibles.
        You understand floor prices, rarity, community engagement, and market trends.
        Provide insights without financial advice."""
        
        return self.generate_response(prompt, system_message)

# Create a single instance
nft_agent = NFTAnalysisAgent()