import React, { useState, useRef } from 'react';
import './OutingSpace.css';

const OutingSpace = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTags, setSelectedTags] = useState(['户外运动']);
  const [selectedTime, setSelectedTime] = useState('周末');
  const [preferences, setPreferences] = useState({
    nearby: false,
    smallGroup: false,
    newPeople: false,
    free: false
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const sliderRef = useRef(null);
  const [isMatching, setIsMatching] = useState(false);

  // 扩展示例数据，添加更多活动
  const activities = [
    {
      id: 1,
      title: '周末爬山',
      type: '户外运动',
      date: '2024-03-23',
      time: '09:00',
      location: '莫干山',
      participants: 8,
      maxParticipants: 12,
      matchRate: 98,
      creator: {
        name: '张三',
        avatar: 'https://picsum.photos/50/50?random=1'
      },
      tags: ['运动', '交友', '户外'],
      imageUrl: 'https://picsum.photos/400/200?random=1',
      description: '周末一起去莫干山爬山，欢迎喜欢户外运动的朋友参加！'
    },
    {
      id: 2,
      title: '城市徒步探索',
      type: '户外运动',
      date: '2024-03-24',
      time: '14:00',
      location: '西湖周边',
      participants: 5,
      maxParticipants: 10,
      matchRate: 92,
      creator: {
        name: '李四',
        avatar: 'https://picsum.photos/50/50?random=2'
      },
      tags: ['徒步', '摄影', '城市'],
      imageUrl: 'https://picsum.photos/400/200?random=2',
      description: '探索城市隐藏的美景，带上相机记录美好瞬间。'
    },
    {
      id: 3,
      title: '咖啡品鉴会',
      type: '美食',
      date: '2024-03-25',
      time: '15:30',
      location: '星巴克臻选店',
      participants: 6,
      maxParticipants: 8,
      matchRate: 85,
      creator: {
        name: '王五',
        avatar: 'https://picsum.photos/50/50?random=3'
      },
      tags: ['咖啡', '社交', '品鉴'],
      imageUrl: 'https://picsum.photos/400/200?random=3',
      description: '一起品尝不同产地的咖啡豆，了解咖啡文化。'
    },
    {
      id: 4,
      title: '电影之夜',
      type: '观影',
      date: '2024-03-26',
      time: '19:00',
      location: '万达影城',
      participants: 4,
      maxParticipants: 6,
      matchRate: 90,
      creator: {
        name: '赵六',
        avatar: 'https://picsum.photos/50/50?random=4'
      },
      tags: ['电影', '娱乐', '社交'],
      imageUrl: 'https://picsum.photos/400/200?random=4',
      description: '一起观看最新上映的电影，影后可以一起讨论剧情。'
    },
    {
      id: 5,
      title: '桌游聚会',
      type: '游戏',
      date: '2024-03-27',
      time: '18:30',
      location: '桌游吧',
      participants: 7,
      maxParticipants: 10,
      matchRate: 95,
      creator: {
        name: '孙七',
        avatar: 'https://picsum.photos/50/50?random=5'
      },
      tags: ['桌游', '娱乐', '团队'],
      imageUrl: 'https://picsum.photos/400/200?random=5',
      description: '体验各种有趣的桌游，认识新朋友。'
    },
    {
      id: 6,
      title: '瑜伽课程',
      type: '运动',
      date: '2024-03-28',
      time: '10:00',
      location: '瑜伽馆',
      participants: 3,
      maxParticipants: 8,
      matchRate: 88,
      creator: {
        name: '周八',
        avatar: 'https://picsum.photos/50/50?random=6'
      },
      tags: ['瑜伽', '健康', '放松'],
      imageUrl: 'https://picsum.photos/400/200?random=6',
      description: '一起练习瑜伽，放松身心，提高身体柔韧性。'
    }
  ];

  // 滑动推荐卡片
  const handleSlide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 处理开始匹配
  const handleStartMatch = () => {
    setIsMatching(true);
    // 模拟匹配过程
    setTimeout(() => {
      setIsMatching(false);
    }, 2000);
  };

  // 处理标签选择
  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 处理时间选择
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // 处理偏好设置
  const handlePreferenceChange = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  // 渲染活动卡片
  const renderActivityCard = (activity) => (
    <div key={activity.id} className="activity-card">
      <div className="card-image">
        <img src={activity.imageUrl} alt={activity.title} />
        <div className="card-badges">
          <span className="type-badge">{activity.type}</span>
          {activity.matchRate && (
            <span className="match-badge">{activity.matchRate}% 匹配</span>
          )}
        </div>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="activity-title">{activity.title}</h3>
          <div className="creator-info">
            <img src={activity.creator.avatar} alt={activity.creator.name} />
            <span>{activity.creator.name}</span>
          </div>
        </div>
        <p className="activity-desc">{activity.description}</p>
        <div className="activity-info">
          <span><i className="far fa-calendar"></i>{activity.date} {activity.time}</span>
          <span><i className="fas fa-map-marker-alt"></i>{activity.location}</span>
          <span><i className="fas fa-users"></i>{activity.participants}/{activity.maxParticipants}人</span>
        </div>
        <div className="activity-tags">
          {activity.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="card-actions">
          <button className="join-btn">参加活动</button>
          <button className="save-btn"><i className="far fa-bookmark"></i></button>
        </div>
      </div>
    </div>
  );

  // 渲染推荐活动界面
  const renderRecommendedSection = () => (
    <div className="recommended-section">
      <div className="module-title">
        <div className="module-title-content">
          <div className="module-title-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="module-title-text">
            <h3>推荐活动</h3>
            <p>为你精选的活动推荐</p>
          </div>
        </div>
        <div className="module-title-actions">
          <button className="module-more-btn">
            查看更多 <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="slider-container">
        <button className="slider-arrow left" onClick={() => handleSlide('left')}>
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="recommended-slider" ref={sliderRef}>
          {activities.map(activity => (
            <div key={activity.id} className="recommended-card">
              <div className="card-image">
                <img src={activity.imageUrl} alt={activity.title} />
                <div className="match-overlay">
                  <div className="match-circle">
                    <span className="match-percent">{activity.matchRate}%</span>
                    <span className="match-text">匹配度</span>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <h3 className="activity-title">{activity.title}</h3>
                <div className="activity-meta">
                  <span><i className="far fa-calendar"></i>{activity.date}</span>
                  <span><i className="fas fa-map-marker-alt"></i>{activity.location}</span>
                </div>
                <p className="activity-desc">{activity.description}</p>
                <div className="recommendation-reason">
                  <i className="fas fa-thumbs-up"></i>
                  <span>推荐理由: 与你参加过的户外活动相似</span>
                </div>
                <button className="join-btn">参加活动</button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="slider-arrow right" onClick={() => handleSlide('right')}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="category-recommendations">
        <div className="category-header">
          <h3>户外运动</h3>
          <a href="#" className="view-more">查看更多 <i className="fas fa-angle-right"></i></a>
        </div>
        <div className="category-cards">
          {activities.filter(a => a.type === '户外运动').slice(0, 3).map(renderActivityCard)}
        </div>
      </div>
      
      <div className="category-recommendations">
        <div className="category-header">
          <h3>美食聚会</h3>
          <a href="#" className="view-more">查看更多 <i className="fas fa-angle-right"></i></a>
        </div>
        <div className="category-cards">
          {activities.filter(a => a.type === '美食').slice(0, 3).map(renderActivityCard)}
        </div>
      </div>
    </div>
  );

  // 渲染匹配活动界面
  const renderMatchSection = () => (
    <div className="match-section">
      <div className="module-title">
        <div className="module-title-content">
          <div className="module-title-icon">
            <i className="fas fa-magic"></i>
          </div>
          <div className="module-title-text">
            <h3>匹配活动</h3>
            <p>根据兴趣智能匹配</p>
          </div>
        </div>
        <div className="module-title-actions">
          <button className="module-more-btn">
            查看更多 <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      {!isMatching ? (
        <>
          <div className="match-form">
            <div className="match-option-group">
              <h3 className="match-option-title">
                <i className="fas fa-heart"></i>
                选择你感兴趣的活动类型
              </h3>
              <div className="interest-tags">
                {[
                  { icon: 'hiking', text: '户外运动' },
                  { icon: 'utensils', text: '美食' },
                  { icon: 'film', text: '观影' },
                  { icon: 'gamepad', text: '游戏' },
                  { icon: 'plane', text: '旅行' },
                  { icon: 'music', text: '音乐' },
                  { icon: 'palette', text: '艺术' },
                  { icon: 'book', text: '学习' },
                  { icon: 'coffee', text: '社交' },
                  { icon: 'camera', text: '摄影' },
                  { icon: 'basketball-ball', text: '运动' },
                  { icon: 'theater-masks', text: '文化' }
                ].map(item => (
                  <button
                    key={item.text}
                    className={`tag-btn ${selectedTags.includes(item.text) ? 'active' : ''}`}
                    onClick={() => handleTagSelect(item.text)}
                  >
                    <i className={`fas fa-${item.icon}`}></i>
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="match-option-group">
              <h3 className="match-option-title">
                <i className="fas fa-clock"></i>
                你期望的活动时间
              </h3>
              <div className="time-preference">
                {[
                  {
                    id: 'weekend',
                    title: '周末活动',
                    icon: 'sun',
                    desc: '周六日全天时间，适合安排较长时间的活动'
                  },
                  {
                    id: 'evening',
                    title: '工作日晚上',
                    icon: 'moon',
                    desc: '下班后的休闲时光，适合轻松的短期活动'
                  },
                  {
                    id: 'holiday',
                    title: '节假日',
                    icon: 'calendar',
                    desc: '长假期间，适合安排出游或长期活动'
                  },
                  {
                    id: 'anytime',
                    title: '随时可约',
                    icon: 'clock',
                    desc: '时间灵活，根据具体活动调整'
                  }
                ].map(time => (
                  <div
                    key={time.id}
                    className={`time-option ${selectedTime === time.id ? 'active' : ''}`}
                    onClick={() => handleTimeSelect(time.id)}
                  >
                    <div className="time-option-title">
                      <i className={`fas fa-${time.icon}`}></i>
                      {time.title}
                    </div>
                    <p className="time-option-desc">{time.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="match-option-group">
              <h3 className="match-option-title">
                <i className="fas fa-sliders-h"></i>
                高级筛选
              </h3>
              <div className="advanced-filters">
                <div className="filter-item">
                  <div className="filter-item-header">
                    <span className="filter-item-title">活动地点范围</span>
                    <span className="filter-value">5km</span>
                  </div>
                  <div className="range-slider">
                    <input type="range" min="1" max="20" defaultValue="5" />
                  </div>
                </div>
                <div className="filter-item">
                  <div className="filter-item-header">
                    <span className="filter-item-title">活动人数</span>
                    <span className="filter-value">5-15人</span>
                  </div>
                  <div className="range-slider">
                    <input type="range" min="2" max="30" defaultValue="10" />
                  </div>
                </div>
                <div className="filter-item">
                  <div className="filter-item-header">
                    <span className="filter-item-title">活动预算</span>
                    <span className="filter-value">¥100-300</span>
                  </div>
                  <div className="range-slider">
                    <input type="range" min="0" max="1000" defaultValue="200" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="match-actions">
            <div className="match-actions-content">
              <button className="match-btn" onClick={handleStartMatch}>
                <i className="fas fa-magic"></i>
                开始匹配
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="match-loading">
          <div className="loading-spinner"></div>
          <p>正在为你寻找最合适的活动...</p>
        </div>
      )}
    </div>
  );

  // 渲染发起活动界面
  const renderCreateSection = () => (
    <div className="create-section">
      <div className="module-title">
        <div className="module-title-content">
          <div className="module-title-icon">
            <i className="fas fa-plus"></i>
          </div>
          <div className="module-title-text">
            <h3>发起新活动</h3>
            <p>创建一个新的活动，邀请志同道合的朋友一起参与</p>
          </div>
        </div>
      </div>

      <form className="create-form">
        <div className="form-card">
          <h3 className="form-card-title">
            <i className="fas fa-info-circle"></i>
            基本信息
          </h3>
          <div className="form-group">
            <label>活动标题</label>
            <input type="text" placeholder="给你的活动起个名字" />
          </div>
          <div className="form-group">
            <label>活动描述</label>
            <textarea placeholder="详细描述活动内容..." rows="4"></textarea>
          </div>
        </div>

        <div className="form-card">
          <h3 className="form-card-title">
            <i className="fas fa-calendar-alt"></i>
            时间地点
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label>日期</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>时间</label>
              <input type="time" />
            </div>
          </div>
          <div className="form-group">
            <label>地点</label>
            <input type="text" placeholder="活动地点" />
          </div>
        </div>

        <div className="form-card">
          <h3 className="form-card-title">
            <i className="fas fa-users"></i>
            活动设置
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label>活动类型</label>
              <select>
                <option value="">选择类型</option>
                <option value="outdoor">户外运动</option>
                <option value="food">美食聚餐</option>
                <option value="movie">观影</option>
                <option value="game">桌游</option>
                <option value="travel">旅行</option>
              </select>
            </div>
            <div className="form-group">
              <label>人数限制</label>
              <input type="number" min="2" placeholder="参与人数上限" />
            </div>
          </div>
          <div className="form-group">
            <label>活动标签</label>
            <div className="tags-input">
              <div className="selected-tags">
                <span className="tag">
                  运动
                  <button type="button" className="remove-tag">&times;</button>
                </span>
              </div>
              <input type="text" placeholder="输入标签，回车添加" />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">发布活动</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="outing-space">
      <div className="outing-header">
        <div className="outing-header-content">
          <div className="tab-group">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <i className="fas fa-th-large"></i>
              <div className="tab-content">
                <span className="tab-label">全部活动</span>
                <span className="tab-desc">浏览所有活动</span>
              </div>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'recommended' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommended')}
            >
              <i className="fas fa-star"></i>
              <div className="tab-content">
                <span className="tab-label">推荐活动</span>
                <span className="tab-desc">为你精选</span>
              </div>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'match' ? 'active' : ''}`}
              onClick={() => setActiveTab('match')}
            >
              <i className="fas fa-magic"></i>
              <div className="tab-content">
                <span className="tab-label">匹配活动</span>
                <span className="tab-desc">智能匹配</span>
              </div>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <i className="fas fa-plus"></i>
              <div className="tab-content">
                <span className="tab-label">发起活动</span>
                <span className="tab-desc">创建新活动</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="outing-content">
        {activeTab === 'all' && (
          <>
            <div className="page-header">
              <h2>全部活动</h2>
              <p>探索丰富多彩的活动，找到你感兴趣的</p>
            </div>
            <div className="filter-bar">
              <div className="filter-group">
                <select className="filter-select">
                  <option value="">活动类型</option>
                  <option value="outdoor">户外运动</option>
                  <option value="food">美食</option>
                  <option value="movie">观影</option>
                </select>
                <select className="filter-select">
                  <option value="">时间范围</option>
                  <option value="today">今天</option>
                  <option value="tomorrow">明天</option>
                  <option value="weekend">本周末</option>
                </select>
                <select className="filter-select">
                  <option value="">人数规模</option>
                  <option value="small">小型(≤5人)</option>
                  <option value="medium">中型(6-15人)</option>
                  <option value="large">大型(>15人)</option>
                </select>
              </div>
              <div className="sort-group">
                <select className="sort-select">
                  <option value="latest">最新发布</option>
                  <option value="popular">最受欢迎</option>
                  <option value="nearest">最近开始</option>
                </select>
              </div>
            </div>
            <div className="activities-list">
              {activities.map(activity => renderActivityCard(activity))}
            </div>
          </>
        )}

        {activeTab === 'recommended' && renderRecommendedSection()}
        {activeTab === 'match' && renderMatchSection()}
        {activeTab === 'create' && renderCreateSection()}
      </div>
    </div>
  );
};

export default OutingSpace;
