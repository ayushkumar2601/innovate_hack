# backend/migrate_local_to_mongodb.py
import json
from database import agents_collection, ratings_collection

# If you have exported JSON files from localStorage
def migrate_from_json(json_file_path):
    with open(json_file_path, 'r') as f:
        data = json.load(f)
    
    # Insert your custom agents
    if data.get('agents'):
        agents_collection.insert_many(data['agents'])
    
    print(f"✅ Migrated {len(data.get('agents', []))} agents to MongoDB")

if __name__ == "__main__":
    # This will seed the default agents
    from database import seed_initial_agents
    seed_initial_agents()