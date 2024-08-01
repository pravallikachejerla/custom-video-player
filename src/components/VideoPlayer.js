// src/components/VideoPlayer.js
import React, { useRef, useState } from 'react';
import './VideoPlayer.css';

const resolutions = [
  { label: '144p', value: '/videos/video-144.mp4' },
  { label: '240p', value: '/videos/video-240.mp4' },
  { label: '320p', value: '/videos/video-320.mp4' },
  { label: '480p', value: '/videos/video-480.mp4' },
  { label: '720p', value: '/videos/video-720.mp4' },
  { label: '1080p', value: '/videos/video-1080.mp4' }
];

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [resolution, setResolution] = useState(resolutions[0].value);

  const handlePlayPause = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleForward = () => {
    videoRef.current.currentTime += 10;
  };

  const handleBackward = () => {
    videoRef.current.currentTime -= 5;
  };

  const handleResolutionChange = (event) => {
    const newResolution = event.target.value;
    setResolution(newResolution);
    const currentTime = videoRef.current.currentTime;
    videoRef.current.src = newResolution;
    videoRef.current.currentTime = currentTime;
    if (playing) {
      videoRef.current.play();
    }
  };

  const handlePressHoldLeft = () => {
    const interval = setInterval(() => {
      videoRef.current.currentTime -= 3;
    }, 100);
    return interval;
  };

  const handlePressHoldRight = () => {
    const interval = setInterval(() => {
      videoRef.current.currentTime += 2;
    }, 100);
    return interval;
  };

  const handleDoubleTap = (e) => {
    const rect = videoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.3) {
      handleBackward();
    } else if (x > width * 0.7) {
      handleForward();
    } else {
      handlePlayPause();
    }
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={resolution}
        controls
        onDoubleClick={handleDoubleTap}
        onMouseDown={(e) => {
          const rect = videoRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const width = rect.width;

          let interval;
          if (x < width * 0.3) {
            interval = handlePressHoldLeft();
          } else if (x > width * 0.7) {
            interval = handlePressHoldRight();
          }

          const mouseUpHandler = () => {
            clearInterval(interval);
            document.removeEventListener('mouseup', mouseUpHandler);
          };

          document.addEventListener('mouseup', mouseUpHandler);
        }}
      />
      <div className="controls">
        <label htmlFor="resolution">Resolution: </label>
        <select id="resolution" value={resolution} onChange={handleResolutionChange}>
          {resolutions.map((res) => (
            <option key={res.value} value={res.value}>
              {res.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VideoPlayer;
