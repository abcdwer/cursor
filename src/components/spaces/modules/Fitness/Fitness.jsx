import React from 'react';
import './Fitness.css';

const Fitness = () => {
  return (
    <div className="category-content">
      <div className="fitness-section">
        {/* 健身数据统计 */}
        <div className="fitness-stats panel-card">
          <h3>健身数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🏋️‍♂️</span>
              <span className="stat-value">12</span>
              <span className="stat-label">本周训练次数</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">480</span>
              <span className="stat-label">总训练时长(分钟)</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">85%</span>
              <span className="stat-label">目标完成度</span>
            </div>
          </div>
        </div>

        {/* 训练计划 */}
        <div className="workout-plans panel-card">
          <div className="section-header">
            <h3>训练计划</h3>
            <button className="add-plan-btn">+添加计划</button>
          </div>
          <div className="plans-grid">
            {[
              { name: '胸部训练', duration: '45分钟', exercises: ['卧推', '哑铃飞鸟'] },
              { name: '背部训练', duration: '50分钟', exercises: ['引体向上', '划船'] },
              { name: '腿部训练', duration: '60分钟', exercises: ['深蹲', '腿举'] },
              { name: '核心训练', duration: '30分钟', exercises: ['平板支撑', '卷腹'] }
            ].map((plan, index) => (
              <div key={index} className="plan-card">
                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <span className="plan-duration">{plan.duration}</span>
                </div>
                <div className="plan-exercises">
                  {plan.exercises.map((exercise, i) => (
                    <div key={i} className="exercise-item">
                      <span className="exercise-name">{exercise}</span>
                      <span className="exercise-sets">3组x12次</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 进度追踪 */}
        <div className="fitness-progress panel-card">
          <div className="section-header">
            <h3>进度追踪</h3>
            <div className="progress-filters">
              <button className="filter-btn active">周</button>
              <button className="filter-btn">月</button>
              <button className="filter-btn">年</button>
            </div>
          </div>
          <div className="progress-charts">
            <div className="chart-placeholder">
              <span>训练进度图表</span>
              <p>展示训练频率、强度和完成情况</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitness; 