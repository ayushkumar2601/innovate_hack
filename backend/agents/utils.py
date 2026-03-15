import json
import random
from datetime import datetime
from typing import Dict, Any, List
import re

# ========== TEXT FORMATTING ==========

def format_currency(amount: float, currency: str = "SOL") -> str:
    """Format currency nicely"""
    return f"{amount:.2f} {currency}"

def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text with ellipsis"""
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."

def clean_input(text: str) -> str:
    """Clean user input by removing extra spaces and special chars"""
    # Remove extra spaces
    text = ' '.join(text.split())
    # Remove special characters (keep letters, numbers, spaces)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

# ========== DATA VALIDATION ==========

def validate_price(price: float) -> bool:
    """Check if price is valid (between 0.01 and 100 SOL)"""
    return 0.01 <= price <= 100

def validate_rating(rating: int) -> bool:
    """Check if rating is valid (1-5)"""
    return 1 <= rating <= 5

def validate_wallet_address(address: str) -> bool:
    """Basic wallet address validation"""
    # Solana addresses are base58 and 32-44 chars
    return len(address) >= 32 and len(address) <= 44

# ========== AI PROMPT TEMPLATES ==========

def get_system_prompt(agent_type: str) -> str:
    """Get the appropriate system prompt for each agent type"""
    prompts = {
        "crypto": """You are a professional crypto market analyst with expertise in 
        blockchain technology, tokenomics, and market trends. Provide balanced, 
        data-driven insights without financial advice.""",
        
        "nft": """You are an NFT market analyst specializing in digital collectibles.
        You understand floor prices, rarity, community engagement, and market trends.
        Provide insights without financial advice.""",
        
        "twitter": """You are a social media growth strategist specializing in Twitter/X.
        You help projects grow their audience, increase engagement, and build community.
        Provide actionable, creative strategies.""",
        
        "blog": """You are a professional content writer who creates engaging,
        well-researched blog posts. You adapt your style to match the topic and audience."""
    }
    return prompts.get(agent_type, "You are a helpful AI assistant.")

# ========== RESPONSE PARSING ==========

def extract_key_points(text: str, num_points: int = 3) -> List[str]:
    """Extract key bullet points from AI response"""
    # Look for bullet points or numbered lists
    lines = text.split('\n')
    points = []
    
    for line in lines:
        line = line.strip()
        # Check if line starts with bullet or number
        if line.startswith(('•', '-', '*', '1.', '2.', '3.')):
            # Clean the bullet point
            clean_point = re.sub(r'^[•\-*\d.]\s*', '', line)
            points.append(clean_point)
    
    # Return first num_points points
    return points[:num_points]

def extract_json_from_response(text: str) -> Dict[str, Any]:
    """Extract JSON from AI response (if present)"""
    # Look for JSON between ```json and ``` markers
    json_pattern = r'```json\n(.*?)\n```'
    match = re.search(json_pattern, text, re.DOTALL)
    
    if match:
        try:
            return json.loads(match.group(1))
        except:
            pass
    
    # If no JSON markers, try to find anything that looks like JSON
    try:
        return json.loads(text)
    except:
        return {"error": "No valid JSON found"}

# ========== RANDOM DATA GENERATORS ==========

def generate_random_id(prefix: str = "agent") -> str:
    """Generate a random ID for agents"""
    random_num = random.randint(1000, 9999)
    timestamp = datetime.now().strftime("%y%m%d")
    return f"{prefix}_{timestamp}_{random_num}"

def generate_random_rating() -> float:
    """Generate a random rating between 3.0 and 5.0"""
    return round(random.uniform(3.0, 5.0), 1)

def generate_random_price() -> float:
    """Generate a random price between 0.01 and 0.5 SOL"""
    return round(random.uniform(0.01, 0.5), 2)

# ========== TIME FORMATTING ==========

def format_timestamp(timestamp: str = None) -> str:
    """Format current time or given timestamp"""
    if timestamp:
        dt = datetime.fromisoformat(timestamp)
    else:
        dt = datetime.now()
    
    return dt.strftime("%B %d, %Y at %I:%M %p")

def get_time_ago(timestamp: str) -> str:
    """Convert timestamp to 'X minutes ago' format"""
    try:
        dt = datetime.fromisoformat(timestamp)
        now = datetime.now()
        diff = now - dt
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            return f"{diff.seconds // 3600} hours ago"
        elif diff.seconds > 60:
            return f"{diff.seconds // 60} minutes ago"
        else:
            return "just now"
    except:
        return "unknown time"

# ========== ERROR HANDLING ==========

def safe_execute(func, *args, **kwargs):
    """Execute a function safely and return error message if it fails"""
    try:
        return func(*args, **kwargs), None
    except Exception as e:
        return None, str(e)

def log_error(error: Exception, context: str = ""):
    """Log error with timestamp and context"""
    timestamp = datetime.now().isoformat()
    error_msg = f"[{timestamp}] ERROR in {context}: {str(error)}"
    print(error_msg)
    
    # You could also write to a file
    with open("error.log", "a") as f:
        f.write(error_msg + "\n")

# ========== CONFIGURATION HELPERS ==========

def get_env_variable(key: str, default: str = None) -> str:
    """Get environment variable with error handling"""
    import os
    value = os.getenv(key, default)
    if value is None:
        print(f"⚠️ Warning: Environment variable {key} not set")
    return value

def load_config(config_file: str = "config.json") -> Dict[str, Any]:
    """Load configuration from JSON file"""
    try:
        with open(config_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        print(f"⚠️ Warning: {config_file} is not valid JSON")
        return {}

# Example usage in your agents:
"""
from .utils import format_currency, clean_input, get_system_prompt

class CryptoAgent(BaseAgent):
    def run(self, user_input: str) -> str:
        clean_input_text = clean_input(user_input)
        system_prompt = get_system_prompt("crypto")
        # ... rest of code
        
        result = f"Price: {format_currency(0.05)}"
        return result
"""