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

// 添加 Emby 配置
const EMBY_SERVER = 'http://192.168.3.100:8096';
const EMBY_API_KEY = 'f879cbe6-8025-4526-8f1d-0cba84dfe8e7';
const EMBY_TOKEN = ''; // 需要添加有效的访问令牌

// 在组件顶部添加内容组件
const ContentArea = ({ activeModule }) => {
  const [activeCollectionTab, setActiveCollectionTab] = useState('articles');
  const [albumDisplayMode, setAlbumDisplayMode] = useState('carousel');

  const getCollectionItems = (type) => {
    const collections = {
      articles: [
        { 
          title: '深入理解JavaScript原型链',
          description: '详细讲解JS原型链的工作原理和继承机制',
          date: '2024-03-15',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=1'
        },
        {
          title: 'React性能优化最佳实践',
          description: '全面的React应用性能优化指南和实践技巧',
          date: '2024-03-12',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=2'
        },
        {
          title: '现代CSS布局技巧',
          description: '使用Grid和Flexbox创建响应式布局',
          date: '2024-03-10',
          rating: 4.7,
          cover: 'https://picsum.photos/200/300?random=3'
        },
        {
          title: 'TypeScript高级特性详解',
          description: '探索TypeScript的高级类型和实用技巧',
          date: '2024-03-08',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=4'
        },
        {
          title: 'Vue3组件设计模式',
          description: '最新的Vue3组件开发技巧和设计思路',
          date: '2024-03-06',
          rating: 4.7,
          cover: 'https://picsum.photos/200/300?random=5'
        },
        {
          title: 'Node.js微服务架构',
          description: '使用Node.js构建可扩展的微服务系统',
          date: '2024-03-04',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=6'
        }
      ],
      movies: [
        {
          title: '星际穿越',
          description: '关于爱、时间与人性的科幻杰作',
          date: '2024-02-20',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=7'
        },
        {
          title: '盗梦空间',
          description: '扣人心弦的精彩梦境冒险',
          date: '2024-02-15',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=8'
        },
        {
          title: '肖申克的救赎',
          description: '希望永远都在，自由不会死',
          date: '2024-02-10',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=9'
        },
        {
          title: '千与千寻',
          description: '宫崎骏笔下的奇幻世界',
          date: '2024-02-05',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=10'
        },
        {
          title: '泰坦尼克号',
          description: '永恒的爱情传奇',
          date: '2024-02-01',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=11'
        },
        {
          title: '阿甘正传',
          description: '生命如巧克力盒子般充满惊喜',
          date: '2024-01-28',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=12'
        },
        {
          title: '楚门的世界',
          description: '关于真实与虚幻的思考',
          date: '2024-01-25',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=13'
        },
        {
          title: '大话西游',
          description: '经典的中国式浪漫',
          date: '2024-01-22',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=14'
        }
      ],
      games: [
        {
          title: '塞尔达传说：王国之泪',
          description: '开放世界冒险游戏的巅峰之作',
          date: '2024-03-10',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=15'
        },
        {
          title: '艾尔登法环',
          description: '极具挑战性的黑暗奇幻RPG',
          date: '2024-03-05',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=16'
        },
        {
          title: '死亡搁浅',
          description: '小岛秀夫的后启示录杰作',
          date: '2024-02-28',
          rating: 4.7,
          cover: 'https://picsum.photos/200/300?random=17'
        },
        {
          title: '赛博朋克2077',
          description: '未来世界的沉浸式体验',
          date: '2024-02-20',
          rating: 4.6,
          cover: 'https://picsum.photos/200/300?random=18'
        }
      ],
      novels: [
        {
          title: '三体',
          description: '刘慈欣的科幻史诗巨著',
          date: '2024-01-15',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=19'
        },
        {
          title: '百年孤独',
          description: '魔幻现实主义的经典之作',
          date: '2024-01-10',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=20'
        },
        {
          title: '人类简史',
          description: '尤瓦尔·赫拉利的历史巨作',
          date: '2024-01-05',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=21'
        },
        {
          title: '活着',
          description: '余华描绘的人生百态',
          date: '2024-01-01',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=22'
        },
        {
          title: '围城',
          description: '钱钟书的文学经典',
          date: '2023-12-28',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=23'
        }
      ],
      music: [
        {
          title: 'The Scientist',
          description: 'Coldplay创作的经典情歌',
          date: '2024-03-01',
          rating: 4.7,
          cover: 'https://picsum.photos/200/300?random=24'
        },
        {
          title: 'Bohemian Rhapsody',
          description: 'Queen乐队的不朽神作',
          date: '2024-02-25',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=25'
        },
        {
          title: 'Yesterday',
          description: '披头士的永恒经典',
          date: '2024-02-20',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=26'
        },
        {
          title: 'Shape of You',
          description: 'Ed Sheeran的流行金曲',
          date: '2024-02-15',
          rating: 4.6,
          cover: 'https://picsum.photos/200/300?random=27'
        },
        {
          title: 'Rolling in the Deep',
          description: 'Adele的标志性作品',
          date: '2024-02-10',
          rating: 4.8,
          cover: 'https://picsum.photos/200/300?random=28'
        },
        {
          title: 'Billie Jean',
          description: 'Michael Jackson的经典舞曲',
          date: '2024-02-05',
          rating: 4.9,
          cover: 'https://picsum.photos/200/300?random=29'
        }
      ],
      'photo-album': [
        {
          id: 1,
          title: '樱花季节',
          description: '春日赏樱',
          date: '2024-03-20',
          cover: 'https://images.unsplash.com/photo-1522383225653-ed111181a951',
          category: 'nature'
        },
        {
          id: 2,
          title: '海边日落',
          description: '夕阳西下',
          date: '2024-03-15',
          cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
          category: 'landscape'
        },
        {
          id: 3,
          title: '城市夜景',
          description: '璀璨都市',
          date: '2024-03-10',
          cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
          category: 'city'
        },
        {
          id: 4,
          title: '雪山之巅',
          description: '冰雪世界',
          date: '2024-03-05',
          cover: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
          category: 'nature'
        },
        {
          id: 5,
          title: '咖啡时光',
          description: '午后时光',
          date: '2024-03-01',
          cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
          category: 'life'
        },
        {
          id: 6,
          title: '古镇漫步',
          description: '江南水乡',
          date: '2024-02-25',
          cover: 'https://images.unsplash.com/photo-1528164344705-47542687000d',
          category: 'culture'
        },
        {
          id: 7,
          title: '森林探险',
          description: '绿意盎然',
          date: '2024-02-20',
          cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
          category: 'nature'
        },
        {
          id: 8,
          title: '极光之夜',
          description: '北极光',
          date: '2024-02-15',
          cover: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73',
          category: 'landscape'
        },
        {
          id: 9,
          title: '花田漫步',
          description: '薰衣草田',
          date: '2024-02-10',
          cover: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732',
          category: 'nature'
        },
        {
          id: 10,
          title: '雨后彩虹',
          description: '七彩天空',
          date: '2024-02-05',
          cover: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31',
          category: 'landscape'
        },
        {
          id: 11,
          title: '街头艺术',
          description: '城市涂鸦',
          date: '2024-02-01',
          cover: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8',
          category: 'city'
        },
        {
          id: 12,
          title: '美食记录',
          description: '寿司拼盘',
          date: '2024-01-28',
          cover: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
          category: 'food'
        }
      ]
    };
    
    return collections[type] || [];
  };

  // 相册展示组件
  const PhotoAlbum = () => {
    const [displayMode, setDisplayMode] = useState('carousel');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    // 获取 Emby 照片
    const fetchEmbyPhotos = async () => {
      try {
        // 获取照片库内容
        const response = await fetch(
          `${EMBY_SERVER}/emby/Items?Recursive=true&IncludeItemTypes=Photo&Fields=PrimaryImageAspectRatio,Overview,DateCreated&api_key=${EMBY_API_KEY}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `MediaBrowser Token="${EMBY_API_KEY}"`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('获取照片失败');
        }

        const data = await response.json();
        console.log('Emby photos:', data); // 查看返回的数据

        if (data.Items && data.Items.length > 0) {
          const processedPhotos = data.Items.map(photo => ({
            id: photo.Id,
            title: photo.Name,
            description: photo.Overview || '',
            date: new Date(photo.DateCreated).toLocaleDateString(),
            cover: `${EMBY_SERVER}/emby/Items/${photo.Id}/Images/Primary?api_key=${EMBY_API_KEY}`,
            thumbnail: `${EMBY_SERVER}/emby/Items/${photo.Id}/Images/Primary?maxWidth=400&api_key=${EMBY_API_KEY}`,
            aspectRatio: photo.PrimaryImageAspectRatio || 1.5
          }));

          setPhotos(processedPhotos);
        } else {
          throw new Error('未找到照片');
        }
      } catch (error) {
        console.error('获取 Emby 照片失败:', error);
        // 如果获取失败，使用本地 mock 数据作为备选
        const mockPhotos = getCollectionItems('photo-album');
        setPhotos(mockPhotos);
      } finally {
        setLoading(false);
      }
    };

    // 加载照片
    useEffect(() => {
      fetchEmbyPhotos();
    }, []);

    // 轮播图自动播放
    useEffect(() => {
      if (displayMode === 'carousel' && photos.length > 0) {
        const timer = setInterval(() => {
          setCurrentSlide((prev) => 
            prev === photos.length - 1 ? 0 : prev + 1
          );
        }, 5000);
        return () => clearInterval(timer);
      }
    }, [displayMode, photos.length]);

    // 渲染加载状态
    if (loading) {
      return (
        <div className="photo-album-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>正在加载照片...</span>
          </div>
        </div>
      );
    }

    const displayModes = [
      { id: 'carousel', icon: 'fas fa-images', label: '轮播展示' },
      { id: 'cube', icon: 'fas fa-cube', label: '魔方旋转' },
      { id: 'waterfall', icon: 'fas fa-water', label: '瀑布流' },
      { id: 'grid', icon: 'fas fa-th', label: '网格展示' }
    ];

    const renderPhotoContent = () => {
      switch (displayMode) {
        case 'carousel':
          return (
            <div className="carousel-container">
              <div 
                className="carousel-wrapper"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {photos.map((photo, index) => (
                  <div key={index} className="carousel-slide">
                    <img src={photo.cover} alt={photo.title} loading="lazy" />
                    <div className="slide-info">
                      <h3>{photo.title}</h3>
                      <p>{photo.description}</p>
                      <span>{photo.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="carousel-controls">
                <button onClick={() => setCurrentSlide(prev => prev === 0 ? photos.length - 1 : prev - 1)}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button onClick={() => setCurrentSlide(prev => prev === photos.length - 1 ? 0 : prev + 1)}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          );

        case 'cube':
          return (
            <div className="cube-container">
              <div className="cube-wrapper">
                {photos.slice(0, 6).map((photo, index) => (
                  <div key={index} className={`cube-face face-${index + 1}`}>
                    <img src={photo.cover} alt={photo.title} />
                  </div>
                ))}
              </div>
            </div>
          );

        case 'waterfall':
          return (
            <div className="waterfall-container">
              {photos.map(photo => (
                <div key={photo.id} className="waterfall-item">
                  <img src={photo.cover} alt={photo.title} />
                  <div className="photo-info">
                    <h4>{photo.title}</h4>
                    <p>{photo.description}</p>
                    <span>{photo.date}</span>
                  </div>
                </div>
              ))}
            </div>
          );

        case 'grid':
          return (
            <div className="grid-container">
              {photos.map(photo => (
                <div key={photo.id} className="grid-item">
                  <img src={photo.cover} alt={photo.title} />
                  <div className="photo-info">
                    <h4>{photo.title}</h4>
                    <p>{photo.description}</p>
                    <span>{photo.date}</span>
                  </div>
                </div>
              ))}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="photo-album-container">
        <div className="display-mode-selector">
          {displayModes.map(mode => (
            <button
              key={mode.id}
              className={`mode-btn ${displayMode === mode.id ? 'active' : ''}`}
              onClick={() => setDisplayMode(mode.id)}
            >
              <i className={mode.icon}></i>
              {mode.label}
            </button>
          ))}
        </div>
        {photos.length > 0 ? renderPhotoContent() : (
          <div className="no-photos">
            <i className="fas fa-images"></i>
            <p>暂无照片</p>
          </div>
        )}
      </div>
    );
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
            <div className="collections-grid" data-type={activeCollectionTab}>
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
      return <PhotoAlbum />;
    
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  // Mock数据
  const albumPhotos = [
    {
      id: 1,
      url: 'https://picsum.photos/800/600?random=1',
      title: '春日野餐',
      date: '2024-03-15'
    },
    {
      id: 2,
      url: 'https://picsum.photos/800/600?random=2',
      title: '海边日落',
      date: '2024-03-10'
    },
    {
      id: 3,
      url: 'https://picsum.photos/800/600?random=3',
      title: '城市夜景',
      date: '2024-03-05'
    },
    {
      id: 4,
      url: 'https://picsum.photos/800/600?random=4',
      title: '山间徒步',
      date: '2024-02-28'
    },
    {
      id: 5,
      url: 'https://picsum.photos/800/600?random=5',
      title: '咖啡时光',
      date: '2024-02-25'
    },
    {
      id: 6,
      url: 'https://picsum.photos/800/600?random=6',
      title: '雨天街景',
      date: '2024-02-20'
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
          <ContentArea activeModule={activeModule} />
        </div>
      </div>
    </div>
  );
};

export default PersonalSpace;