import React, { useState } from 'react';
import './FriendsSpace.css';

const FriendsSpace = () => {
  const [activeTab, setActiveTab] = useState('relationships');

  return (
    <div className="friends-space">
      <div className="rain-container">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className={`raindrop ${['small', 'medium', 'large'][i % 3]}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.8 + Math.random() * 0.4}s`
            }}
          />
        ))}
      </div>
      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'relationships' ? 'active' : ''}`}
          onClick={() => setActiveTab('relationships')}
        >
          <i className="fas fa-heart"></i>
          关系圈
        </button>
        <button 
          className={`tab-button ${activeTab === 'moments' ? 'active' : ''}`}
          onClick={() => setActiveTab('moments')}
        >
          <i className="fas fa-camera"></i>
          心动态
        </button>
        <button 
          className={`tab-button ${activeTab === 'portrait' ? 'active' : ''}`}
          onClick={() => setActiveTab('portrait')}
        >
          <i className="fas fa-user-circle"></i>
          心画像
        </button>
        <button 
          className={`tab-button ${activeTab === 'roleplay' ? 'active' : ''}`}
          onClick={() => setActiveTab('roleplay')}
        >
          <i className="fas fa-theater-masks"></i>
          心扮演
        </button>
        <button 
          className={`tab-button ${activeTab === 'destiny' ? 'active' : ''}`}
          onClick={() => setActiveTab('destiny')}
        >
          <i className="fas fa-magic"></i>
          心缘分
        </button>
      </div>
      <div className="friends-content">
        {activeTab === 'relationships' && (
          <div className="relationships-panel">
            <div className="circle-map panel-card">
              <h3>关系网络图</h3>
              {/* 关系网络图内容 */}
            </div>
            <div className="relationship-categories panel-card">
              <h3>关系分类</h3>
              {/* 关系分类内容 */}
            </div>
            <div className="interaction-history panel-card">
              <h3>互动记录</h3>
              {/* 互动记录内容 */}
            </div>
          </div>
        )}

        {activeTab === 'moments' && (
          <div className="moments-panel">
            <div className="moments-create panel-card">
              <h3>发布动态</h3>
              {/* 发布动态内容 */}
            </div>
            <div className="moments-feed panel-card">
              <h3>动态流</h3>
              {/* 动态流内容 */}
            </div>
          </div>
        )}

        {activeTab === 'portrait' && (
          <div className="portrait-panel">
            <div className="personality-tags panel-card">
              <h3>性格画像</h3>
              <div className="tag-cloud">
                <span className="tag active">开朗</span>
                <span className="tag">善良</span>
                <span className="tag active">创意</span>
                <span className="tag">细心</span>
                <span className="tag active">幽默</span>
                <span className="tag">理性</span>
                <span className="tag active">浪漫</span>
                <span className="tag">冒险</span>
              </div>
              <div className="mood-tracker">
                <h4>心情轨迹</h4>
                {/* 心情曲线图表 */}
              </div>
            </div>
            <div className="interest-map panel-card">
              <h3>兴趣地图</h3>
              <div className="interest-categories">
                <div className="interest-category">
                  <h4>艺术创作</h4>
                  <div className="interest-items">
                    <span>绘画</span>
                    <span>音乐</span>
                    <span>摄影</span>
                  </div>
                </div>
                <div className="interest-category">
                  <h4>运动健身</h4>
                  <div className="interest-items">
                    <span>瑜伽</span>
                    <span>游泳</span>
                    <span>徒步</span>
                  </div>
                </div>
                {/* 更多兴趣分类 */}
              </div>
            </div>
            <div className="growth-timeline panel-card">
              <h3>成长轨迹</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="time">2024-03</div>
                  <div className="event">获得"摄影达人"徽章</div>
                </div>
                <div className="timeline-item">
                  <div className="time">2024-02</div>
                  <div className="event">完成第一次远程旅行</div>
                </div>
                {/* 更多时间线项目 */}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roleplay' && (
          <div className="roleplay-panel">
            <div className="current-roles panel-card">
              <h3>当前角色</h3>
              <div className="active-role">
                <div className="role-avatar">
                  <img src="/path/to/avatar.jpg" alt="角色头像" />
                  <span className="role-status active"></span>
                </div>
                <div className="role-info">
                  <h4>星际探险家</h4>
                  <p>等级: 15</p>
                  <div className="role-skills">
                    <span>探索</span>
                    <span>科技</span>
                    <span>交际</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="role-gallery panel-card">
              <h3>角色库</h3>
              <div className="roles-grid">
                {['魔法师', '侦探', '厨师', '艺术家', '旅行家', '作家'].map(role => (
                  <div key={role} className="role-card">
                    <div className="role-icon"></div>
                    <h4>{role}</h4>
                    <button className="switch-role-btn">切换</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="interaction-scenarios panel-card">
              <h3>互动场景</h3>
              <div className="scenario-list">
                <div className="scenario-item">
                  <h4>星际酒吧</h4>
                  <p>与其他探险家分享故事</p>
                  <span className="online-count">12人在线</span>
                </div>
                <div className="scenario-item">
                  <h4>探索基地</h4>
                  <p>组队进行任务</p>
                  <span className="online-count">8人在线</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'destiny' && (
          <div className="destiny-panel">
            <div className="destiny-match panel-card">
              <h3>缘分匹配</h3>
              <div className="match-cards">
                <div className="match-card">
                  <div className="match-avatar">
                    <img src="/path/to/match.jpg" alt="匹配用户头像" />
                    <span className="match-percentage">98%</span>
                  </div>
                  <div className="match-info">
                    <h4>Sarah</h4>
                    <p>兴趣相似度: 98%</p>
                    <div className="match-tags">
                      <span>摄影</span>
                      <span>旅行</span>
                      <span>美食</span>
                    </div>
                  </div>
                  <button className="connect-btn">打招呼</button>
                </div>
                {/* 更多匹配卡片 */}
              </div>
            </div>
            <div className="shared-interests panel-card">
              <h3>共同兴趣</h3>
              <div className="interest-bubbles">
                <div className="interest-bubble large">摄影</div>
                <div className="interest-bubble medium">旅行</div>
                <div className="interest-bubble small">美食</div>
                {/* 更多兴趣气泡 */}
              </div>
            </div>
            <div className="destiny-activities panel-card">
              <h3>缘分活动</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon photo-walk">
                    <i className="fas fa-camera"></i>
                  </div>
                  <div className="activity-info">
                    <h4>摄影漫步</h4>
                    <p>周末相约拍照，记录城市之美</p>
                    <div className="activity-meta">
                      <span className="participant-count">
                        <i className="fas fa-user"></i> 5/10人
                      </span>
                      <span className="activity-time">
                        <i className="fas fa-clock"></i> 本周六 14:00
                      </span>
                      <span className="activity-location">
                        <i className="fas fa-map-marker-alt"></i> 市中心公园
                      </span>
                    </div>
                  </div>
                  <button className="join-btn">参加</button>
                </div>

                <div className="activity-item">
                  <div className="activity-icon music-party">
                    <i className="fas fa-music"></i>
                  </div>
                  <div className="activity-info">
                    <h4>音乐沙龙</h4>
                    <p>分享你喜爱的音乐，结识知音</p>
                    <div className="activity-meta">
                      <span className="participant-count">
                        <i className="fas fa-user"></i> 8/15人
                      </span>
                      <span className="activity-time">
                        <i className="fas fa-clock"></i> 本周日 19:00
                      </span>
                      <span className="activity-location">
                        <i className="fas fa-map-marker-alt"></i> 咖啡馆
                      </span>
                    </div>
                  </div>
                  <button className="join-btn">参加</button>
                </div>

                <div className="activity-item">
                  <div className="activity-icon book-club">
                    <i className="fas fa-book-reader"></i>
                  </div>
                  <div className="activity-info">
                    <h4>读书会</h4>
                    <p>共读一本好书，畅谈人生感悟</p>
                    <div className="activity-meta">
                      <span className="participant-count">
                        <i className="fas fa-user"></i> 6/12人
                      </span>
                      <span className="activity-time">
                        <i className="fas fa-clock"></i> 下周二 20:00
                      </span>
                      <span className="activity-location">
                        <i className="fas fa-map-marker-alt"></i> 图书馆
                      </span>
                    </div>
                  </div>
                  <button className="join-btn">参加</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsSpace;
