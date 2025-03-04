import React from 'react';
import './Photography.css';

const Photography = () => {
  return (
    <div className="category-content">
      <div className="photography-section">
        {/* 顶部统计 */}
        <div className="photo-stats panel-card">
          <h3>摄影数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">📸</span>
              <span className="stat-value">2,436</span>
              <span className="stat-label">总拍摄数</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">168</span>
              <span className="stat-label">精选照片</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <span className="stat-value">12</span>
              <span className="stat-label">获奖作品</span>
            </div>
          </div>
        </div>

        {/* 作品展示 */}
        <div className="photo-showcase panel-card">
          <div className="section-header">
            <h3>作品展示</h3>
            <div className="showcase-filters">
              <button className="filter-btn active">全部</button>
              <button className="filter-btn">风光</button>
              <button className="filter-btn">人像</button>
              <button className="filter-btn">街拍</button>
              <button className="filter-btn">纪实</button>
            </div>
          </div>
          <div className="photo-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="photo-item">
                <img src={`/placeholder-photo-${item}.jpg`} alt={`作品 ${item}`} />
                <div className="photo-info">
                  <div className="photo-header">
                    <h4>冬日暮色</h4>
                    <span className="photo-date">2024-02-{item}</span>
                  </div>
                  <div className="photo-meta">
                    <div className="camera-info">
                      <span>📷 Canon EOS R5</span>
                      <span>🎞️ RF 24-70mm f/2.8L</span>
                    </div>
                    <div className="shot-params">
                      <span>f/2.8</span>
                      <span>1/200s</span>
                      <span>ISO 100</span>
                    </div>
                  </div>
                  <div className="photo-tags">
                    <span className="tag">风光</span>
                    <span className="tag">日落</span>
                    <span className="tag">冬季</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 器材列表 */}
        <div className="equipment-showcase panel-card">
          <div className="section-header">
            <h3>我的器材</h3>
            <button className="add-equipment-btn">+添加器材</button>
          </div>
          <div className="equipment-categories">
            <div className="category-section">
              <h4>相机机身</h4>
              <div className="equipment-list">
                {[
                  { name: 'Canon EOS R5', desc: '主力机身', status: '在用', icon: '📷' },
                  { name: 'Sony A7M4', desc: '备用机身', status: '在用', icon: '📷' }
                ].map((item, index) => (
                  <div key={index} className="equipment-item">
                    <span className="equipment-icon">{item.icon}</span>
                    <div className="equipment-info">
                      <h5>{item.name}</h5>
                      <p>{item.desc}</p>
                      <span className="status-badge">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="category-section">
              <h4>镜头</h4>
              <div className="equipment-list">
                {[
                  { name: 'RF 24-70mm f/2.8L', desc: '标准变焦', status: '常用', icon: '🔭' },
                  { name: 'RF 70-200mm f/2.8L', desc: '远摄变焦', status: '常用', icon: '🔭' },
                  { name: 'RF 50mm f/1.2L', desc: '定焦标准', status: '备用', icon: '🔭' }
                ].map((item, index) => (
                  <div key={index} className="equipment-item">
                    <span className="equipment-icon">{item.icon}</span>
                    <div className="equipment-info">
                      <h5>{item.name}</h5>
                      <p>{item.desc}</p>
                      <span className="status-badge">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 摄影技巧 */}
        <div className="photo-skills panel-card">
          <div className="section-header">
            <h3>摄影技巧</h3>
            <button className="view-all-btn">查看全部</button>
          </div>
          <div className="skills-grid">
            {[
              { title: '光圈优先', desc: '控制景深和虚化效果', level: '进阶', icon: '🎯' },
              { title: '快门优先', desc: '捕捉动态与静态', level: '基础', icon: '⚡' },
              { title: '构图技巧', desc: '三分法则与黄金分割', level: '入门', icon: '📐' },
              { title: '后期处理', desc: 'RAW格式处理技巧', level: '高级', icon: '🎨' }
            ].map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-level">{skill.level}</span>
                </div>
                <h4>{skill.title}</h4>
                <p>{skill.desc}</p>
                <button className="learn-more-btn">了解更多</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photography; 