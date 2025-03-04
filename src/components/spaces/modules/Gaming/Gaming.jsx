import React from 'react';
import './Gaming.css';

const Gaming = () => {
  return (
    <div className="category-content">
      <div className="gaming-section">
        {/* 游戏统计 */}
        <div className="gaming-stats panel-card">
          <h3>游戏数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🎮</span>
              <span className="stat-value">126</span>
              <span className="stat-label">游戏总数</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">85%</span>
              <span className="stat-label">平均完成度</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <span className="stat-value">1,280</span>
              <span className="stat-label">成就总数</span>
            </div>
          </div>
        </div>

        {/* 最近游玩 */}
        <div className="recent-games panel-card">
          <div className="section-header">
            <h3>最近游玩</h3>
            <button className="add-game-btn">+添加游戏</button>
          </div>
          <div className="games-grid">
            {[
              { name: '塞尔达传说', platform: 'Switch', hours: 86, progress: 75 },
              { name: '艾尔登法环', platform: 'PS5', hours: 120, progress: 90 },
              { name: '博德之门3', platform: 'PC', hours: 65, progress: 60 }
            ].map((game, index) => (
              <div key={index} className="game-card">
                <div className="game-cover"></div>
                <div className="game-info">
                  <h4>{game.name}</h4>
                  <div className="game-meta">
                    <span className="platform">{game.platform}</span>
                    <span className="hours">{game.hours}小时</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${game.progress}%` }}></div>
                  </div>
                  <span className="progress-text">完成度 {game.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 游戏收藏 */}
        <div className="game-collections panel-card">
          <div className="section-header">
            <h3>游戏收藏</h3>
            <div className="platform-filters">
              <button className="filter-btn active">全部</button>
              <button className="filter-btn">PC</button>
              <button className="filter-btn">PS5</button>
              <button className="filter-btn">Switch</button>
            </div>
          </div>
          <div className="collections-grid">
            {[
              { title: 'RPG游戏', count: 28, icon: '⚔️' },
              { title: '动作游戏', count: 15, icon: '🏃' },
              { title: '策略游戏', count: 12, icon: '🎯' },
              { title: '独立游戏', count: 32, icon: '🎨' }
            ].map((collection, index) => (
              <div key={index} className="collection-card">
                <div className="collection-icon">{collection.icon}</div>
                <div className="collection-info">
                  <h4>{collection.title}</h4>
                  <span className="game-count">{collection.count}款游戏</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gaming; 