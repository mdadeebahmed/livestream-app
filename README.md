# 🎥 Livestream App with Overlay Management

A full-stack web application for streaming video content with customizable overlays. Built with React frontend, Flask backend, and MongoDB database.

![Livestream App](https://img.shields.io/badge/Full--Stack-Livestream-blue)
![Python](https://img.shields.io/badge/Python-Flask-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

- **🎥 Live Video Streaming** - Support for RTSP and browser-compatible streams
- **🖼️ Custom Overlays** - Add text and logo overlays to your streams
- **🎮 Drag & Drop** - Position overlays anywhere on the video
- **💾 CRUD Operations** - Create, read, update, and delete overlay settings
- **☁️ Cloud Database** - MongoDB Atlas integration for data persistence
- **📱 Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React 18
- CSS3 with modern gradients and animations
- React Draggable for overlay positioning

**Backend:**
- Python Flask
- MongoDB with PyMongo
- CORS enabled for cross-origin requests

**Database:**
- MongoDB Atlas (Cloud) or Local MongoDB

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (Local or Atlas Cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livestream-app

2. **Backend Setup**
    cd backend
    python -m venv venv

    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate

    pip install -r requirements.txt

    # Set up environment variables
    cp .env.example .env
    # Edit .env with your MongoDB connection string

    python app.p

3. **Frontend Setup (New Terminal)**

    cd frontend
    npm install
    npm start

4. **Access the Application**

    Frontend: http://localhost:3000

    Backend API: http://localhost:5000

**Project Structure**


livestream-app/
├── backend/          # Flask API server
├── frontend/         # React application
└── documentation/    # API and user guides


**Usage**

  *Starting a Stream*

    Enter a stream name and RTSP URL

    Click "Start Stream"

    Use play/pause and volume controls

  *Managing Overlays*

    Click "+ Add Overlay"

    Choose type (Text or Logo)

    Configure position and size

    Drag overlays on the video to position them

**Example RTSP URLs for Testing**

    rtsp://rtsp.stream/pattern
    https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4

**Documentation**

- [**API Documentation**](https://github.com/mdadeebahmed/livestream-app/blob/main/documentation/API_documentation.md) - Complete API reference

- [**User Guide**](https://github.com/mdadeebahmed/livestream-app/blob/main/documentation/USER_documentation.md) - Setup and usage instructions

**Troubleshooting**

  *Common Issues*
  "Database not connected"

    Check MongoDB connection string in .env

    Ensure MongoDB service is running

  "Error playing video"

    Use browser-compatible test streams

    RTSP requires conversion for browsers

  Frontend connection issues

    Verify backend is running on port 5000

    Check CORS configuration

**Contributing**

*Fork the repository*

  Create a feature branch (git checkout -b feature/amazing-feature)

  Commit your changes (git commit -m 'Add amazing feature')

  Push to the branch (git push origin feature/amazing-feature)

  Open a Pull Request

**License**

  This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Happy Streaming! 
=======
# livestream-app
