from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

CORS(app)

# MongoDB Connection with proper error handling
def get_mongo_client():
    try:
        MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/livestream_app')
        print(f"🔗 Connecting to MongoDB...")
        
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
        # Test the connection
        client.admin.command('ping')
        
        # Get database name from URI or use default
        db_name = MONGO_URI.split('/')[-1].split('?')[0]
        if not db_name or db_name == '?':
            db_name = 'livestream_app'
            
        db = client[db_name]
        print(f"✅ MongoDB connection successful!")
        print(f"📊 Database: {db_name}")
        return client, db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None, None

# Initialize MongoDB
mongo_client, db = get_mongo_client()

# FIXED: Proper JSON encoder for MongoDB objects
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super(JSONEncoder, self).default(obj)

app.json_encoder = JSONEncoder

# FIXED: Helper function to convert MongoDB documents to JSON
def serialize_doc(doc):
    if doc is None:
        return None
    if '_id' in doc and isinstance(doc['_id'], ObjectId):
        doc['_id'] = str(doc['_id'])
    if 'created_at' in doc and isinstance(doc['created_at'], datetime):
        doc['created_at'] = doc['created_at'].isoformat()
    if 'updated_at' in doc and isinstance(doc['updated_at'], datetime):
        doc['updated_at'] = doc['updated_at'].isoformat()
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

@app.route('/')
def home():
    db_status = 'connected' if mongo_client is not None else 'disconnected'
    return jsonify({
        'message': 'Livestream API is running!',
        'status': 'healthy',
        'database': db_status,
        'endpoints': {
            'health': '/api/health',
            'overlays': '/api/overlays',
            'streams': '/api/streams'
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        if mongo_client is not None:
            mongo_client.admin.command('ping')
            db_status = 'connected'
            # Ensure collections exist
            if db is not None:
                collections = db.list_collection_names()
                if 'overlays' not in collections:
                    db.create_collection('overlays')
                if 'streams' not in collections:
                    db.create_collection('streams')
        else:
            db_status = 'disconnected'
        
        return jsonify({
            'status': 'healthy' if db_status == 'connected' else 'degraded',
            'database': db_status,
            'collections': db.list_collection_names() if db is not None else [],
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500

# Overlay CRUD Operations
@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    if db is None:
        return jsonify({'error': 'Database not connected. Please check MongoDB configuration.'}), 500
        
    try:
        data = request.get_json()
        required_fields = ['name', 'type', 'content', 'position', 'size']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        overlay_data = {
            'name': data['name'],
            'type': data['type'],
            'content': data['content'],
            'position': data['position'],
            'size': data['size'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = db.overlays.insert_one(overlay_data)
        return jsonify({
            'message': 'Overlay created successfully', 
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    if db is None:
        return jsonify({'error': 'Database not connected'}), 500
        
    try:
        # FIXED: Use serialize_docs to convert MongoDB documents
        overlays_cursor = db.overlays.find().sort('created_at', -1)
        overlays_list = list(overlays_cursor)
        serialized_overlays = serialize_docs(overlays_list)
        return jsonify(serialized_overlays), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    if db is None:
        return jsonify({'error': 'Database not connected'}), 500
        
    try:
        overlay = db.overlays.find_one({'_id': ObjectId(overlay_id)})
        if overlay:
            # FIXED: Serialize the single document
            serialized_overlay = serialize_doc(overlay)
            return jsonify(serialized_overlay), 200
        return jsonify({'error': 'Overlay not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    if db is None:
        return jsonify({'error': 'Database not connected'}), 500
        
    try:
        data = request.get_json()
        data['updated_at'] = datetime.utcnow()
        
        result = db.overlays.update_one(
            {'_id': ObjectId(overlay_id)},
            {'$set': data}
        )
        
        if result.modified_count > 0:
            return jsonify({'message': 'Overlay updated successfully'}), 200
        return jsonify({'error': 'Overlay not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    if db is None:
        return jsonify({'error': 'Database not connected'}), 500
        
    try:
        result = db.overlays.delete_one({'_id': ObjectId(overlay_id)})
        if result.deleted_count > 0:
            return jsonify({'message': 'Overlay deleted successfully'}), 200
        return jsonify({'error': 'Overlay not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Stream management endpoints
@app.route('/api/streams', methods=['POST'])
def create_stream():
    if db is None:
        return jsonify({'error': 'Database not connected'}), 500
        
    try:
        data = request.get_json()
        rtsp_url = data.get('rtsp_url')
        name = data.get('name', 'Live Stream')
        
        if not rtsp_url:
            return jsonify({'error': 'RTSP URL is required'}), 400
        
        stream_data = {
            'name': name,
            'rtsp_url': rtsp_url,
            'created_at': datetime.utcnow(),
            'is_active': True
        }
        
        result = db.streams.insert_one(stream_data)
        return jsonify({
            'message': 'Stream created successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/streams', methods=['GET'])
def get_streams():
    if db is None:
        return jsonify({'error': 'Database not connected'}), 500
        
    try:
        # FIXED: Use serialize_docs for streams too
        streams_cursor = db.streams.find().sort('created_at', -1)
        streams_list = list(streams_cursor)
        serialized_streams = serialize_docs(streams_list)
        return jsonify(serialized_streams), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'available_endpoints': {
            'root': '/',
            'health': '/api/health',
            'overlays': '/api/overlays',
            'streams': '/api/streams'
        }
    }), 404

if __name__ == '__main__':
    print("🚀 Starting Livestream API Server...")
    print("📍 Base URL: http://localhost:5000")
    
    if mongo_client is not None and db is not None:
        print("✅ MongoDB: Connected")
        print(f"📊 Database: {db.name}")
        print(f"🗄️ Collections: {db.list_collection_names()}")
    else:
        print("❌ MongoDB: Not connected")
        print("💡 Some features will not work without database connection")
    
    print("🔗 Available endpoints:")
    print("   - http://localhost:5000/")
    print("   - http://localhost:5000/api/health") 
    print("   - http://localhost:5000/api/overlays")
    print("   - http://localhost:5000/api/streams")
    
    app.run(debug=True, host='0.0.0.0', port=5000)