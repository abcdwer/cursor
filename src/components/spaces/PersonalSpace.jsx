import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PersonalSpace.css';

// 将放映室提取为独立组件
const VideoPlayer = ({ videos, currentVideoIndex, setCurrentVideoIndex, isPlaying, setIsPlaying, handleVideoEnd }) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="video-player" ref={playerRef}>
      <video
        ref={videoRef}
        src={videos[currentVideoIndex].url}
        className="video-element"
        autoPlay={isPlaying}
        onEnded={handleVideoEnd}
      />
      <div className="video-controls">
        <div className="controls-left">
          <button className="control-btn play-btn" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
        
        <div className="controls-center">
          <button 
            className="control-btn prev-btn"
            onClick={() => {
              setCurrentVideoIndex((prev) => 
                prev === 0 ? videos.length - 1 : prev - 1
              );
            }}
          >
            ⏮
          </button>
          <button 
            className="control-btn next-btn"
            onClick={() => {
              setCurrentVideoIndex((prev) => 
                (prev + 1) % videos.length
              );
            }}
          >
            ⏭
          </button>
        </div>

        <div className="controls-right">
          <div className="volume-control">
            <button className="control-btn volume-btn" onClick={toggleMute}>
              {isMuted ? '🔇' : volume <= 0.3 ? '🔈' : volume <= 0.7 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
            />
          </div>
          <button className="control-btn fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? '⊙' : '⛶'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PersonalSpace = () => {
  const [weather, setWeather] = useState('sunny');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [particles, setParticles] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // 生成粒子效果
  const generateParticles = useCallback(() => {
    const newParticles = Array(50).fill(null).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, [generateParticles]);

  // 视频列表
  const videos = [
    { id: 1, url: "video1.mp4", title: "回忆1" },
    { id: 2, url: "video2.mp4", title: "回忆2" },
    { id: 3, url: "video3.mp4", title: "回忆3" },
    // ... 更多视频
  ];

  // 处理视频结束
  const handleVideoEnd = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % videos.length;
      return nextIndex;
    });
    setIsPlaying(true); // 确保下一个视频自动播放
  }, [videos.length]);

  return (
    <div className={`personal-space ${weather} ${timeOfDay}`}>
      <div className="scene-wrapper">
        {/* 粒子效果 */}
        <div className="particles-container">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                '--x': `${particle.x}%`,
                '--y': `${particle.y}%`,
                '--size': `${particle.size}px`,
                '--speed': `${particle.speed}s`
              }}
            />
          ))}
        </div>

        {/* 天空层 */}
        <div className="sky-container">
          <div className="celestial-body">
            {timeOfDay === 'night' ? (
              <div className="moon">
                <div className="moon-crater" />
                <div className="moon-crater" />
                <div className="moon-crater" />
              </div>
            ) : (
              <div className="sun">
                <div className="sun-rays" />
              </div>
            )}
          </div>
          
          {/* 改进的天气效果 */}
          {weather === 'rainy' && (
            <div className="rain-container">
              {Array(20).fill(null).map((_, i) => (
                <div key={i} className="raindrop" style={{ '--delay': `${i * 0.1}s` }} />
              ))}
            </div>
          )}
          {weather === 'snowy' && (
            <div className="snow-container">
              {Array(30).fill(null).map((_, i) => (
                <div key={i} className="snowflake" style={{ '--delay': `${i * 0.2}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* 魔法树 */}
        <div className="magical-tree-container">
          <svg className="tree-svg" viewBox="0 0 400 600">
            {/* 树干纹理 */}
            <defs>
              <pattern id="barkPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0 0 Q10 10 20 0 Q10 20 0 20" fill="none" stroke="#4a3728" strokeWidth="1" />
              </pattern>
            </defs>
            
            {/* 主干 */}
            <path 
              className="tree-trunk"
              d="M180 550 C200 400 220 300 200 150"
              fill="url(#barkPattern)"
              stroke="#5d3a1a"
              strokeWidth="40"
            />
            
            {/* 树枝系统 */}
            {Array(8).fill(null).map((_, i) => (
              <path
                key={i}
                className={`tree-branch branch-${i}`}
                d={`M${200 + Math.cos(i * Math.PI / 4) * 50} ${300 - i * 30} 
                   Q${200 + Math.cos(i * Math.PI / 4) * 100} ${280 - i * 30} 
                   ${200 + Math.cos(i * Math.PI / 4) * 150} ${300 - i * 20}`}
                fill="none"
                stroke="#8b4513"
                strokeWidth={15 - i}
              />
            ))}
            
            {/* 树叶群 */}
            <g className="tree-leaves">
              {Array(12).fill(null).map((_, i) => (
                <circle
                  key={i}
                  className={`leaf-cluster-${i}`}
                  cx={200 + Math.cos(i * Math.PI / 6) * 80}
                  cy={150 + Math.sin(i * Math.PI / 6) * 80}
                  r={40 + Math.random() * 20}
                  fill={`hsl(${110 + Math.random() * 20}, ${60 + Math.random() * 20}%, ${30 + Math.random() * 20}%)`}
                />
              ))}
            </g>
          </svg>
          
          {/* 果实容器 */}
          <div className="fruits-container">
            {[
              { 
                id: 'photo-album', 
                icon: '📸', 
                label: '时光相册', 
                color: '#ff6b6b',
                content: (
                  <VideoPlayer
                    videos={videos}
                    currentVideoIndex={currentVideoIndex}
                    setCurrentVideoIndex={setCurrentVideoIndex}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    handleVideoEnd={handleVideoEnd}
                  />
                )
              },
              { id: 'timeline', icon: '⏳', label: '时光轴', color: '#4ecdc4' },
              { id: 'collections', icon: '⭐', label: '收藏夹', color: '#ffe66d' },
              { id: 'creations', icon: '✍️', label: '创作', color: '#6c5ce7' },
              { id: 'knowledge', icon: '📚', label: '知识库', color: '#a8e6cf' }
            ].map((feature, index) => (
              <div 
                key={feature.id}
                className={`feature-fruit ${feature.id}`}
                style={{
                  '--index': index,
                  '--total': 5,
                  '--fruit-color': feature.color
                }}
              >
                <div className="fruit-inner">
                  <div className="fruit-glow" />
                  <div className="fruit-content">
                    <div className="fruit-icon">{feature.icon}</div>
                    <span className="fruit-label">{feature.label}</span>
                    {feature.content} {/* 渲染放映室内容 */}
                  </div>
                  <div className="fruit-particles">
                    {Array(5).fill(null).map((_, i) => (
                      <div 
                        key={i} 
                        className="fruit-particle"
                        style={{ '--particle-delay': `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 草地 */}
        <div className="grass-field">
          <svg className="grass-svg" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="grassGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a8505" />
                <stop offset="100%" stopColor="#2d5a27" />
              </linearGradient>
            </defs>
            <path 
              className="grass-base"
              d="M0 200 L1000 200 L1000 100 Q500 0 0 100 Z"
              fill="url(#grassGradient)"
            />
            <g className="grass-details">
              {Array(40).fill(null).map((_, i) => (
                <path
                  key={i}
                  className="grass-blade"
                  style={{ '--index': i }}
                  d={`M${i * 25} 150 
                     Q${i * 25 + 10} ${100 + Math.random() * 30} 
                     ${i * 25 + 20} 150`}
                  stroke="#3a8d2f"
                  strokeWidth="2"
                  fill="none"
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PersonalSpace;