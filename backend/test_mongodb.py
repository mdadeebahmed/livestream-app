import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/livestream_app')
print(f"Testing MongoDB URI: {MONGO_URI}")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    print(f"📊 Databases: {client.list_database_names()}")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("\n💡 Troubleshooting:")
    print("1. Is MongoDB running?")
    print("2. Check your MONGO_URI in .env file")
    print("3. For MongoDB Atlas: Check network access and credentials")