import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

// Browser-compatible test streams
const testStreams = [
  {
    name: "Big Buck Bunny (MP4)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "mp4",
    description: "High quality animation - Works in all browsers"
  },
  {
    name: "Live HLS Stream", 
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    type: "hls",
    description: "Live HLS stream - Modern browsers only"
  },
  {
    name: "Elephants Dream (MP4)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    type: "mp4", 
    description: "Open movie - Universal browser support"
  }
];

const StreamPlayer = ({ rtspUrl, overlays, streamName }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedTestStream, setSelectedTestStream] = useState('');

  // Auto-select first test stream if no RTSP provided
  useEffect(() => {
    if (!rtspUrl && testStreams.length > 0) {
      setSelectedTestStream(testStreams[0].url);
    }
  }, [rtspUrl]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing video:', error);
        // Show helpful message for RTSP streams
        if (rtspUrl && rtspUrl.startsWith('rtsp://')) {
          alert('RTSP streams require conversion for browser compatibility. Please use one of the test streams below.');
        }
      });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const currentStreamUrl = selectedTestStream || rtspUrl;

  return (
    <div className="stream-player">
      <div className="stream-header">
        <h3>{streamName}</h3>
        <span className="live-badge">LIVE</span>
      </div>
      
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-element"
          controls={false}
          key={currentStreamUrl} // Force re-render on stream change
        >
          <source src={currentStreamUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Render draggable overlays */}
        {overlays.map((overlay) => (
          <Draggable key={overlay._id} bounds="parent">
            <div
              className={`overlay ${overlay.type}`}
              style={{
                position: 'absolute',
                width: overlay.size?.width || '100px',
                height: overlay.size?.height || '50px',
                left: overlay.position?.x || 0,
                top: overlay.position?.y || 0,
                zIndex: 1000
              }}
            >
              {overlay.type === 'text' && (
                <span style={{ 
                  fontSize: 'inherit', 
                  color: 'inherit',
                  fontWeight: 'bold'
                }}>
                  {overlay.content}
                </span>
              )}
              {overlay.type === 'logo' && (
                <img 
                  src={overlay.content} 
                  alt="Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
          </Draggable>
        ))}
      </div>

      <div className="player-controls">
        <button onClick={handlePlay} disabled={isPlaying}>
          ▶ Play
        </button>
        <button onClick={handlePause} disabled={!isPlaying}>
          ⏸ Pause
        </button>
        <div className="volume-control">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Test Stream Selector */}
      <div className="test-streams-section">
        <h4>🎯 Test Streams (Browser Compatible)</h4>
        <div className="stream-buttons">
          {testStreams.map((stream, index) => (
            <button
              key={index}
              className={`stream-btn ${selectedTestStream === stream.url ? 'active' : ''}`}
              onClick={() => setSelectedTestStream(stream.url)}
            >
              {stream.name}
            </button>
          ))}
        </div>
        {selectedTestStream && (
          <p className="stream-info">
            Now playing: {testStreams.find(s => s.url === selectedTestStream)?.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StreamPlayer;