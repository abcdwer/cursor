import React, { useState, useRef, useEffect } from 'react';
import './InterestSpace.css';

// 添加 Emby 配置
const EMBY_SERVER = 'http://192.168.3.100:8096';
const EMBY_API_KEY = 'f879cbe6802545268f1d0cba84dfe8e7';

// 添加日期工具函数
const getDateKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 使用日期作为随机种子
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 修改生成排片表的函数
const generateSchedule = (movies) => {
  if (!movies.length) return [];
  
  const scheduleList = [];
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let currentTime = startOfDay;
  
  // 使用日期作为随机种子
  const dateKey = getDateKey(startOfDay);
  const shuffledMovies = [...movies].sort((a, b) => {
    return seededRandom(dateKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + a.id.length) - 
           seededRandom(dateKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + b.id.length);
  });

  // 生成24小时的排片表
  while (currentTime < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)) {
    // 根据时间段选择不同类型的电影
    const hour = currentTime.getHours();
    let moviePool = [...shuffledMovies];
    
    // 早上（6-12点）：偏向轻松、家庭类电影
    if (hour >= 6 && hour < 12) {
      moviePool = moviePool.sort((a, b) => {
        const aScore = a.title.includes('家庭') || a.title.includes('动画') ? 1 : 0;
        const bScore = b.title.includes('家庭') || b.title.includes('动画') ? 1 : 0;
        return bScore - aScore;
      });
    }
    // 下午（12-18点）：混合类型
    else if (hour >= 12 && hour < 18) {
      // 保持随机顺序
    }
    // 晚上（18-24点）：偏向动作、惊悚类电影
    else if (hour >= 18 && hour < 24) {
      moviePool = moviePool.sort((a, b) => {
        const aScore = a.title.includes('动作') || a.title.includes('惊悚') ? 1 : 0;
        const bScore = b.title.includes('动作') || b.title.includes('惊悚') ? 1 : 0;
        return bScore - aScore;
      });
    }
    // 凌晨（0-6点）：偏向文艺、经典类电影
    else {
      moviePool = moviePool.sort((a, b) => {
        const aScore = a.title.includes('经典') || a.title.includes('文艺') ? 1 : 0;
        const bScore = b.title.includes('经典') || b.title.includes('文艺') ? 1 : 0;
        return bScore - aScore;
      });
    }

    const movieIndex = scheduleList.length % moviePool.length;
    const movie = moviePool[movieIndex];
    const duration = movie.duration || 7200; // 使用电影实际时长或默认2小时
    const endTime = new Date(currentTime.getTime() + duration * 1000);
    
    scheduleList.push({
      movie,
      startTime: new Date(currentTime),
      endTime,
      isCurrentlyPlaying: now >= currentTime && now < endTime
    });
    
    currentTime = endTime;
  }
  
  return scheduleList;
};

// 在组件顶部添加过滤函数
const filterMoviesOnly = (items) => {
  return items.filter(item => 
    item.Type === 'Movie' || // 如果API返回Type字段
    !item.title.match(/S\d+E\d+/) // 排除包含SxxExx格式的剧集
  );
};

