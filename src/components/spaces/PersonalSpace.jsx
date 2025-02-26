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
        <h2>我的日志</h2>
        <button className="new-journal-btn">
          <span>写日志</span>
        </button>
      </div>

      <div className="journals-stats">
        <div className="stat-item">
          <span className="icon">��</span>
          <span>共 {journals.length} 篇</span>
        </div>
        <div className="stat-item">
          <span className="icon">📅</span>
          <span>本月 {journals.filter(j => 
            new Date(j.date).getMonth() === new Date().getMonth()
          ).length} 篇</span>
        </div>
      </div>
      
      <div className="journals-grid">
        {journals.map(journal => (
          <div key={journal.id} className="journal-card">
            <div className="journal-header">
              <div className="journal-date">
                <span className="date-day">{new Date(journal.date).getDate()}</span>
                <span className="date-month">{new Date(journal.date).toLocaleString('zh-CN', { month: 'long' })}</span>
              </div>
              <div className="journal-meta">
                <span className="journal-mood">{journal.mood}</span>
                <span className="journal-weather">{journal.weather}</span>
                <span className="journal-location">📍 {journal.location}</span>
              </div>
            </div>
            
            <h3 className="journal-title">{journal.title}</h3>
            <p className="journal-excerpt">{journal.excerpt}</p>
            
            <div className="journal-footer">
              <button className="read-more">继续阅读</button>
              <div className="journal-stats">
                <span>👁️ 123</span>
                <span>💭 45</span>
                <span>❤️ 67</span>
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
        <h2>我的创作</h2>
        <div className="creation-filters">
          <button className="active">全部</button>
          <button>文字</button>
          <button>图片</button>
          <button>音乐</button>
          <button>视频</button>
        </div>
      </div>
      
      <div className="creations-showcase">
        {creations.map(creation => (
          <div key={creation.id} className={`creation-item ${creation.type}`}>
            <div className="creation-content">
              {creation.type === 'text' ? (
                <div className="text-preview">
                  <h3>{creation.title}</h3>
                  <p>{creation.content}</p>
                </div>
              ) : (
                <div className="media-preview">
                  <img src={creation.url} alt={creation.title} />
                  <div className="media-overlay">
                    <h3>{creation.title}</h3>
                    <p>{creation.description}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="creation-info">
              <div className="creation-meta">
                <span className="creation-date">{creation.date}</span>
                <span className="creation-type">{creation.type}</span>
              </div>
              <div className="creation-actions">
                <button className="action-btn edit">编辑</button>
                <button className="action-btn share">分享</button>
                <button className="action-btn more">•••</button>
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
        <h2>时光轴</h2>
        <div className="timeline-navigation">
          <button className="year-btn">2024</button>
          <button className="year-btn">2023</button>
          <button className="year-btn">2022</button>
        </div>
      </div>
      
      <div className="timeline-content">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="timeline-event">
            <div className="event-time">
              <span className="event-year">{event.year}</span>
              <span className="event-month">{event.month}</span>
            </div>
            
            <div className="event-connector">
              <div className="connector-line"></div>
              <div className="connector-dot">
                <span className="event-icon">{event.icon}</span>
              </div>
            </div>
            
            <div className="event-card">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              
              {event.images?.length > 0 && (
                <div className="event-gallery">
                  {event.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="event-image">
                      <img src={image} alt={`${event.title} - ${imgIndex + 1}`} />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="event-footer">
                <div className="event-tags">
                  <span className="tag">#{event.year}</span>
                  <span className="tag">#{event.title.split(' ')[0]}</span>
                </div>
                <button className="event-details-btn">查看详情</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染不同的模块
  const renderModule = () => {
    switch (activeModule) {
      case 'collections':
        return (
          <div className="collections-container">
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

            <div className="collection-grid">
              {collections.map(item => (
                <div 
                  key={item.id} 
                  className={`collection-item ${item.type}`}
                  onClick={() => handleCollectionClick(item)}
                >
                  <div className="collection-cover">
                    <img src={item.cover} alt={item.title} />
                  </div>
                  <div className="collection-info">
                    <h3 className="collection-title">{item.title}</h3>
                    <p className="collection-desc">{item.description}</p>
                    <div className="collection-tags">
                      {item.tags.map(tag => (
                        <span key={tag} className="collection-tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="collection-meta">
                      <span className="collection-date">{item.date}</span>
                      <div className="collection-rating">
                        <span>★</span>
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {collections.length === 0 && (
              <div className="collection-empty">
                <div className="collection-empty-icon">📦</div>
                <p>还没有收藏任何内容</p>
              </div>
            )}
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
        
      case 'journal':
        return renderJournals();

      case 'creation':
        return renderCreations();

      case 'timeline':
        return renderTimeline();

      case 'memory':
        return (
          <div className="memory-wall-container">
            <div className="memory-header">
              <h2>回忆墙</h2>
              <div className="memory-controls">
                <button>添加回忆</button>
                <select>
                  <option>按时间排序</option>
                  <option>按重要性排序</option>
                </select>
              </div>
            </div>
            <div className="memory-grid">
              {memories.map(memory => (
                <div 
                  key={memory.id} 
                  className="memory-card"
                  style={{
                    backgroundColor: memory.color,
                    transform: `rotate(${Math.random() * 6 - 3}deg)`
                  }}
                >
                  <div className="memory-content">
                    <h3>{memory.title}</h3>
                    <p>{memory.content}</p>
                    {memory.image && <img src={memory.image} alt={memory.title} />}
                  </div>
                  <div className="memory-meta">
                    <span className="date">{memory.date}</span>
                    <span className="tags">
                      {memory.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'badges':
        return (
          <div className="badges-container">
            <div className="badges-header">
              <h2>成就徽章</h2>
              <div className="badges-stats">
                <span>已获得: {badges.filter(b => b.achieved).length}</span>
                <span>总数: {badges.length}</span>
              </div>
            </div>
            <div className="badges-grid">
              {badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`badge-card ${badge.achieved ? 'achieved' : 'locked'}`}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-info">
                    <h3>{badge.title}</h3>
                    <p>{badge.description}</p>
                    {badge.achieved ? (
                      <div className="achievement-date">
                        获得于 {badge.achievedDate}
                      </div>
                    ) : (
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{width: `${(badge.currentProgress / badge.requiredProgress) * 100}%`}}
                        ></div>
                      </div>
                    )}
                  </div>
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