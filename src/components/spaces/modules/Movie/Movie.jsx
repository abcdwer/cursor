import React, { useState, useRef, useEffect } from 'react';
import './Movie.css';
import { EMBY_SERVER, EMBY_API_KEY, generateSchedule } from './config';

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

const Movie = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [screeningList, setScreeningList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [movieStats, setMovieStats] = useState({
    viewers: Math.floor(Math.random() * 100) + 20,
    likes: Math.floor(Math.random() * 50) + 10,
    comments: Math.floor(Math.random() * 30) + 5
  });

  // 添加排行榜数据
  const rankingList = [
    { rank: 1, title: "奥本海默", score: 9.3, trend: "up", weeklyViews: 12580 },
    { rank: 2, title: "疯狂动物城", score: 9.1, trend: "down", weeklyViews: 10240 },
    { rank: 3, title: "星际穿越", score: 9.0, trend: "same", weeklyViews: 9870 },
    { rank: 4, title: "盗梦空间", score: 8.9, trend: "up", weeklyViews: 8960 },
    { rank: 5, title: "泰坦尼克号", score: 8.8, trend: "down", weeklyViews: 7650 }
  ];

  // 添加电影分类数据
  const movieCategories = [
    { name: "动作", icon: "💥", count: 128 },
    { name: "科幻", icon: "🚀", count: 95 },
    { name: "喜剧", icon: "😄", count: 156 },
    { name: "爱情", icon: "💝", count: 112 },
    { name: "动画", icon: "🎨", count: 89 },
    { name: "悬疑", icon: "🔍", count: 76 }
  ];

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
      
      // 生成推荐影单
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

  useEffect(() => {
    fetchEmbyMovies();
  }, []);

  return (
    <div className="category-content movie-content">
      <div className="movie-layout">
        {/* 放映室 */}
        <div className="theater-section panel-card">
          <div className="theater-header">
            <div className="theater-title">
              <h3>今日放映</h3>
              {currentMovie && (
                <div className="current-movie-info">
                  <span className="now-playing">正在播放：{currentMovie.title}</span>
                </div>
              )}
            </div>
          </div>
          <div className="theater-content">
            <div className="theater-main">
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
                  {currentMovie && (
                    <>
                      <video
                        ref={videoRef}
                        src={currentMovie.url}
                        poster={currentMovie.cover}
                        autoPlay
                        loop
                        controls
                        controlsList="nodownload"
                      />
                      <div className="movie-info">
                        <h2>{currentMovie.title}</h2>
                        <div className="movie-meta">
                          <span>👥 {movieStats.viewers}</span>
                          <span>❤️ {movieStats.likes}</span>
                          <span>💬 {movieStats.comments}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* 排片表放在右边 */}
            <div className="schedule-list">
              <div className="schedule-timeline">
                {schedule.map((slot, index) => (
                  <div
                    key={index}
                    className={`schedule-slot ${currentSchedule === slot ? 'current' : ''}`}
                    onClick={() => setCurrentMovie(slot.movie)}
                  >
                    <span className="time">
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="title">{slot.movie.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 其他内容区域 */}
        <div className="content-grid">
          {/* 左侧主要内容 */}
          <div className="content-main">
            {/* 推荐影单 */}
            <div className="recommendations-section panel-card">
              <h3>推荐影单</h3>
              <div className="recommendations-list">
                {recommendations.map((movie, index) => (
                  <div
                    key={index}
                    className="recommendation-item"
                    onClick={() => setCurrentMovie(movie)}
                  >
                    <img src={movie.cover} alt={movie.title} />
                    <div className="recommendation-info">
                      <h4>{movie.title}</h4>
                      <p>{movie.overview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 活动流 */}
            <div className="activity-section panel-card">
              <h3>最近动态</h3>
              <div className="activity-list">
                {activityTypes.map((activity, index) => (
                  <div key={index} className="activity-card">
                    <div className="activity-header">
                      <span className="activity-icon">{activity.icon}</span>
                      <span className="activity-type">{activity.template}</span>
                    </div>
                    <div className="activity-content">
                      {activity.type === 'playlist' && (
                        <div className="playlist-content">
                          <h4>{activity.content.title}</h4>
                          <p>{activity.content.description}</p>
                          <span className="movie-count">{activity.content.count}</span>
                        </div>
                      )}
                      {activity.type === 'recommend' && (
                        <div className="recommend-content">
                          <div className="rating">⭐ {activity.content.rating}</div>
                          <p>{activity.content.comment}</p>
                        </div>
                      )}
                      {activity.type === 'review' && (
                        <div className="review-content">
                          <h4>{activity.content.title}</h4>
                          <p>{activity.content.excerpt}</p>
                        </div>
                      )}
                      {activity.type === 'share' && (
                        <div className="share-content">
                          <div className="mood">心情：{activity.content.mood}</div>
                          <div className="tags">
                            {activity.content.tags.map((tag, idx) => (
                              <span key={idx} className="tag">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="content-sidebar">
            {/* 影视排行榜 */}
            <div className="ranking-section panel-card">
              <h3>影视排行榜</h3>
              <div className="ranking-list">
                {rankingList.map((item) => (
                  <div key={item.rank} className="ranking-item">
                    <span className={`rank rank-${item.rank}`}>{item.rank}</span>
                    <div className="ranking-info">
                      <h4>{item.title}</h4>
                      <div className="ranking-meta">
                        <span className="score">⭐ {item.score}</span>
                        <span className="trend">
                          {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                        </span>
                        <span className="views">👁️ {(item.weeklyViews/1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 电影分类 */}
            <div className="categories-section panel-card">
              <h3>电影分类</h3>
              <div className="categories-grid">
                {movieCategories.map((category, index) => (
                  <div key={index} className="category-card">
                    <span className="category-icon">{category.icon}</span>
                    <div className="category-info">
                      <h4>{category.name}</h4>
                      <span className="movie-count">{category.count}部</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie; 