const InterestSpace = () => {
  const [activeCategory, setActiveCategory] = useState('photography');
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  // 添加 Emby 相关状态
  const [screeningList, setScreeningList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  // 添加一个状态记录上次的分类
  const [lastCategory, setLastCategory] = useState(null);

  // 添加一个 state 来保存推荐影单
  const [recommendations, setRecommendations] = useState([]);

  // 在组件中添加新的状态
  const [movieStats, setMovieStats] = useState({
    viewers: Math.floor(Math.random() * 100) + 20,
    likes: Math.floor(Math.random() * 50) + 10,
    comments: Math.floor(Math.random() * 30) + 5
  });

  // 在组件顶部添加 isFullscreen 状态
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = [
    { id: 'photography', name: '摄影', icon: '📸' },
    { id: 'movie', name: '影视', icon: '🎬' },
    { id: 'sports', name: '运动', icon: '⚽' },
    { id: 'gaming', name: '游戏', icon: '🎮' },
    { id: 'food', name: '美食', icon: '🍜' },
    { id: 'travel', name: '旅行', icon: '✈️' }
  ];

  // 修改获取电影列表的函数
  const fetchEmbyMovies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${EMBY_SERVER}/Items?api_key=${EMBY_API_KEY}&IncludeItemTypes=Movie&Recursive=true&Fields=RunTimeTicks,Genres,Tags`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data || !data.Items) throw new Error('Invalid data format');
      
      const movies = data.Items.map(item => ({
        id: item.Id,
        title: item.Name,
        url: `${EMBY_SERVER}/Videos/${item.Id}/stream.mp4?api_key=${EMBY_API_KEY}&Static=true`,
        cover: `${EMBY_SERVER}/Items/${item.Id}/Images/Primary?api_key=${EMBY_API_KEY}`,
        overview: item.Overview,
        duration: item.RunTimeTicks ? item.RunTimeTicks / 10000000 : 7200,
        genres: item.Genres || [],
        tags: item.Tags || []
      }));

      const scheduleList = generateSchedule(movies);
      setSchedule(scheduleList);
      setScreeningList(movies);
      
      // 生成推荐影单并保存
      const shuffledMovies = [...movies].sort(() => Math.random() - 0.5);
      setRecommendations(shuffledMovies.slice(0, 8));
      
      const now = new Date();
      const currentSlot = scheduleList.find(slot => 
        now >= slot.startTime && now < slot.endTime
      );

      if (currentSlot) {
        setCurrentSchedule(currentSlot);
        setCurrentMovie(currentSlot.movie);
      } else {
        setCurrentSchedule(scheduleList[0]);
        setCurrentMovie(scheduleList[0].movie);
      }
    } catch (error) {
      console.error('获取 Emby 电影列表失败:', error);
      setScreeningList([]);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时获取电影列表
  useEffect(() => {
    fetchEmbyMovies();
  }, []);

  // 修改自动切换电影的 useEffect
  useEffect(() => {
    if (!schedule.length) return;

    const checkAndUpdateMovie = () => {
      const now = new Date();
      const currentSlot = schedule.find(slot => 
        now >= slot.startTime && now < slot.endTime
      );

      if (currentSlot && (!currentSchedule || currentSlot.movie.id !== currentSchedule.movie.id)) {
        setCurrentSchedule(currentSlot);
        setCurrentMovie(currentSlot.movie);
      }
    };

    // 立即检查一次
    checkAndUpdateMovie();

    // 每分钟检查一次
    const interval = setInterval(checkAndUpdateMovie, 60000);

    return () => clearInterval(interval);
  }, [schedule, currentSchedule]);

  // 修改分类切换处理函数
  const handleCategoryChange = (categoryId) => {
    setLastCategory(activeCategory);
    setActiveCategory(categoryId);
    
    // 切换到影视分类时确保静音
    if (categoryId === 'movie') {
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  };

  // 添加一个 useEffect 来处理影视分类的重新进入
  useEffect(() => {
    if (activeCategory === 'movie' && lastCategory !== 'movie') {
      // 如果是重新进入影视分类，重新初始化播放
      if (currentSchedule && videoRef.current) {
        const now = new Date();
        if (now >= currentSchedule.startTime && now < currentSchedule.endTime) {
          const elapsed = (now - currentSchedule.startTime) / 1000;
          videoRef.current.currentTime = elapsed;
          videoRef.current.play().catch(console.error);
        }
      }
    }
  }, [activeCategory, lastCategory, currentSchedule]);

  // 修改视频播放控制的 useEffect
  useEffect(() => {
    if (!currentMovie || !videoRef.current || !currentSchedule || activeCategory !== 'movie') return;

    const video = videoRef.current;
    
    // 设置视频源
    const videoUrl = new URL(currentMovie.url);
    videoUrl.searchParams.append('_t', Date.now());
    video.src = videoUrl.toString();
    
    // 确保初始状态为静音
    video.muted = true;
    video.volume = volume;

    const handlePlay = async () => {
      try {
        const now = new Date();
        if (now >= currentSchedule.startTime && now < currentSchedule.endTime) {
          const elapsed = (now - currentSchedule.startTime) / 1000;
          video.currentTime = elapsed;
          await video.play();
        } else {
          const timeUntilStart = currentSchedule.startTime - now;
          if (timeUntilStart > 0) {
            setTimeout(async () => {
              video.currentTime = 0;
              await video.play();
            }, timeUntilStart);
          }
        }
      } catch (error) {
        console.error('播放错误:', error);
      }
    };

    video.addEventListener('loadedmetadata', handlePlay);

    return () => {
      video.removeEventListener('loadedmetadata', handlePlay);
      if (activeCategory !== 'movie') {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [currentMovie, currentSchedule, activeCategory]);

  // 单独处理音量变化的 useEffect
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // 修改音量控制函数
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      // 移除 currentTime 的设置，只更新音量
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // 修改静音切换函数
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      
      // 如果取消静音时音量为 0，设置一个默认音量
      if (!newMutedState && volume === 0) {
        const defaultVolume = 0.5;
        videoRef.current.volume = defaultVolume;
        setVolume(defaultVolume);
      }
    }
  };

  // 修改 toggleFullscreen 函数
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 添加全屏变化事件监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 修改排片表显示
  const renderScheduleList = () => {
    return (
      <>
        <div className="schedule-list">
          {schedule.map((slot) => (
            <div 
              key={`${slot.movie.id}-${slot.startTime}`}
              className={`schedule-item ${slot === currentSchedule ? 'playing' : ''}`}
            >
              <img src={slot.movie.cover} alt={slot.movie.title} />
              <div className="schedule-info">
                <h5>{slot.movie.title}</h5>
                <p>{slot.startTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })} - {slot.endTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
                {slot === currentSchedule && (
                  <span className="now-playing">正在放映</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="movie-stats">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{movieStats.viewers}</span>
            <span className="stat-label">在看</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{movieStats.likes}</span>
            <span className="stat-label">喜欢</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{movieStats.comments}</span>
            <span className="stat-label">评论</span>
          </div>
        </div>
      </>
    );
  };

  // 添加视频进度更新处理函数
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const now = new Date();
      
      // 计算当前进度
      if (currentSchedule) {
        const totalDuration = (currentSchedule.endTime - currentSchedule.startTime) / 1000;
        const elapsed = (now - currentSchedule.startTime) / 1000;
        const progress = (elapsed / totalDuration) * 100;
        setProgress(Math.min(progress, 100));
      }
    }
  };

  // 添加视频结束处理函数
  const handleMovieEnd = () => {
    if (schedule.length > 0) {
      const currentIndex = schedule.findIndex(slot => slot === currentSchedule);
      const nextIndex = (currentIndex + 1) % schedule.length;
      setCurrentSchedule(schedule[nextIndex]);
      setCurrentMovie(schedule[nextIndex].movie);
    }
  };

  // 修改推荐影单渲染函数
  const renderRecommendations = () => {
    return (
      <div className="movie-recommendations">
        {recommendations.map(movie => (
          <div key={movie.id} className="movie-card">
            <div className="movie-poster">
              <img src={movie.cover} alt={movie.title} loading="lazy" />
              <div className="movie-info-overlay">
                <h4 className="movie-title">{movie.title}</h4>
                <div className="movie-meta">
                  <span className="movie-duration">
                    {Math.floor(movie.duration / 60)}分钟
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 添加刷新推荐的函数
  const refreshRecommendations = () => {
    const shuffledMovies = [...screeningList].sort(() => Math.random() - 0.5);
    setRecommendations(shuffledMovies.slice(0, 8));
  };

  // 定义动态类型数据
  const activityTypes = [
    {
      type: 'playlist',
      icon: '📋',
      template: '创建了一个影单',
      content: {
        title: '年度必看科幻片单',
        count: '12部影片',
        description: '精选2024最值得观看的科幻电影...'
      }
    },
    {
      type: 'recommend',
      icon: '🎬',
      template: '推荐了一部电影',
      content: {
        rating: 9.2,
        comment: '这部电影的视觉效果令人震撼，剧情紧凑，节奏把控完美...'
      }
    },
    {
      type: 'review',
      icon: '✍️',
      template: '发表了影评',
      content: {
        title: '深度解析：电影的叙事结构与主题表达',
        excerpt: '本片通过独特的叙事手法展现了...'
      }
    },
    {
      type: 'share',
      icon: '💫',
      template: '分享了观影心得',
      content: {
        mood: '震撼',
        tags: ['视效震撼', '剧情烧脑', '演技在线']
      }
    }
  ];

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'photography':
        return (
          <div className="category-content">
            <div className="photography-section">
              <h3>我的作品集</h3>
              <div className="photo-gallery">
                {/* 照片展示区域 */}
              </div>
              <h3>摄影技巧</h3>
              <div className="photography-tips">
                {/* 摄影教程和技巧 */}
              </div>
            </div>
          </div>
        );

      case 'movie':
        return (
          <div className="category-content movie-content">
            <div className="movie-layout">
              {/* 左侧放映室 */}
              <div className="movie-main">
                <div className="theater-section">
                  <h3>今日放映</h3>
                  {isLoading ? (
                    <div className="loading">
                      <div className="loading-spinner"></div>
                      <span>正在连接 Emby 服务器...</span>
                    </div>
                  ) : screeningList.length === 0 ? (
                    <div className="error-message">
                      <span>无法连接到 Emby 服务器，请检查网络连接或服务器状态</span>
                      <button onClick={fetchEmbyMovies} className="retry-button">
                        重试
                      </button>
                    </div>
                  ) : (
                    <div className="theater-container" ref={containerRef}>
                      <div className="current-screening">
                        {currentMovie && (
                          <>
                            <div className="theater-player">
                              <video
                                ref={videoRef}
                                key={currentMovie.id}
                                className="theater-video"
                                playsInline
                                controls
                                controlsList="nodownload noremoteplayback noplaybackrate"
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleMovieEnd}
                                onClick={(e) => e.preventDefault()}
                              />
                              <div className="theater-controls">
                                <div className="progress-bar">
                                  <div 
                                    className="progress-filled"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧排片表 */}
              <div className="movie-sidebar">
                <div className="screening-schedule">
                  <h4>今日排片</h4>
                  {renderScheduleList()}
                </div>
              </div>
            </div>

            {/* 底部其他内容 */}
            <div className="movie-sections">
              <div className="movie-recommendations-section">
                <div className="recommendations-header">
                  <h3>推荐影单</h3>
                  <button 
                    className="refresh-button"
                    onClick={refreshRecommendations}
                    title="换一批"
                  >
                    <span className="refresh-icon">🔄</span>
                  </button>
                </div>
                {renderRecommendations()}
              </div>
              
              <div className="movie-ranking-section">
                <h3>影视排行</h3>
                <div className="ranking-tabs">
                  <button className="ranking-tab active">动漫排行</button>
                  <button className="ranking-tab">电影排行</button>
                  <button className="ranking-tab">剧集排行</button>
                </div>
                <div className="ranking-list">
                  {screeningList.slice(0, 5).map((movie, index) => (
                    <div key={movie.id} className="ranking-item">
                      <span className="ranking-number">{index + 1}</span>
                      <img src={movie.cover} alt={movie.title} />
                      <div className="ranking-info">
                        <h4>{movie.title}</h4>
                        <div className="ranking-stats">
                          <span>评分 9.{Math.floor(Math.random() * 10)}</span>
                          <span>{Math.floor(Math.random() * 10000)}人看过</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="movie-cards-section">
                <div className="section-header">
                  <h3>名片卡牌</h3>
                  <button 
                    className="refresh-button"
                    onClick={() => {
                      const moviesOnly = filterMoviesOnly(screeningList);
                      const shuffled = [...moviesOnly].sort(() => Math.random() - 0.5);
                      setScreeningList(shuffled);
                    }}
                    title="换一批"
                  >
                    <span className="refresh-icon">🔄</span>
                  </button>
                </div>
                <div className="cards-grid">
                  {filterMoviesOnly(screeningList).slice(0, 6).map(movie => (
                    <div key={movie.id} className="movie-card-item">
                      <div className="card-poster">
                        <img src={movie.cover} alt={movie.title} />
                        <div className="card-overlay">
                          <span className="card-type">电影</span>
                          <span className="card-year">2024</span>
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="card-title">{movie.title}</div>
                        <div className="card-stats">
                          <span className="card-rating">
                            <span className="star">⭐</span> 
                            {(Math.random() * 2 + 8).toFixed(1)}
                          </span>
                          <span className="card-views">
                            {Math.floor(Math.random() * 9000 + 1000)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="movie-discussion-section">
                <h3>影视动态</h3>
                <div className="discussion-list">
                  {[...Array(4)].map((_, i) => {
                    const activity = activityTypes[i];
                    const movie = screeningList[i];
                    return (
                      <div key={i} className="discussion-item">
                        <div className="discussion-avatar">👤</div>
                        <div className="discussion-content">
                          <div className="discussion-header">
                            <div className="user-info">
                              <span className="user-name">用户{i + 1}</span>
                              <span className="activity-type">
                                {activity.icon} {activity.template}
                              </span>
                            </div>
                            <span className="post-time">42分钟前</span>
                          </div>
                          
                          <div className="share-content">
                            {activity.type === 'playlist' && (
                              <div className="playlist-share">
                                <h4>{activity.content.title}</h4>
                                <p>{activity.content.description}</p>
                                <div className="playlist-preview">
                                  <span className="playlist-count">{activity.content.count}</span>
                                  <div className="playlist-covers">
                                    {screeningList.slice(0, 3).map((m, idx) => (
                                      <img key={idx} src={m.cover} alt={m.title} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {(activity.type === 'recommend' || activity.type === 'review' || activity.type === 'share') && (
                              <div className="movie-share">
                                <div className="share-movie">
                                  <img src={movie?.cover} alt={movie?.title} />
                                  <div className="share-movie-info">
                                    <h4>{movie?.title}</h4>
                                    {activity.type === 'recommend' && (
                                      <div className="movie-rating">
                                        <span className="rating-score">⭐ {activity.content.rating}</span>
                                        <p className="rating-comment">{activity.content.comment}</p>
                                      </div>
                                    )}
                                    {activity.type === 'review' && (
                                      <div className="movie-review">
                                        <h5>{activity.content.title}</h5>
                                        <p>{activity.content.excerpt}</p>
                                      </div>
                                    )}
                                    {activity.type === 'share' && (
                                      <div className="movie-feeling">
                                        <span className="feeling-mood">感觉{activity.content.mood}</span>
                                        <div className="feeling-tags">
                                          {activity.content.tags.map((tag, idx) => (
                                            <span key={idx} className="tag">#{tag}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="discussion-actions">
                            <button className="action-btn">
                              <span>👍</span> {Math.floor(Math.random() * 200 + 100)}
                            </button>
                            <button className="action-btn">
                              <span>💬</span> {Math.floor(Math.random() * 100 + 50)}
                            </button>
                            <button className="action-btn">
                              <span>🔁</span> {Math.floor(Math.random() * 50 + 20)}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'sports':
        return (
          <div className="category-content">
            <div className="sports-section">
              <h3>运动记录</h3>
              <div className="workout-tracker">
                {/* 运动数据统计 */}
              </div>
              <h3>训练计划</h3>
              <div className="workout-plans">
                {/* 训练计划列表 */}
              </div>
            </div>
          </div>
        );

      case 'gaming':
        return (
          <div className="category-content">
            <div className="gaming-section">
              <h3>游戏库</h3>
              <div className="game-library">
                {/* 游戏收藏列表 */}
              </div>
              <h3>游戏成就</h3>
              <div className="achievements">
                {/* 游戏成就展示 */}
              </div>
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="category-content">
            <div className="food-section">
              <h3>美食地图</h3>
              <div className="food-map">
                {/* 美食探店记录 */}
              </div>
              <h3>私房菜谱</h3>
              <div className="recipes">
                {/* 收藏的菜谱 */}
              </div>
            </div>
          </div>
        );

      case 'travel':
        return (
          <div className="category-content">
            <div className="travel-section">
              <h3>旅行足迹</h3>
              <div className="travel-map">
                {/* 旅行地图 */}
              </div>
              <h3>旅行计划</h3>
              <div className="travel-plans">
                {/* 旅行计划和攻略 */}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="interest-space">
      {/* 添加樱花飘落容器 */}
      <div className="sakura-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`sakura ${['small', 'medium', 'large'][i % 3]}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
      {renderCategoryContent()}
    </div>
  );
};

export default InterestSpace;
