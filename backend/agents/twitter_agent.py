# backend/agents/twitter_agent.py

from .base import BaseAgent

class TwitterAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Twitter Growth Agent"
        self.category = "Social Media"
        self.description = "Creates Twitter growth strategies and content ideas"
        self.price = 0.03  # in SOL
    
    def run(self, user_input):
        """
        Generate Twitter strategy based on user input
        Example: "Grow my crypto project on Twitter" or "Content ideas for NFT project"
        """
        
        prompt = f"""
        Create a Twitter growth strategy for:
        
        Project/Topic: {user_input}
        
        Please provide:
        1. Profile optimization tips
        2. Content strategy (what to post)
        3. 5 specific tweet ideas
        4. Best times to post
        5. Engagement tactics to grow followers
        
        Make it actionable and specific.
        """
        
        system_message = """You are a social media growth strategist specializing in Twitter/X.
        You help projects grow their audience, increase engagement, and build community.
        Provide creative, actionable strategies."""
        
        return self.generate_response(prompt, system_message)

# Create a single instance
twitter_agent = TwitterAgent()