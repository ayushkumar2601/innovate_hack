# backend/agents/base.py

from groq import Groq
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()

class BaseAgent:
    def __init__(self):
        # Initialize Groq client
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            self.client = Groq(api_key=api_key)
            print("✅ Groq client initialized")
        else:
            self.client = None
            print("⚠️ WARNING: GROQ_API_KEY not found. Using mock responses.")
    
    # ⚠️ THIS FUNCTION MUST BE INSIDE THE CLASS (indented!)
    def generate_response(self, prompt, system_message):
        """Generate AI response using Groq"""
        
        if not self.client:
            return self.get_mock_response(prompt)
        
        try:
            print(f"Calling Groq with prompt: {prompt[:50]}...")
            
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            result = response.choices[0].message.content
            print("✅ Got response from Groq")
            return result
            
        except Exception as e:
            print(f"Error calling Groq: {e}")
            return self.get_mock_response(prompt)
    
    # ⚠️ THIS FUNCTION MUST ALSO BE INSIDE THE CLASS!
    def get_mock_response(self, prompt):
        """Fallback mock response if Groq fails"""
        return f"[Mock Response] This would be an AI-generated response for: {prompt[:50]}..."