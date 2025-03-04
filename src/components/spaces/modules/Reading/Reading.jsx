import React from 'react';
import './Reading.css';

const Reading = () => {
  return (
    <div className="category-content">
      <div className="reading-section">
        {/* 阅读统计 */}
        <div className="reading-stats panel-card">
          <h3>阅读数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <span className="stat-value">24</span>
              <span className="stat-label">本月已读页数</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">12.5</span>
              <span className="stat-label">阅读时长(小时)</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📖</span>
              <span className="stat-value">3</span>
              <span className="stat-label">在读书籍</span>
            </div>
          </div>
        </div>

        {/* 当前阅读 */}
        <div className="current-reading panel-card">
          <div className="section-header">
            <h3>当前阅读</h3>
            <button className="add-book-btn">+添加书籍</button>
          </div>
          <div className="reading-progress">
            <div className="book-info">
              <img src="/book-cover-placeholder.jpg" alt="书籍封面" className="book-cover" />
              <div className="book-details">
                <h4>深入理解计算机系统</h4>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '65%' }}></div>
                </div>
                <span className="progress-text">已读65%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 书架 */}
        <div className="reading-list panel-card">
          <div className="section-header">
            <h3>我的书架</h3>
            <div className="shelf-filters">
              <button className="filter-btn active">全部</button>
              <button className="filter-btn">技术</button>
              <button className="filter-btn">文学</button>
              <button className="filter-btn">经管</button>
            </div>
          </div>
          <div className="books-grid">
            {['技术', '文学', '经管', '科普'].map((category, index) => (
              <div key={index} className="book-category">
                <h4>{category}</h4>
                <div className="book-items">
                  {[1, 2, 3].map((book, bookIndex) => (
                    <div key={bookIndex} className="book-item">
                      <div className="book-cover"></div>
                      <div className="book-info">
                        <h5>书名示例{bookIndex + 1}</h5>
                        <span className="book-author">作者名</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reading; 