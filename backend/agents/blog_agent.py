# backend/agents/blog_agent.py

from .base import BaseAgent

class BlogAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Blog Writer Agent"
        self.category = "Content"
        self.description = "Writes high-quality blog posts on any topic"
        self.price = 0.03  # in SOL
    
    def run(self, user_input):
        """
        Write a blog post based on user input
        Example: "Write about Solana blockchain" or "Article about NFT trends 2024"
        """
        
        prompt = f"""
        Write a blog post about:
        
        Topic: {user_input}
        
        Please include:
        1. Catchy title
        2. Introduction that hooks the reader
        3. 3-4 main points with explanations
        4. Conclusion with key takeaways
        
        Make it engaging, informative, and well-structured.
        Keep it around 500 words.
        """
        
        system_message = """You are a professional content writer who creates engaging,
        well-researched blog posts. You adapt your style to match the topic and audience.
        Write in a clear, accessible style."""
        
        return self.generate_response(prompt, system_message)

# Create a single instance
blog_agent = BlogAgent()