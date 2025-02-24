import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PersonalSpace.css';
import { embyService } from '../../services/embyService';
import PhotoAlbum from '../albums/PhotoAlbum';

// 将放映室提取为独立组件
const VideoPlayerComponent = ({ videos, currentVideoIndex, setCurrentVideoIndex, isPlaying, setIsPlaying, handleVideoEnd }) => {
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
            <div className="volume-slider-container">
              <div className="volume-value">{Math.round(volume * 100)}%</div>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                orient="vertical"
              />
            </div>
            <button className="control-btn volume-btn" onClick={toggleMute}>
              {isMuted ? '🔇' : volume <= 0.3 ? '🔈' : volume <= 0.7 ? '🔉' : '🔊'}
            </button>
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
  const [activeModule, setActiveModule] = useState('collections');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [weather] = useState('clear');
  const [timeOfDay, setTimeOfDay] = useState('day');
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 添加照片相关状态
  const [photoData, setPhotoData] = useState({ photos: [], totalCount: 0 });
  const [photoLoading, setPhotoLoading] = useState(true);
  const [photoError, setPhotoError] = useState(null);
  const hasLoadedPhotos = useRef(false);

  // 保留时间检测
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8) {
        setTimeOfDay('dawn');
      } else if (hour >= 8 && hour < 18) {
        setTimeOfDay('day');
      } else if (hour >= 18 && hour < 20) {
        setTimeOfDay('dusk');
      } else {
        setTimeOfDay('night');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // 照片加载函数
  const loadPhotos = async () => {
    if (hasLoadedPhotos.current) {
      return;
    }

    try {
      setPhotoLoading(true);
      const result = await embyService.getPhotos();
      setPhotoData({
        photos: result.photos,
        totalCount: result.totalCount
      });
      hasLoadedPhotos.current = true;
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setPhotoError('获取照片失败，请稍后重试');
    } finally {
      setPhotoLoading(false);
    }
  };

  // 在组件挂载时加载照片
  useEffect(() => {
    loadPhotos();
  }, []);

  // 添加收藏数据
  const collections = {
    articles: [/* ... 你的文章数据 ... */],
    movies: [/* ... 你的电影数据 ... */],
    games: [/* ... 你的游戏数据 ... */],
    novels: [/* ... 你的小说数据 ... */],
    music: [/* ... 你的音乐数据 ... */]
  };

  // 获取收藏项目函数
  const getCollectionItems = (type) => {
    return collections[type] || [];
  };

  // 渲染不同的模块
  const renderModule = () => {
    switch (activeModule) {
      case 'collections':
        return (
          <div className="collections-container">
            {/* 收藏分类标签 */}
            <div className="collections-tabs">
              {[
                { id: 'articles', icon: '📚', label: '文章' },
                { id: 'movies', icon: '🎬', label: '影视' },
                { id: 'games', icon: '🎮', label: '游戏' },
                { id: 'novels', icon: '📖', label: '小说' },
                { id: 'music', icon: '🎵', label: '音乐' }
              ].map(tab => (
                <div 
                  key={tab.id}
                  className={`collection-tab ${selectedCollection === tab.id ? 'active' : ''}`}
                  onClick={() => setSelectedCollection(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </div>
              ))}
            </div>

            {/* 收藏内容展示 */}
            <div className="collections-wall">
              <div className="collections-grid" data-type={selectedCollection}>
                {getCollectionItems(selectedCollection).map((item, i) => (
                  <div key={i} className="collection-item">
                    <div className="collection-cover">
                      <img src={item.cover} alt={item.title} />
                    </div>
                    <div className="collection-info">
                      <h3 className="collection-title">{item.title}</h3>
                      <p className="collection-desc">{item.description}</p>
                      <div className="collection-meta">
                        <span className="collection-date">{item.date}</span>
                        <span className="collection-rating">⭐ {item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'photo-album':
        return (
          <PhotoAlbum 
            photos={photoData.photos || []}
            totalCount={photoData.totalCount || 0}
            loading={photoLoading}
            error={photoError}
            onRetry={loadPhotos}
          />
        );
        
      case 'projector':
        return (
          <div className="projector-container">
            <VideoPlayerComponent 
              videos={videos}
              currentVideoIndex={currentVideoIndex}
              setCurrentVideoIndex={setCurrentVideoIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              handleVideoEnd={handleVideoEnd}
            />
          </div>
        );
        
      default:
        return (
          <div className="module-not-found">
            <h2>模块未找到</h2>
          </div>
        );
    }
  };

  return (
    <div className={`personal-space ${timeOfDay} ${weather}`}>
      {/* 背景层 */}
      <div className="background-layer">
        {timeOfDay === 'night' && (
          <>
            {/* 星空层 */}
            <div className="night-sky">
              {/* 月亮 */}
              <div className="moon">
                <div className="moon-glow"></div>
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="moon-crater"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 20}%`,
                      width: `${8 + i * 2}px`,
                      height: `${8 + i * 2}px`
                    }}
                  />
                ))}
              </div>

              {/* 增加更多星星 */}
              {[
                // 大星星
                ...[...Array(15)].map(() => ({ 
                  size: 3, 
                  x: Math.random() * 100, 
                  y: Math.random() * 40 
                })),
                // 中星星
                ...[...Array(30)].map(() => ({ 
                  size: 2, 
                  x: Math.random() * 100, 
                  y: Math.random() * 40 
                })),
                // 小星星
                ...[...Array(60)].map(() => ({ 
                  size: 1, 
                  x: Math.random() * 100, 
                  y: Math.random() * 40 
                }))
              ].map((star, i) => (
                <div 
                  key={i} 
                  className="star"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.size === 3 ? 1 : star.size === 2 ? 0.8 : 0.6
                  }}
                />
              ))}
            </div>
            
            {/* 城市层 */}
            <div className="city-layer">
              {/* 使用固定的建筑物配置，而不是随机生成 */}
              {[
                { width: 30, height: 180, left: 5, windows: 12 },
                { width: 25, height: 150, left: 10, windows: 10 },
                { width: 35, height: 200, left: 15, windows: 15 },
                { width: 28, height: 160, left: 20, windows: 11 },
                { width: 32, height: 190, left: 25, windows: 14 },
                { width: 26, height: 140, left: 30, windows: 9 },
                { width: 38, height: 220, left: 35, windows: 16 },
                { width: 29, height: 170, left: 40, windows: 12 },
                { width: 33, height: 185, left: 45, windows: 13 },
                { width: 27, height: 155, left: 50, windows: 10 },
                { width: 31, height: 175, left: 55, windows: 12 },
                { width: 36, height: 205, left: 60, windows: 15 },
                { width: 28, height: 165, left: 65, windows: 11 },
                { width: 34, height: 195, left: 70, windows: 14 },
                { width: 30, height: 180, left: 75, windows: 12 },
                { width: 25, height: 145, left: 80, windows: 9 },
                { width: 37, height: 210, left: 85, windows: 16 },
                { width: 32, height: 185, left: 90, windows: 13 }
              ].map((building, i) => (
                <div 
                  key={i} 
                  className="building"
                  style={{
                    width: `${building.width}px`,
                    height: `${building.height}px`,
                    left: `${building.left}%`
                  }}
                >
                  {[...Array(building.windows)].map((_, j) => (
                    <div 
                      key={j} 
                      className="window"
                      style={{
                        opacity: j % 2 === 0 ? 0.9 : 0.6
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* 雨天效果 */}
        {weather === 'rainy' && (
          <div className="rain-layer">
            {[...Array(200)].map((_, i) => (
              <div 
                key={i} 
                className="raindrop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${0.2 + Math.random() * 0.3}s`,
                  animationDelay: `${Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 内容层 */}
      <div className="content-layer">
        {/* 左侧模块导航 */}
        <div className={`side-modules ${isCollapsed ? 'collapsed' : ''}`}>
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '→' : '←'}
          </button>
          <div className="module-list">
            {[
              {
                id: 'collections',
                icon: '🗃️',
                title: '收藏',
                desc: '珍藏美好事物'
              },
              {
                id: 'photo-album',
                icon: '📸',
                title: '相册',
                desc: '定格精彩瞬间'
              },
              {
                id: 'journal',
                icon: '📖',
                title: '日志',
                desc: '记录生活点滴'
              },
              {
                id: 'creation',
                icon: '✨',
                title: '创作',
                desc: '展现独特想法'
              },
              {
                id: 'timeline',
                icon: '⏳',
                title: '时光轴',
                desc: '时光的足迹'
              },
              {
                id: 'memory',
                icon: '🎭',
                title: '回忆墙',
                desc: '美好的回忆'
              },
              {
                id: 'badges',
                icon: '🏅',
                title: '成就',
                desc: '成长的印记'
              }
            ].map((module, index) => (
              <div
                key={module.id}
                className={`module-card ${activeModule === module.id ? 'active' : ''}`}
                style={{ '--index': index }}
                onClick={() => setActiveModule(module.id)}
              >
                <div className="module-icon">{module.icon}</div>
                <div className="module-text">
                  <div className="module-title">{module.title}</div>
                  <div className="module-desc">{module.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧内容展示区 */}
        <div className="main-content">
          {renderModule()}
        </div>
      </div>
    </div>
  );
};

export default PersonalSpace;