import React from 'react';
import './Food.css';

const Food = () => {
  return (
    <div className="category-content">
      <div className="food-section">
        {/* 顶部统计卡片 */}
        <div className="food-stats panel-card">
          <h3>美食足迹</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🍽️</span>
              <span className="stat-value">126</span>
              <span className="stat-label">探店总数</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🌟</span>
              <span className="stat-value">23</span>
              <span className="stat-label">收藏店铺</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📸</span>
              <span className="stat-value">521</span>
              <span className="stat-label">美食照片</span>
            </div>
          </div>
        </div>

        {/* 最近探店 */}
        <div className="recent-visits panel-card">
          <div className="section-header">
            <h3>最近探店</h3>
            <button className="view-all-btn">查看全部</button>
          </div>
          <div className="visits-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="visit-card">
                <div className="visit-images">
                  <img src={`/placeholder-food-${item}.jpg`} alt={`美食 ${item}`} className="main-image" />
                  <div className="sub-images">
                    <img src={`/placeholder-food-${item+1}.jpg`} alt="菜品" />
                    <img src={`/placeholder-food-${item+2}.jpg`} alt="菜品" />
                    <div className="more-images">+6</div>
                  </div>
                </div>
                <div className="visit-info">
                  <div className="visit-header">
                    <h4>米其林三星餐厅 {item}</h4>
                    <span className="price-tag">¥1288/人</span>
                  </div>
                  <div className="visit-meta">
                    <span className="location">🏠 东京·银座</span>
                    <span className="date">📅 2024-03-1{item}</span>
                  </div>
                  <div className="visit-rating">
                    <div className="stars">{'⭐'.repeat(5)}</div>
                    <span className="rating-text">4.9</span>
                  </div>
                  <p className="visit-comment">
                    "环境优雅，服务周到，主厨特制的和牛寿司令人难忘..."
                  </p>
                  <div className="visit-tags">
                    <span className="tag">日料</span>
                    <span className="tag">米其林</span>
                    <span className="tag">约会首选</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 美食地图 */}
        <div className="food-map panel-card">
          <div className="section-header">
            <h3>美食地图</h3>
            <div className="map-filters">
              <button className="filter-btn active">全部</button>
              <button className="filter-btn">日料</button>
              <button className="filter-btn">火锅</button>
              <button className="filter-btn">西餐</button>
              <button className="filter-btn">咖啡</button>
            </div>
          </div>
          <div className="map-container">
            <div className="map-placeholder">
              <span>探店地图</span>
              <p>已记录 126 家店铺</p>
            </div>
          </div>
        </div>

        {/* 美食收藏 */}
        <div className="food-collections panel-card">
          <div className="section-header">
            <h3>精选收藏</h3>
            <button className="add-collection-btn">+创建收藏夹</button>
          </div>
          <div className="collections-grid">
            {[
              { title: '深夜食堂', count: 18, icon: '🌙', desc: '深夜觅食好去处' },
              { title: '下午茶', count: 12, icon: '☕', desc: '闺蜜聚会首选' },
              { title: '商务请客', count: 8, icon: '🤝', desc: '正式场合推荐' },
              { title: '约会圣地', count: 15, icon: '💑', desc: '浪漫约会餐厅' },
              { title: '米其林探店', count: 6, icon: '⭐', desc: '米其林星级餐厅' },
              { title: '火锅收藏', count: 9, icon: '🍲', desc: '精选火锅店铺' }
            ].map((collection, index) => (
              <div key={index} className="collection-card">
                <div className="collection-icon">{collection.icon}</div>
                <div className="collection-info">
                  <h4>{collection.title}</h4>
                  <p>{collection.desc}</p>
                  <span className="collection-count">{collection.count}家店铺</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Food; 