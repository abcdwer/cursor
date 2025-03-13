import React from 'react';
import './Music.css';

const Music = () => {
  return (
    <div className="music-section">
      {/* 音乐收藏 */}
      <div className="music-collection">
        <h3>我的音乐收藏</h3>
        <div className="music-grid">
          {/* 音乐卡片示例 */}
          <div className="music-card">
            <div className="album-cover">
              <img src="https://via.placeholder.com/200" alt="专辑封面" />
              <div className="play-overlay">
                <button className="play-btn">▶</button>
              </div>
            </div>
            <div className="music-info">
              <h4>歌曲名称</h4>
              <p>歌手名称</p>
            </div>
          </div>
        </div>
      </div>

      {/* 播放列表 */}
      <div className="playlist-section">
        <h3>我的歌单</h3>
        <div className="playlist-grid">
          <div className="playlist-card">
            <div className="playlist-cover">
              <img src="https://via.placeholder.com/200" alt="歌单封面" />
              <div className="playlist-info">
                <h4>我喜欢的音乐</h4>
                <p>100首歌</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 音乐动态 */}
      <div className="music-moments">
        <h3>音乐动态</h3>
        <div className="moments-list">
          <div className="moment-card">
            <div className="moment-header">
              <span className="moment-time">2小时前</span>
              <span className="moment-type">分享单曲</span>
            </div>
            <div className="moment-content">
              <p>这首歌真的很棒！推荐给大家 🎵</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music; 