import React from 'react';
import './Travel.css';

const Travel = () => {
  return (
    <div className="category-content">
      <div className="travel-section">
        {/* 旅行统计 */}
        <div className="travel-stats panel-card">
          <h3>旅行足迹</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🗺️</span>
              <span className="stat-value">12</span>
              <span className="stat-label">去过的国家</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🌆</span>
              <span className="stat-value">36</span>
              <span className="stat-label">探索的城市</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📸</span>
              <span className="stat-value">2,459</span>
              <span className="stat-label">旅行照片</span>
            </div>
          </div>
        </div>

        {/* 最近旅行 */}
        <div className="recent-travels panel-card">
          <div className="section-header">
            <h3>最近旅行</h3>
            <button className="add-travel-btn">+记录旅行</button>
          </div>
          <div className="travels-grid">
            {[
              { title: '东京之旅', date: '2024-03', days: 7, photos: 328 },
              { title: '巴厘岛度假', date: '2024-02', days: 5, photos: 246 },
              { title: '青海环线', date: '2024-01', days: 10, photos: 512 }
            ].map((trip, index) => (
              <div key={index} className="trip-card">
                <div className="trip-cover"></div>
                <div className="trip-info">
                  <h4>{trip.title}</h4>
                  <div className="trip-meta">
                    <span>📅 {trip.date}</span>
                    <span>⏱️ {trip.days}天</span>
                    <span>📸 {trip.photos}张</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 旅行地图 */}
        <div className="travel-map panel-card">
          <div className="section-header">
            <h3>旅行地图</h3>
            <div className="map-filters">
              <button className="filter-btn active">全部</button>
              <button className="filter-btn">国内</button>
              <button className="filter-btn">国外</button>
            </div>
          </div>
          <div className="map-container">
            <div className="map-placeholder">
              <span>旅行足迹地图</span>
              <p>记录你去过的每一个地方</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Travel; 