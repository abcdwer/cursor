import React from 'react';
import './Sports.css';

const Sports = () => {
  return (
    <div className="category-content">
      <div className="sports-section">
        <div className="sports-activities panel-card">
          <h3>运动项目</h3>
          <div className="activities-grid">
            {[
              { name: '篮球', duration: '120分钟/周', level: '中级' },
              { name: '游泳', duration: '90分钟/周', level: '进阶' },
              { name: '网球', duration: '60分钟/周', level: '入门' }
            ].map((activity, index) => (
              <div key={index} className="activity-card">
                <h4>{activity.name}</h4>
                <div className="activity-info">
                  <span>{activity.duration}</span>
                  <span className="level-badge">{activity.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sports-stats panel-card">
          <h3>运动数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🏃‍♂️</span>
              <span className="stat-value">25.6</span>
              <span className="stat-label">本周运动时长(小时)</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">2800</span>
              <span className="stat-label">消耗卡路里(千卡)</span>
            </div>
          </div>
        </div>

        <div className="sports-goals panel-card">
          <h3>目标追踪</h3>
          <div className="goals-list">
            {[
              { name: '每周运动3次', progress: 75 },
              { name: '提高游泳速度', progress: 60 },
              { name: '增强核心力量', progress: 40 }
            ].map((goal, index) => (
              <div key={index} className="goal-item">
                <div className="goal-info">
                  <h4>{goal.name}</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="progress-text">{goal.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sports; 