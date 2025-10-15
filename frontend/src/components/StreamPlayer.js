import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

const StreamPlayer = ({ rtspUrl, overlays, streamName }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // In production, you would integrate with a proper RTSP player
    // This is a placeholder for video functionality
    console.log('Stream URL:', rtspUrl);
  }, [rtspUrl]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing video:', error);
        alert('Error playing video. This demo uses a placeholder. In production, RTSP streams would be converted for browser compatibility.');
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

  return (
    <div className="stream-player">
      <div className="stream-header">
        <h3>{streamName}</h3>
        <span className="live-badge">LIVE</span>
      </div>
      
      <div className="video-container">
        {/* Placeholder video element - in production, use RTSP-compatible player */}
        <video
          ref={videoRef}
          className="video-element"
          poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
          controls={false}
        >
          <source src="" type="video/mp4" />
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
                    e.target.nextSibling.style.display = 'block';
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
        <div className="stream-info">
          <small>RTSP: {rtspUrl.substring(0, 30)}...</small>
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;