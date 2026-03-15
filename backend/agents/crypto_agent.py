# backend/agents/crypto_agent.py

from .base import BaseAgent

class CryptoAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Crypto Analysis Agent"
        self.category = "Finance"
        self.description = "Analyzes cryptocurrency trends and provides market insights"
        self.price = 0.05  # in SOL
    
    def run(self, user_input):
        """
        Analyze a cryptocurrency based on user input
        Example: "Analyze Solana" or "What do you think about Bitcoin?"
        """
        
        # Create the prompt for OpenAI
        prompt = f"""
        Analyze this cryptocurrency and provide a detailed report:
        
        Token/Project: {user_input}
        
        Please include:
        1. What is this project? (brief overview)
        2. Current market sentiment (bullish/bearish/neutral)
        3. Key strengths and weaknesses
        4. Risk level (low/medium/high)
        5. Short-term outlook (1-7 days)
        
        Keep it informative but concise (under 300 words).
        """
        
        # System message defines the AI's role
        system_message = """You are a professional crypto market analyst. 
        Provide balanced, factual insights without giving financial advice.
        Be honest about risks and uncertainties."""
        
        # Get response from AI (or mock if no API key)
        return self.generate_response(prompt, system_message)

# Create a single instance to export
crypto_agent = CryptoAgent()