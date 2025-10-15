import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StreamPlayer from './components/StreamPlayer';
import OverlayManager from './components/OverlayManager';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [overlays, setOverlays] = useState([]);
  const [streams, setStreams] = useState([]);
  const [currentStream, setCurrentStream] = useState('');
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [streamName, setStreamName] = useState('My Live Stream');

  useEffect(() => {
    fetchOverlays();
    fetchStreams();
  }, []);

  const fetchOverlays = async () => {
    try {
      const response = await axios.get(`${API_BASE}/overlays`);
      setOverlays(response.data);
    } catch (error) {
      console.error('Error fetching overlays:', error);
    }
  };

  const fetchStreams = async () => {
    try {
      const response = await axios.get(`${API_BASE}/streams`);
      setStreams(response.data);
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const handleStartStream = async () => {
    if (!currentStream) {
      alert('Please enter an RTSP URL');
      return;
    }

    try {
      await axios.post(`${API_BASE}/streams`, {
        rtsp_url: currentStream,
        name: streamName
      });
      setIsStreamActive(true);
      fetchStreams();
    } catch (error) {
      console.error('Error starting stream:', error);
      alert('Error starting stream: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleStopStream = () => {
    setIsStreamActive(false);
    setCurrentStream('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎥 Livestream App</h1>
        <p>Stream RTSP videos with custom overlays</p>
      </header>

      <div className="app-container">
        <div className="stream-section">
          <div className="stream-controls">
            <div className="input-group">
              <label>Stream Name:</label>
              <input
                type="text"
                placeholder="My Live Stream"
                value={streamName}
                onChange={(e) => setStreamName(e.target.value)}
                className="stream-name-input"
              />
            </div>
            
            <div className="input-group">
              <label>RTSP URL:</label>
              <input
                type="text"
                placeholder="rtsp://your-stream-url"
                value={currentStream}
                onChange={(e) => setCurrentStream(e.target.value)}
                className="rtsp-input"
              />
            </div>
            
            <div className="control-buttons">
              {!isStreamActive ? (
                <button onClick={handleStartStream} className="start-btn">
                  ▶ Start Stream
                </button>
              ) : (
                <button onClick={handleStopStream} className="stop-btn">
                  ⏹ Stop Stream
                </button>
              )}
            </div>
          </div>

          {isStreamActive ? (
            <StreamPlayer 
              rtspUrl={currentStream} 
              overlays={overlays} 
              streamName={streamName}
            />
          ) : (
            <div className="stream-placeholder">
              <div className="placeholder-content">
                <h3>No Active Stream</h3>
                <p>Enter RTSP URL and click "Start Stream" to begin broadcasting</p>
                <div className="example-urls">
                  <p><strong>Example RTSP URLs for testing:</strong></p>
                  <ul>
                    <li>rtsp://rtsp.stream/pattern</li>
                    <li>rtsp://rtsp.stream/movie</li>
                    <li>rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overlay-section">
          <OverlayManager 
            overlays={overlays} 
            onOverlayUpdate={fetchOverlays} 
          />
        </div>
      </div>

      <footer className="app-footer">
        <p>Livestream App &copy; 2025 | Built with React & Flask</p>
      </footer>
    </div>
  );
}

export default App;