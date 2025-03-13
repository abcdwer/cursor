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

  // 日志数据
  const [journals] = useState([
    {
      id: 1,
      title: '春日随笔',
      excerpt: '今天的阳光特别温暖，樱花开得正盛...',
          date: '2024-03-15',
      mood: '😊 愉快',
      weather: '☀️ 晴朗',
      location: '杭州'
    },
    {
      id: 2,
      title: '雨天思绪',
      excerpt: '窗外的雨滴打在树叶上，发出清脆的声响...',
          date: '2024-03-10',
      mood: '😌 平静',
      weather: '🌧️ 小雨',
      location: '杭州'
    }
  ]);

  // 创作数据
  const [creations] = useState([
    {
      id: 1,
      type: 'text',
      title: '夜的诗',
      content: '月光如水，洒落在静谧的街道...',
      description: '一首关于夜晚的诗',
      date: '2024-03-15'
    },
    {
      id: 2,
      type: 'image',
      title: '春日写生',
      url: 'https://picsum.photos/400/300',
      description: '公园的樱花写生',
      date: '2024-03-12'
    }
  ]);

  // 时光轴数据
  const [timelineEvents] = useState([
    {
      id: 1,
      year: '2024',
      month: '3月',
      icon: '🎓',
      title: '完成学业',
      description: '顺利完成研究生学业，开始新的人生阶段',
      images: ['https://picsum.photos/200/150', 'https://picsum.photos/200/150']
    },
    {
      id: 2,
      year: '2024',
      month: '2月',
      icon: '💼',
      title: '实习经历',
      description: '在科技公司完成了为期3个月的实习',
      images: ['https://picsum.photos/200/150']
    }
  ]);

  // 回忆数据
  const [memories] = useState([
    {
      id: 1,
      title: '毕业旅行',
      content: '和最好的朋友们一起去了云南，看了最美的日出...',
      date: '2024-03-01',
      color: '#FFE4E1',
      image: 'https://picsum.photos/300/200',
      tags: ['旅行', '友情', '毕业季']
    },
    {
      id: 2,
      title: '第一次演出',
      content: '在校园音乐节上进行了人生第一次演出，虽然紧张但很开心...',
      date: '2024-02-15',
      color: '#E0FFFF',
      image: 'https://picsum.photos/300/200',
      tags: ['音乐', '演出', '校园']
    }
  ]);

  // 成就数据
  const [badges] = useState([
    {
      id: 1,
      icon: '🎨',
      title: '创作达人',
      description: '发布100篇原创作品',
      achieved: true,
      achievedDate: '2024-03-15'
    },
    {
      id: 2,
      icon: '📝',
      title: '勤奋写手',
      description: '连续30天写日记',
      achieved: false,
      currentProgress: 15,
      requiredProgress: 30
    },
    {
      id: 3,
      icon: '🌟',
      title: '人气之星',
      description: '作品获得1000个赞',
      achieved: false,
      currentProgress: 750,
      requiredProgress: 1000
    }
  ]);

  // 收藏数据示例
  const [collections] = useState([
    {
      id: 1,
      type: 'movie',
      title: '星际穿越',
      description: '一部关于爱、时间和人性的科幻电影杰作...',
      cover: 'https://picsum.photos/400/225?random=1',
      date: '2024-03-15',
      rating: 9.5,
      tags: ['科幻', '冒险', '亲情']
    },
    {
      id: 2,
      type: 'book',
      title: '三体',
      description: '刘慈欣的科幻巨著，讲述人类文明与三体文明的恢宏故事...',
      cover: 'https://picsum.photos/400/225?random=2',
      date: '2024-03-10',
      rating: 9.3,
      tags: ['科幻', '哲学', '宇宙']
    },
    {
      id: 3,
      type: 'music',
      title: 'The Scientist',
      description: 'Coldplay创作的一首感人至深的摇滚歌曲...',
      cover: 'https://picsum.photos/400/225?random=3',
      date: '2024-03-05',
      rating: 9.0,
      tags: ['摇滚', '伤感', '经典']
    },
    {
      id: 4,
      type: 'game',
      title: '塞尔达传说',
      description: '开放世界游戏的巅峰之作，充满探索与冒险...',
      cover: 'https://picsum.photos/400/225?random=4',
      date: '2024-03-01',
      rating: 9.8,
      tags: ['冒险', '开放世界', '任天堂']
    }
  ]);

  // 添加回忆墙相关的状态
  const [memoryViewMode, setMemoryViewMode] = useState('grid');
  const [activeMemoryFilter, setActiveMemoryFilter] = useState('all');

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
      const result = await embyService.getPhotos('all');
      if (result && result.photos) {
        setPhotoData({
          photos: result.photos,
          totalCount: result.totalCount
        });
        hasLoadedPhotos.current = true;
      } else {
        setPhotoError('获取照片失败，请稍后重试');
      }
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

  // 处理收藏项点击
  const handleCollectionClick = (item) => {
    // 处理点击事件，比如显示详情等
    console.log('Clicked collection:', item);
  };

  // 日志部分的渲染
  const renderJournals = () => (
    <div className="journals-container">
      <div className="journals-header">
        <div className="journals-overview">
          <h2>我的日志</h2>
          <div className="journals-stats">
            <div className="stat-card">
              <div className="stat-icon total">📚</div>
              <div className="stat-info">
                <span className="stat-value">{journals.length}</span>
                <span className="stat-label">总日志</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon monthly">📅</div>
              <div className="stat-info">
                <span className="stat-value">
                  {journals.filter(j => new Date(j.date).getMonth() === new Date().getMonth()).length}
                </span>
                <span className="stat-label">本月日志</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon streak">🔥</div>
              <div className="stat-info">
                <span className="stat-value">12</span>
                <span className="stat-label">连续写作</span>
              </div>
            </div>
          </div>
        </div>
        <div className="journal-actions">
          <button className="new-journal-btn">
            <div className="btn-content">
              <i className="fas fa-pen-fancy"></i>
              <span>写日志</span>
            </div>
            <div className="btn-meta">
              <span className="today-date">{new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
              <span className="btn-hint">今天的故事</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="journals-grid">
        {journals.map(journal => (
          <div key={journal.id} className="journal-card">
            <div className="journal-date-badge">
              <span className="date-day">{new Date(journal.date).getDate()}</span>
              <span className="date-month">{new Date(journal.date).toLocaleString('zh-CN', { month: 'short' })}</span>
            </div>
            
            <div className="journal-main">
              <div className="journal-meta">
                <span className="journal-mood">{journal.mood}</span>
                <span className="journal-weather">{journal.weather}</span>
                <span className="journal-location">{journal.location}</span>
              </div>
              
              <h3 className="journal-title">{journal.title}</h3>
              <p className="journal-excerpt">{journal.excerpt}</p>
              
              <div className="journal-footer">
                <div className="journal-interactions">
                  <span className="interaction-item">
                    <i className="far fa-eye"></i>
                    <span>123</span>
                  </span>
                  <span className="interaction-item">
                    <i className="far fa-comment"></i>
                    <span>45</span>
                  </span>
                  <span className="interaction-item">
                    <i className="far fa-heart"></i>
                    <span>67</span>
                  </span>
                </div>
                <button className="read-more-btn">阅读全文</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 创作部分的渲染
  const renderCreations = () => (
    <div className="creations-container">
      <div className="creations-header">
        <div className="header-left">
          <h2>我的创作</h2>
          <div className="creation-stats">
            <div className="stat-item">
              <span className="stat-value">128</span>
              <span className="stat-label">总创作</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">12</span>
              <span className="stat-label">本月新增</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">32</span>
              <span className="stat-label">获赞</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <button className="new-creation-btn">
            <span className="btn-icon">✨</span>
            <span className="btn-text">新建创作</span>
          </button>
        </div>
      </div>

      <div className="creation-filters">
        <div className="filter-tabs">
          <button className="filter-tab active">全部作品</button>
          <button className="filter-tab">文字</button>
          <button className="filter-tab">图片</button>
          <button className="filter-tab">音频</button>
          <button className="filter-tab">视频</button>
        </div>
        <div className="view-options">
          <button className="view-btn active">
            <i className="fas fa-th-large"></i>
          </button>
          <button className="view-btn">
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      <div className="creations-grid">
        {creations.map(creation => (
          <div key={creation.id} className={`creation-card ${creation.type}`}>
            <div className="creation-preview">
              {creation.type === 'text' ? (
                <div className="text-preview">
                  <div className="text-content">
                    <h3>{creation.title}</h3>
                    <p>{creation.content}</p>
                  </div>
                  <div className="text-meta">
                    <span className="word-count">{creation.wordCount} 字</span>
                    <span className="read-time">{creation.readTime} 分钟阅读</span>
                  </div>
                </div>
              ) : creation.type === 'image' ? (
                <div className="image-preview">
                  <img src={creation.url} alt={creation.title} />
                  <div className="image-overlay">
                    <div className="image-info">
                      <span className="image-size">{creation.size}</span>
                      <span className="image-resolution">{creation.resolution}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="media-preview">
                  <div className="media-thumbnail">
                    <img src={creation.thumbnail} alt={creation.title} />
                    <div className="media-overlay">
                      <span className="media-duration">{creation.duration}</span>
                      <button className="play-btn">
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="creation-info">
              <div className="info-header">
                <h3>{creation.title}</h3>
                <div className="creation-date">
                  <i className="far fa-calendar"></i>
                  {new Date(creation.date).toLocaleDateString('zh-CN')}
                </div>
              </div>
              
              <div className="creation-tags">
                {creation.tags?.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
              
              <div className="creation-footer">
                <div className="interaction-stats">
                  <span className="stat">
                    <i className="far fa-eye"></i>
                    {creation.views || 0}
                  </span>
                  <span className="stat">
                    <i className="far fa-heart"></i>
                    {creation.likes || 0}
                  </span>
                  <span className="stat">
                    <i className="far fa-comment"></i>
                    {creation.comments || 0}
                  </span>
                </div>
                
                <div className="action-buttons">
                  <button className="action-btn edit" title="编辑">
                    <i className="far fa-edit"></i>
                  </button>
                  <button className="action-btn share" title="分享">
                    <i className="far fa-share-square"></i>
                  </button>
                  <button className="action-btn more" title="更多">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 时光轴部分的渲染
  const renderTimeline = () => (
    <div className="timeline-container">
      <div className="timeline-header">
        <div className="header-left">
          <h2>时光轴</h2>
          <div className="timeline-stats">
            <div className="stat-item">
              <span className="stat-value">126</span>
              <span className="stat-label">总记录</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">12</span>
              <span className="stat-label">本月新增</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <button className="new-moment-btn">
            <span className="btn-icon">✨</span>
            <span className="btn-text">记录时刻</span>
          </button>
        </div>
      </div>

      <div className="timeline-navigation">
        <div className="year-selector">
          <button className="year-btn active">2024</button>
          <button className="year-btn">2023</button>
          <button className="year-btn">2022</button>
        </div>
        <div className="month-slider">
          {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map((month, index) => (
            <button 
              key={index} 
              className={`month-btn ${index === 2 ? 'active' : ''}`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className="timeline-content">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="timeline-event">
            <div className="event-date">
              <div className="date-card">
                <span className="date-month">{event.month}</span>
                <span className="date-year">{event.year}</span>
              </div>
            </div>
            
            <div className="event-connector">
              <div className="connector-line"></div>
              <div className="connector-dot">
                <span className="event-icon">{event.icon}</span>
              </div>
            </div>
            
            <div className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">
                  <span className="event-category">
                    <i className="fas fa-tag"></i>
                    {event.category || '生活'}
                  </span>
                  <span className="event-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {event.location || '杭州'}
                  </span>
                </div>
              </div>
              
              <p className="event-description">{event.description}</p>
              
              {event.images?.length > 0 && (
                <div className="event-gallery">
                  {event.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="gallery-item">
                      <img src={image} alt={`${event.title} - ${imgIndex + 1}`} />
                      <div className="image-overlay">
                        <button className="preview-btn">
                          <i className="fas fa-expand"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  {event.images.length > 3 && (
                    <div className="gallery-more">
                      <span>+{event.images.length - 3}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="event-footer">
                <div className="event-tags">
                  {event.tags?.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">#{tag}</span>
                  ))}
                </div>
                
                <div className="event-actions">
                  <button className="action-btn edit" title="编辑">
                    <i className="far fa-edit"></i>
                  </button>
                  <button className="action-btn share" title="分享">
                    <i className="far fa-share-square"></i>
                  </button>
                  <button className="action-btn more" title="更多">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 收藏模块布局
  const renderCollections = () => (
    <div className="collections-container">
      <div className="collections-header">
        <div className="collection-types">
          <button 
            className={`collection-type ${selectedCollection === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('all')}
          >
            <span>📚</span>
            全部
          </button>
          <button 
            className={`collection-type ${selectedCollection === 'movie' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('movie')}
          >
            <span>🎬</span>
            电影
          </button>
          <button 
            className={`collection-type ${selectedCollection === 'book' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('book')}
          >
            <span>📖</span>
            书籍
          </button>
          <button 
            className={`collection-type ${selectedCollection === 'music' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('music')}
          >
            <span>🎵</span>
            音乐
          </button>
          <button 
            className={`collection-type ${selectedCollection === 'game' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('game')}
          >
            <span>🎮</span>
            游戏
          </button>
        </div>
        <div className="collection-actions">
          <button className="add-collection-btn">
            <i className="fas fa-plus"></i>
            添加收藏
          </button>
          <div className="view-mode">
            <button className="view-btn active">
              <i className="fas fa-th-large"></i>
            </button>
            <button className="view-btn">
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="collections-stats">
        <div className="stat-item">
          <span className="stat-value">256</span>
          <span className="stat-label">总收藏</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">12</span>
          <span className="stat-label">收藏夹</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">89</span>
          <span className="stat-label">本月新增</span>
        </div>
      </div>

      <div className="collections-grid">
        {collections.map(item => (
          <div 
            key={item.id} 
            className="collection-card"
            onClick={() => handleCollectionClick(item)}
          >
            <div className="collection-cover">
              <img src={item.cover} alt={item.title} />
              <div className="collection-type-badge">
                {item.type === 'movie' && '🎬'}
                {item.type === 'book' && '📚'}
                {item.type === 'music' && '🎵'}
                {item.type === 'game' && '🎮'}
              </div>
            </div>
            <div className="collection-info">
              <h3 className="collection-title">{item.title}</h3>
              <p className="collection-desc">{item.description}</p>
              <div className="collection-meta">
                <span className="collection-date">
                  <i className="far fa-calendar"></i>
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <div className="collection-stats">
                  <span><i className="far fa-heart"></i> {item.likes}</span>
                  <span><i className="far fa-comment"></i> {item.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 在组件内添加事件处理函数
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / btn.offsetWidth) * 100;
    const y = ((e.clientY - rect.top) / btn.offsetHeight) * 100;
    btn.style.setProperty('--x', `${x}%`);
    btn.style.setProperty('--y', `${y}%`);
  };

  // 相册模块的状态
  const [activePhotoTab, setActivePhotoTab] = useState('all');
  const [photoViewMode, setPhotoViewMode] = useState('grid');
  const [photoTimeFilter, setPhotoTimeFilter] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // 添加分页和加载状态
  const [photoPage, setPhotoPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PAGE_SIZE = 20;

  // 新增新建相册的状态
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);

  // 添加日期范围状态
  const [dateRange, setDateRange] = useState([null, null]);
  
  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      const [start, end] = dates;
      // 根据日期范围筛选照片
      const filtered = photoData.photos?.filter(photo => {
        const photoDate = new Date(photo.takenAt);
        return photoDate >= start && photoDate <= end;
      });
      // TODO: 更新显示的照片
    }
  };

  // 使用原生日期选择器
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 优化的照片筛选函数
  const filterPhotos = () => {
    if (!photoData.photos) return [];
    
    let filtered = [...photoData.photos];
    
    // 根据时间筛选
    if (photoTimeFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(photo => new Date(photo.takenAt) > monthAgo);
    } else if (photoTimeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(photo => new Date(photo.takenAt) > weekAgo);
    } else if (photoTimeFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(photo => new Date(photo.takenAt) > today);
    }
    
    // 日期范围筛选
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(photo => {
        const photoDate = new Date(photo.takenAt);
        return photoDate >= start && photoDate <= end;
      });
    }
    
    return filtered;
  };

  // 处理照片预览
  const handlePhotoPreview = (photo) => {
    // 使用原生对话框
    const dialog = document.createElement('dialog');
    dialog.className = 'photo-preview-dialog';
    dialog.innerHTML = `
      <div class="photo-preview">
        <img src="${photo.url}" alt="${photo.name}" />
        <button class="close-btn">&times;</button>
      </div>
    `;
    document.body.appendChild(dialog);
    
    const closeBtn = dialog.querySelector('.close-btn');
    closeBtn.onclick = () => {
      dialog.close();
      document.body.removeChild(dialog);
    };
    
    dialog.showModal();
  };

  // 处理照片喜欢
  const handlePhotoLike = (photo) => {
    // TODO: 实现照片喜欢功能
    console.log('Like photo:', photo);
  };

  // 处理照片下载
  const handlePhotoDownload = (photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.name || 'photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理加载更多
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // 模拟异步加载
    setTimeout(() => {
      setPhotoPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 500);
  };

  // 渲染新建相册模态框
  const renderNewAlbumModal = () => {
    if (!showNewAlbumModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowNewAlbumModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>新建相册</h3>
            <button 
              className="close-btn"
              onClick={() => setShowNewAlbumModal(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            {/* 相册表单内容 */}
            <form className="album-form">
              <div className="form-group">
                <label>相册名称</label>
                <input type="text" placeholder="请输入相册名称" />
              </div>
              <div className="form-group">
                <label>相册描述</label>
                <textarea placeholder="请输入相册描述"></textarea>
              </div>
              <div className="form-group">
                <label>封面图片</label>
                <div className="cover-upload">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>点击或拖拽上传封面</span>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={() => setShowNewAlbumModal(false)}>
              取消
            </button>
            <button className="confirm-btn">
              创建
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPhotoAlbum = () => (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <h2>我的相册</h2>
          <div className="module-stats">
            <div className="stat-item">
              <span className="stat-value">{photoData.totalCount || 0}</span>
              <span className="stat-label">总照片</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{photoData.albums?.length || 0}</span>
              <span className="stat-label">相册数</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <button className="new-item-btn">
            <span className="btn-icon">📸</span>
            <span className="btn-text">上传照片</span>
          </button>
        </div>
      </div>

      <div className="filter-container">
        <div className="album-tabs">
          <button 
            className={`album-tab ${activePhotoTab === 'all' ? 'active' : ''}`}
            onClick={() => setActivePhotoTab('all')}
          >
            <span className="tab-icon">📱</span>
            <span className="tab-name">全部照片</span>
            <span className="tab-count">{photoData.totalCount || 0}</span>
          </button>
          <button 
            className={`album-tab ${activePhotoTab === 'featured' ? 'active' : ''}`}
            onClick={() => setActivePhotoTab('featured')}
          >
            <span className="tab-icon">⭐</span>
            <span className="tab-name">精选集</span>
            <span className="tab-count">24</span>
          </button>
          <button 
            className={`album-tab ${activePhotoTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActivePhotoTab('favorites')}
          >
            <span className="tab-icon">❤️</span>
            <span className="tab-name">我的收藏</span>
            <span className="tab-count">56</span>
          </button>
        </div>
        
        <div className="view-mode">
          <button 
            className={`mode-btn ${photoViewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setPhotoViewMode('grid')}
          >
            <i className="fas fa-th"></i>
            网格视图
          </button>
          <button 
            className={`mode-btn ${photoViewMode === 'large' ? 'active' : ''}`}
            onClick={() => setPhotoViewMode('large')}
          >
            <i className="fas fa-square"></i>
            大图视图
          </button>
        </div>
      </div>

      <div className="albums-section">
        <div className="section-header">
          <h3>我的相册</h3>
          <button 
            className="new-album-btn"
            onClick={() => setShowNewAlbumModal(true)}
          >
            <i className="fas fa-plus"></i>
            新建相册
          </button>
        </div>
        
        <div className="albums-grid">
          {photoData.albums?.map(album => (
            <div key={album.id} className="album-card">
              <div className="album-cover">
                <div className="cover-grid">
                  {album.coverPhotos?.slice(0, 4).map((photo, index) => (
                    <img 
                      key={index}
                      src={photo.url} 
                      alt={`${album.name} - ${index + 1}`}
                      className="cover-photo"
                    />
                  ))}
                </div>
                <div className="album-overlay">
                  <span className="album-count">
                    <i className="fas fa-image"></i>
                    {album.photoCount}
                  </span>
                </div>
              </div>
              
              <div className="album-info">
                <div className="info-header">
                  <h4 className="album-name">{album.name}</h4>
                  <span className="album-date">
                    {new Date(album.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <p className="album-desc">{album.description}</p>
              </div>
              
              <div className="album-actions">
                <button className="action-btn view" title="查看">
                  <i className="far fa-eye"></i>
                </button>
                <button className="action-btn edit" title="编辑">
                  <i className="far fa-edit"></i>
                </button>
                <button className="action-btn share" title="分享">
                  <i className="far fa-share-square"></i>
                </button>
                <button className="action-btn more" title="更多">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="photos-section">
        <div className="section-header">
          <h3>最近上传</h3>
          <div className="date-range-picker">
            <div className="date-inputs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="开始日期"
              />
              <span>至</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="结束日期"
              />
            </div>
            <div className="quick-filters">
              <button 
                className={`quick-filter-btn ${photoTimeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setPhotoTimeFilter('all')}
              >
                全部
              </button>
              <button 
                className={`quick-filter-btn ${photoTimeFilter === 'month' ? 'active' : ''}`}
                onClick={() => setPhotoTimeFilter('month')}
              >
                近一个月
              </button>
              <button 
                className={`quick-filter-btn ${photoTimeFilter === 'week' ? 'active' : ''}`}
                onClick={() => setPhotoTimeFilter('week')}
              >
                近一周
              </button>
              <button 
                className={`quick-filter-btn ${photoTimeFilter === 'today' ? 'active' : ''}`}
                onClick={() => setPhotoTimeFilter('today')}
              >
                今天
              </button>
            </div>
          </div>
        </div>
        
        <div className={`photos-grid ${photoViewMode}`}>
          {filterPhotos().map(photo => (
            <div key={photo.id} className="photo-card">
              <div className="photo-wrapper">
                <img 
                  src={photo.url} 
                  alt={photo.name}
                  loading="lazy"
                />
                <div className="photo-overlay">
                  <div className="overlay-actions">
                    <button 
                      className="overlay-btn preview"
                      onClick={() => handlePhotoPreview(photo)}
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                    <button 
                      className="overlay-btn like"
                      onClick={() => handlePhotoLike(photo)}
                    >
                      <i className="far fa-heart"></i>
                    </button>
                    <button 
                      className="overlay-btn download"
                      onClick={() => handlePhotoDownload(photo)}
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="photo-info">
                <span className="photo-date">
                  <i className="far fa-calendar"></i>
                  {new Date(photo.takenAt).toLocaleDateString('zh-CN')}
                </span>
                <span className="photo-size">
                  <i className="fas fa-image"></i>
                  {photo.width} x {photo.height}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {filterPhotos().length < photoData.photos?.length && (
          <div className="load-more">
            <button 
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <span className="loading-spinner" />
              ) : (
                <>
                  <i className="fas fa-sync-alt" />
                  加载更多
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 渲染新建相册模态框 */}
      {renderNewAlbumModal()}
    </div>
  );

  // 渲染不同的模块
  const renderModule = () => {
    switch (activeModule) {
      case 'collections':
        return renderCollections();
        
      case 'photo-album':
        return renderPhotoAlbum();
        
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
        
      case 'journal':
        return renderJournals();

      case 'creation':
        return renderCreations();

      case 'timeline':
        return renderTimeline();

      case 'badges':
        return (
          <div className="badges-container">
            <div className="badges-stats">
              <div className="stat-item">
                <span className="stat-number">{badges.filter(b => b.achieved).length}</span>
                <span className="stat-label">已获得</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{badges.length}</span>
                <span className="stat-label">总成就</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{Math.round((badges.filter(b => b.achieved).length / badges.length) * 100)}%</span>
                <span className="stat-label">完成度</span>
              </div>
            </div>
            
            <div className="badges-grid">
              {badges.map(badge => (
                <div key={badge.id} className={`badge-card ${badge.achieved ? 'achieved' : ''}`}>
                  <div className="badge-content">
                    <div className="badge-icon">{badge.icon}</div>
                    <div className="badge-info">
                      <h3>{badge.title}</h3>
                      <p>{badge.description}</p>
                    </div>
                  </div>
                  
                  {!badge.achieved && (
                    <div className="badge-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{width: `${(badge.currentProgress / badge.requiredProgress) * 100}%`}}
                        />
                      </div>
                      <span className="progress-text">
                        {badge.currentProgress}/{badge.requiredProgress}
                      </span>
                    </div>
                  )}
                  
                  {badge.achieved && (
                    <div className="achievement-info">
                      <span className="achievement-icon">✓</span>
                      <span className="achievement-date">{badge.achievedDate}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
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