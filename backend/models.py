from datetime import datetime
from flask_pymongo import PyMongo
from bson import ObjectId

class OverlayManager:
    def __init__(self, mongo):
        self.mongo = mongo
        self.overlays = mongo.db.overlays

    def create_overlay(self, data):
        overlay_data = {
            'name': data['name'],
            'type': data['type'],
            'content': data['content'],
            'position': data['position'],
            'size': data['size'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = self.overlays.insert_one(overlay_data)
        return str(result.inserted_id)

    def get_all_overlays(self):
        return list(self.overlays.find())

    def get_overlay(self, overlay_id):
        return self.overlays.find_one({'_id': ObjectId(overlay_id)})

    def update_overlay(self, overlay_id, data):
        data['updated_at'] = datetime.utcnow()
        result = self.overlays.update_one(
            {'_id': ObjectId(overlay_id)},
            {'$set': data}
        )
        return result.modified_count > 0

    def delete_overlay(self, overlay_id):
        result = self.overlays.delete_one({'_id': ObjectId(overlay_id)})
        return result.deleted_count > 0