# 📄 API Documentation

## Livestream App API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
No authentication required for this demo application.

---

## Endpoints

### 🩺 Health Check
**GET** `/api/health`  
Checks API and database connectivity.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "collections": ["overlays", "streams"],
  "timestamp": "2024-01-15T10:30:00.123456"
}
```

---

## 🎨 Overlay Management

### Create Overlay
**POST** `/api/overlays`  
Creates a new overlay.

**Body:**
```json
{
  "name": "Company Logo",
  "type": "logo",
  "content": "https://example.com/logo.png",
  "position": { "x": 10, "y": 10 },
  "size": { "width": "100px", "height": "50px" }
}
```

**Response (201):**
```json
{
  "message": "Overlay created successfully",
  "id": "65a1b2c3d4e5f67890123456"
}
```

### Get All Overlays
**GET** `/api/overlays`  
Retrieves all saved overlays.

**Response (200):**
```json
[
  {
    "_id": "65a1b2c3d4e5f67890123456",
    "name": "Company Logo",
    "type": "logo",
    "content": "https://example.com/logo.png",
    "position": { "x": 10, "y": 10 },
    "size": { "width": "100px", "height": "50px" },
    "created_at": "2024-01-15T10:30:00.123456",
    "updated_at": "2024-01-15T10:30:00.123456"
  }
]
```

### Get Single Overlay
**GET** `/api/overlays/:id`  
Retrieves a specific overlay by ID.

**Response (200):** Single overlay object  
**Response (404):**
```json
{"error": "Overlay not found"}
```

### Update Overlay
**PUT** `/api/overlays/:id`  
Updates an existing overlay.

**Body:** Same as create overlay  
**Response (200):**
```json
{"message": "Overlay updated successfully"}
```
**Response (404):**
```json
{"error": "Overlay not found"}
```

### Delete Overlay
**DELETE** `/api/overlays/:id`  
Deletes an overlay.

**Response (200):**
```json
{"message": "Overlay deleted successfully"}
```
**Response (404):**
```json
{"error": "Overlay not found"}
```

---

## 📺 Stream Management

### Create Stream
**POST** `/api/streams`  
Creates a new stream entry.

**Body:**
```json
{
  "name": "My Live Stream",
  "rtsp_url": "rtsp://your-stream-url"
}
```
**Response (201):**
```json
{
  "message": "Stream created successfully",
  "id": "65a1b2c3d4e5f67890123456"
}
```

### Get All Streams
**GET** `/api/streams`  
Retrieves all saved streams.

**Response (200):** Array of stream objects

---

## 🏠 Root Endpoint

**GET** `/`  
API information and available endpoints.

**Response:**
```json
{
  "message": "Livestream API is running!",
  "status": "healthy",
  "database": "connected",
  "endpoints": {
    "health": "/api/health",
    "overlays": "/api/overlays",
    "streams": "/api/streams"
  }
}
```

---

## ⚠️ Error Responses

All endpoints may return these error responses:

**400 Bad Request**
```json
{"error": "Missing required fields"}
```

**404 Not Found**
```json
{"error": "Overlay not found"}
```

**500 Internal Server Error**
```json
{"error": "Database not connected"}
```

---

## 🧩 Data Models

### Overlay Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "type": "text|logo",
  "content": "string",
  "position": { "x": "number", "y": "number" },
  "size": { "width": "string", "height": "string" },
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### Stream Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "rtsp_url": "string",
  "is_active": "boolean",
  "created_at": "ISODate"
}
```

---

## 🧪 Example Usage

### Creating a Text Overlay
```bash
curl -X POST http://localhost:5000/api/overlays   -H "Content-Type: application/json"   -d '{
    "name": "Watermark",
    "type": "text",
    "content": "Live Now!",
    "position": {"x": 20, "y": 20},
    "size": {"width": "120px", "height": "40px"}
  }'
```

### Creating a Logo Overlay
```bash
curl -X POST http://localhost:5000/api/overlays   -H "Content-Type: application/json"   -d '{
    "name": "Brand Logo",
    "type": "logo", 
    "content": "https://example.com/logo.png",
    "position": {"x": 10, "y": 10},
    "size": {"width": "80px", "height": "80px"}
  }'
```

---

## 🎥 Testing RTSP URLs

For development and testing, you can use these public RTSP streams:

```
rtsp://rtsp.stream/pattern
rtsp://rtsp.stream/movie
rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4
```
