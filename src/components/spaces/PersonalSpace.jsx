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

// 在组件顶部添加内容组件
const ContentArea = ({ activeModule }) => {
  const [activeCollectionTab, setActiveCollectionTab] = useState('articles');

  const getCollectionItems = (type) => {
    const collections = {
      articles: [
        { 
          title: '深入理解JavaScript原型链',
          description: '详细讲解JS原型链的工作原理和继承机制',
          date: '2024-03-15',
          rating: 4.8,
          cover: '/images/articles/js-prototype.jpg'
        },
        {
          title: 'React性能优化最佳实践',
          description: '全面的React应用性能优化指南和实践技巧',
          date: '2024-03-12',
          rating: 4.9,
          cover: '/images/articles/react-performance.jpg'
        },
        {
          title: '现代CSS布局技巧',
          description: '使用Grid和Flexbox创建响应式布局',
          date: '2024-03-10',
          rating: 4.7,
          cover: '/images/articles/css-layout.jpg'
        },
        {
          title: 'TypeScript高级特性详解',
          description: '探索TypeScript的高级类型和实用技巧',
          date: '2024-03-08',
          rating: 4.8,
          cover: '/images/articles/typescript.jpg'
        }
      ],
      movies: [
        {
          title: '星际穿越',
          description: '关于爱、时间与人性的科幻杰作',
          date: '2024-02-20',
          rating: 4.9,
          cover: '/images/movies/interstellar.jpg'
        },
        {
          title: '盗梦空间',
          description: '扣人心弦的精彩梦境冒险',
          date: '2024-02-15',
          rating: 4.8,
          cover: '/images/movies/inception.jpg'
        },
        {
          title: '肖申克的救赎',
          description: '希望永远都在，自由不会死',
          date: '2024-02-10',
          rating: 4.9,
          cover: '/images/movies/shawshank.jpg'
        },
        {
          title: '千与千寻',
          description: '宫崎骏笔下的奇幻世界',
          date: '2024-02-05',
          rating: 4.9,
          cover: '/images/movies/spirited-away.jpg'
        }
      ],
      games: [
        {
          title: '塞尔达传说：王国之泪',
          description: '开放世界冒险游戏的巅峰之作',
          date: '2024-03-10',
          rating: 4.9,
          cover: '/images/games/zelda-totk.jpg'
        },
        {
          title: '艾尔登法环',
          description: '极具挑战性的黑暗奇幻RPG',
          date: '2024-03-05',
          rating: 4.8,
          cover: '/images/games/elden-ring.jpg'
        },
        {
          title: '死亡搁浅',
          description: '小岛秀夫的后启示录杰作',
          date: '2024-02-28',
          rating: 4.7,
          cover: '/images/games/death-stranding.jpg'
        },
        {
          title: '赛博朋克2077',
          description: '未来世界的沉浸式体验',
          date: '2024-02-20',
          rating: 4.6,
          cover: '/images/games/cyberpunk.jpg'
        }
      ],
      novels: [
        {
          title: '三体',
          description: '刘慈欣的科幻史诗巨著',
          date: '2024-01-15',
          rating: 4.9,
          cover: '/images/novels/three-body.jpg'
        },
        {
          title: '百年孤独',
          description: '魔幻现实主义的经典之作',
          date: '2024-01-10',
          rating: 4.8,
          cover: '/images/novels/hundred-years.jpg'
        },
        {
          title: '人类简史',
          description: '尤瓦尔·赫拉利的历史巨作',
          date: '2024-01-05',
          rating: 4.8,
          cover: '/images/novels/sapiens.jpg'
        },
        {
          title: '活着',
          description: '余华描绘的人生百态',
          date: '2024-01-01',
          rating: 4.9,
          cover: '/images/novels/to-live.jpg'
        }
      ],
      music: [
        {
          title: 'The Scientist',
          description: 'Coldplay创作的经典情歌',
          date: '2024-03-01',
          rating: 4.7,
          cover: '/images/music/the-scientist.jpg'
        },
        {
          title: 'Bohemian Rhapsody',
          description: 'Queen乐队的不朽神作',
          date: '2024-02-25',
          rating: 4.9,
          cover: '/images/music/bohemian-rhapsody.jpg'
        },
        {
          title: 'Yesterday',
          description: '披头士的永恒经典',
          date: '2024-02-20',
          rating: 4.8,
          cover: '/images/music/yesterday.jpg'
        },
        {
          title: 'Shape of You',
          description: 'Ed Sheeran的流行金曲',
          date: '2024-02-15',
          rating: 4.6,
          cover: '/images/music/shape-of-you.jpg'
        }
      ]
    };
    
    return collections[type] || [];
  };

  switch (activeModule) {
    case 'collections':
      return (
        <div className="content-collections">
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
                className={`collection-tab ${activeCollectionTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveCollectionTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </div>
            ))}
          </div>

          {/* 收藏内容展示 */}
          <div className="collections-wall">
            <div className="collections-grid">
              {getCollectionItems(activeCollectionTab).map((item, i) => (
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
        <div className="content-photos">
          {/* 相册轮播图 */}
          <div className="photo-carousel">
            {/* 这里可以使用现有的VideoPlayer组件或新建轮播图组件 */}
            <div className="timeline-photos">
              <h3>2024年</h3>
              <div className="photo-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="photo-item">
                    <img src={`photo${i}.jpg`} alt={`照片 ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    
    // 其他模块的内容...
    default:
      return <div>请选择一个模块查看内容</div>;
  }
};

const PersonalSpace = () => {
  const [weather, setWeather] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [particles, setParticles] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeModule, setActiveModule] = useState('collections');

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

  // 添加时间检测
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

  // 修改泡泡内容数据
  const bubbleFeatures = [
    {
      id: 'collections',
      icon: '🗃️',
      title: '收藏',
      description: '珍藏美好事物',
      color: 'linear-gradient(45deg, #FF9A9E, #FAD0C4)'
    },
    {
      id: 'photo-album',
      icon: '📸',
      title: '相册',
      description: '定格精彩瞬间',
      color: 'linear-gradient(45deg, #A6C1EE, #FBC2EB)'
    },
    {
      id: 'journal',
      icon: '📖',
      title: '日志',
      description: '记录生活点滴',
      color: 'linear-gradient(45deg, #84FAB0, #8FD3F4)'
    },
    {
      id: 'creation',
      icon: '✨',
      title: '创作',
      description: '展现独特想法',
      color: 'linear-gradient(45deg, #FFD1FF, #FAD0C4)'
    },
    {
      id: 'timeline',
      icon: '⏳',
      title: '时光轴',
      description: '时光的足迹',
      color: 'linear-gradient(45deg, #FFF1EB, #ACE0F9)'
    },
    {
      id: 'memory-wall',
      icon: '🎭',
      title: '回忆墙',
      description: '美好的回忆',
      color: 'linear-gradient(45deg, #FFAFBD, #FFC3A0)'
    },
    {
      id: 'badges',
      icon: '🏅',
      title: '人生徽章',
      description: '成长的印记',
      color: 'linear-gradient(45deg, #C2E9FB, #A1C4FD)'
    },
    {
      id: 'dreams',
      icon: '🌟',
      title: '梦想',
      description: '追逐的星光',
      color: 'linear-gradient(45deg, #FFDEE9, #B5FFFC)'
    },
    {
      id: 'ideals',
      icon: '🎯',
      title: '理想',
      description: '前进的方向',
      color: 'linear-gradient(45deg, #FFE1E1, #FFF48F)'
    }
  ];

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
        <div className="side-modules">
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
          <ContentArea activeModule={activeModule} />
        </div>
      </div>
    </div>
  );
};

export default PersonalSpace;