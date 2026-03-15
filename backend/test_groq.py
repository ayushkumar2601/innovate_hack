# backend/test_groq.py

from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
print(f"API Key exists: {bool(api_key)}")

if api_key:
    client = Groq(api_key=api_key)
    
    # Test with current models
    models_to_test = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant", 
        "gemma2-9b-it"
    ]
    
    for model in models_to_test:
        print(f"\nTesting model: {model}")
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Say hello in 5 words"}
                ],
                max_tokens=20
            )
            print(f"✅ Success! Response: {response.choices[0].message.content}")
            break  # Stop after first success
        except Exception as e:
            print(f"❌ Failed: {e}")
else:
    print("❌ No API key found")