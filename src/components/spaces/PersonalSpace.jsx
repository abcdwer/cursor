import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
// 导入默认头像
import defaultAvatar from '../../assets/images/default-avatar.png';
import './PersonalSpace.css'; // 确保引入样式文件

// Emby 服务器配置
const EMBY_SERVER = 'http://192.168.3.100:8096';
const EMBY_API_KEY = 'f879cbe6802545268f1d0cba84dfe8e7';

// Emby 服务
const embyService = {
  // 获取电影列表
  getMovies: async () => {
    try {
      const response = await axios.get(`${EMBY_SERVER}/Items`, {
        params: {
          IncludeItemTypes: 'Movie',
          Recursive: true,
          Fields: 'Overview,Path,MediaSources',
          api_key: EMBY_API_KEY
        }
      });

      return response.data.Items.map(movie => ({
        id: movie.Id,
        title: movie.Name,
        cover: `${EMBY_SERVER}/Items/${movie.Id}/Images/Primary?api_key=${EMBY_API_KEY}`,
        description: movie.Overview || '暂无简介',
        videoUrl: `${EMBY_SERVER}/Videos/${movie.Id}/stream?api_key=${EMBY_API_KEY}&Static=true`,
        duration: movie.RunTimeTicks ? movie.RunTimeTicks / 10000000 : 7200
      }));
    } catch (error) {
      console.error('Error fetching Emby movies:', error);
      return [];
    }
  }
};

