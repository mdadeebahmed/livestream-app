# 📘 User Documentation

## Livestream App User Guide

### 🧭 Overview
The **Livestream App** allows you to stream video content with customizable overlays.  
You can add **text** and **logo overlays**, position them on your video stream, and manage them through an intuitive interface.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js (v14 or higher)** – [Download](https://nodejs.org/)
- **Python (v3.8 or higher)** – [Download](https://www.python.org/downloads/)
- **MongoDB** – Local or [Atlas Cloud](https://www.mongodb.com/atlas)

---

### Installation

#### 1️⃣ Download and Extract the project files

#### 2️⃣ Backend Setup:
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

#### 3️⃣ Frontend Setup (New Terminal):
```bash
cd frontend
npm install
npm start
```

#### 4️⃣ Access the Application:
- **Frontend:** [http://localhost:3000](http://localhost:3000)  
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🎥 Using the Application

### Starting a Stream
1. Open **http://localhost:3000** in your browser  
2. Enter Stream Details:
   - **Stream Name:** Descriptive name for your stream  
   - **RTSP URL:** Your video stream URL  
3. Click **▶ Start Stream**

**Example RTSP URLs for Testing:**
```
rtsp://rtsp.stream/pattern
rtsp://rtsp.stream/movie
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

---

## 🧱 Managing Overlays

### Adding Overlays
1. Click **"+ Add Overlay"** in the right panel  
2. Fill in the form:
   - **Name:** Descriptive name (e.g., "Company Logo")  
   - **Type:** Choose "Text" or "Logo"  
   - **Content:**  
     - For text: Enter the text to display  
     - For logo: Enter image URL  
   - **Size:** Width and height (e.g., `"150px"`, `"50px"`)  
3. Click **"Create Overlay"**

### Positioning Overlays
- After creation, overlays appear on the video  
- Click and drag to position them anywhere  
- Positions are automatically saved

### Editing Overlays
- Click **"Edit"** on any overlay in the list  
- Modify the properties  
- Click **"Update Overlay"**

### Deleting Overlays
- Click **"Delete"** on any overlay  
- Confirm deletion in the dialog

---

## 🎛️ Video Controls
- **Play/Pause:** Control video playback  
- **Volume:** Adjust audio level (0–100%)  
- Overlays remain visible and draggable during playback

---

## ✨ Features

### Overlay Types
#### 📝 Text Overlays
- Display custom text on your stream  
- Customizable font size through dimensions  
- Perfect for watermarks, titles, or information

#### 🖼️ Logo Overlays
- Display images/logo on your stream  
- Supports any image URL  
- Maintains aspect ratio when resized

### Real-time Management
- Overlays update in real-time  
- Drag-and-drop positioning  
- Instant save to database  
- Responsive design works on all devices

---

## 🧰 Troubleshooting

### Common Issues

#### ❌ "Database not connected"
- Check MongoDB is running  
- Verify connection string in `backend/.env`  
- For MongoDB Atlas: Check network access settings

#### ⚠️ "Error playing video"
- RTSP streams require conversion for browsers  
- Use the provided test URLs for compatibility  
- The app includes fallback to compatible formats

#### 🧱 Overlays not saving
- Check backend server is running on port `5000`  
- Verify MongoDB connection  
- Check browser console for errors

#### 🧩 Frontend not loading
- Ensure Node.js is installed  
- Run `npm install` in frontend folder  
- Check port `3000` is available

---

## 📺 Video Stream Compatibility

### Supported Formats:
✅ MP4 files (direct URL)  
✅ HLS streams (`.m3u8`)  
✅ WebM files  
⚠️ RTSP (requires conversion – use test streams)

### Recommended Test Streams:
```bash
# Browser-compatible streams:
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8
```

---

## ⚙️ Advanced Configuration

### MongoDB Setup

#### Option A: Local MongoDB
1. Install **MongoDB Community Edition**  
2. Start MongoDB service  
3. Use connection string:  
   ```bash
   mongodb://localhost:27017/livestream_app
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)  
2. Create a free cluster  
3. Get connection string from Atlas dashboard  
4. Update `MONGO_URI` in `backend/.env`

### Environment Configuration
Backend `.env` file example:
```bash
MONGO_URI=mongodb+srv://username:password@cluster.abc123.mongodb.net/livestream_app?retryWrites=true&w=majority
SECRET_KEY=your-generated-secret-key
FLASK_ENV=development
```

---

## 🆘 Support

### Getting Help
- Check the browser console for error messages  
- Verify both backend and frontend servers are running  
- Test API endpoints directly at **http://localhost:5000**  
- Check MongoDB connection status

### Performance Tips
- Use optimized image sizes for logo overlays  
- Keep number of active overlays reasonable  
- Use compatible video formats for better performance  
- Close other applications using network bandwidth

---

## ❓ FAQ

**Q: Can I use my camera's RTSP stream?**  
A: Yes, but browsers don't support RTSP directly. For production, you'll need to convert RTSP to HLS/WebRTC.

**Q: Are overlays saved permanently?**  
A: Yes, all overlays are saved in MongoDB and persist between sessions.

**Q: Can I use custom fonts?**  
A: Currently uses system fonts, but can be extended with custom CSS.

**Q: Is this ready for production?**  
A: The foundation is production-ready, but RTSP handling would need enhancement for browser compatibility.