const PersonalSpace = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [nextMovie, setNextMovie] = useState(null);
  const [showingTime, setShowingTime] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 获取电影列表
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await embyService.getMovies();
        setMoviesList(movies);
        if (movies.length > 0) {
          const scheduleList = generateSchedule(movies);
          setSchedule(scheduleList);
          
          const currentSchedule = scheduleList.find(item => item.isCurrentlyPlaying);
          if (currentSchedule) {
            setCurrentMovie(currentSchedule.movie);
            const nextSchedule = scheduleList[scheduleList.indexOf(currentSchedule) + 1] || scheduleList[0];
            setNextMovie(nextSchedule.movie);
            setShowingTime(`${currentSchedule.startTime.toLocaleTimeString()} - ${currentSchedule.endTime.toLocaleTimeString()}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };
    fetchMovies();
  }, []);

  // 视频播放控制
  useEffect(() => {
    if (!currentMovie || !videoRef.current) return;

    const video = videoRef.current;
    
    // 添加 timestamp 参数来避免浏览器缓存
    const videoUrl = new URL(currentMovie.videoUrl);
    videoUrl.searchParams.append('_t', Date.now());
    
    video.src = videoUrl.toString();
    video.load();

    const handleMetadata = () => {
      const currentScheduleItem = schedule.find(item => item.isCurrentlyPlaying);
      if (currentScheduleItem) {
        const now = new Date();
        const progress = (now - currentScheduleItem.startTime) / 
                       (currentScheduleItem.endTime - currentScheduleItem.startTime);
        video.currentTime = video.duration * progress;
      }
      
      // 检查视频是否已经在播放
      if (video.paused) {
        video.play().catch(error => {
          console.error('Playback error:', error);
        });
      }
    };

    video.addEventListener('loadedmetadata', handleMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [currentMovie, schedule]);

  // 更新页面标题，避免显示加载状态
  useEffect(() => {
    const originalTitle = document.title;
    const observer = new MutationObserver(() => {
      if (document.title !== originalTitle) {
        document.title = originalTitle;
      }
    });

    observer.observe(document.querySelector('title'), {
      childList: true,
      characterData: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  // 添加自动点击取消加载的逻辑
  useEffect(() => {
    const cancelLoading = () => {
      // 模拟点击 ESC 键
      const escKeyEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(escKeyEvent);
    };

    // 定期检查并取消加载状态
    const intervalId = setInterval(cancelLoading, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // 生成排片表
  const generateSchedule = (movies) => {
    if (!movies.length) return [];
    
    const scheduleList = [];
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let currentTime = startOfDay;
    let movieIndex = 0;
    
    while (currentTime < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)) {
      const movie = movies[movieIndex];
      const endTime = new Date(currentTime.getTime() + movie.duration * 1000);
      
      scheduleList.push({
        movie,
        startTime: new Date(currentTime),
        endTime,
        isCurrentlyPlaying: now >= currentTime && now < endTime
      });
      
      currentTime = endTime;
      movieIndex = (movieIndex + 1) % movies.length;
    }
    
    return scheduleList;
  };

  // 添加全屏处理函数
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`全屏错误: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 处理音量变化
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
      videoRef.current.muted = newVolume === 0;
    }
  };

  // 处理静音切换
  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
      if (!newMutedState && volume === 0) {
        const newVolume = 0.5;
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
      }
    }
  };

  // 初始化音量状态
  useEffect(() => {
    if (videoRef.current) {
      setVolume(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  // 格式化时间的辅助函数
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <div className="profile-section">
        <h2>个人信息</h2>
        <div className="profile-info">
          <img 
            src={user?.avatar || defaultAvatar} 
            alt="头像" 
            className="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
          <div className="info">
            <p>用户名：{user?.username || '访客'}</p>
            <p>邮箱：{user?.email || '未设置'}</p>
          </div>
        </div>
      </div>

      <div className="movie-section">
        <h2>放映室</h2>
        {currentMovie && (
          <>
            <div className="current-movie">
              <h3>正在播放：{currentMovie.title}</h3>
              <p>放映时间：{showingTime}</p>
            </div>
            <div 
              className="projector-container" 
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
            >
              <video
                ref={videoRef}
                className="video-player"
                playsInline
                autoPlay
                muted
                controlsList="nodownload noremoteplayback"
                onTimeUpdate={(e) => {
                  const video = e.target;
                  const currentScheduleItem = schedule.find(item => item.isCurrentlyPlaying);
                  if (currentScheduleItem) {
                    const now = new Date();
                    const progress = (now - currentScheduleItem.startTime) / 
                                   (currentScheduleItem.endTime - currentScheduleItem.startTime);
                    const expectedTime = video.duration * progress;
                    
                    if (Math.abs(video.currentTime - expectedTime) > 5) {
                      video.currentTime = expectedTime;
                    }
                    
                    setProgress((video.currentTime / video.duration) * 100);
                    setCurrentTime(video.currentTime);
                  }
                }}
                onLoadedMetadata={(e) => {
                  setDuration(e.target.duration);
                }}
                onPause={(e) => {
                  e.preventDefault();
                  e.target.play();
                }}
                onVolumeChange={(e) => {
                  const video = e.target;
                  setVolume(video.volume);
                  setIsMuted(video.muted);
                }}
              />
              <div className="custom-controls">
                <div className="controls-row">
                  <div className="volume-control">
                    <button 
                      className={`control-button volume-button ${isMuted ? 'muted' : ''}`}
                      onClick={handleMuteToggle}
                      title={isMuted ? '取消静音' : '静音'}
                    />
                    <div className="volume-slider-wrapper">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                        title="音量"
                        orient="vertical"
                      />
                    </div>
                  </div>
                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  <button 
                    className="control-button fullscreen-button"
                    onClick={handleFullscreen}
                    title={isFullscreen ? '退出全屏' : '全屏'}
                  />
                </div>
                <div className={`custom-progress ${isHovered ? 'visible' : ''}`}>
                  <div 
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="schedule-section">
          <h3>今日排片表</h3>
          <div className="schedule-list">
            {schedule.map((item, index) => (
              <div 
                key={`${item.movie.id}-${index}`} 
                className={`schedule-item ${item.isCurrentlyPlaying ? 'playing' : ''}`}
              >
                <img 
                  src={item.movie.cover} 
                  alt={item.movie.title} 
                  className="schedule-movie-cover"
                />
                <div className="schedule-info">
                  <h4>{item.movie.title}</h4>
                  <p className="schedule-time">
                    {item.startTime.toLocaleTimeString()} - {item.endTime.toLocaleTimeString()}
                  </p>
                  {item.isCurrentlyPlaying && (
                    <span className="now-playing-badge">正在放映</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSpace;