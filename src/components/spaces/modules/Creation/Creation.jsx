const Creation = () => {
  return (
    <div className="creation-container">
      {/* 简洁的头部 */}
      <div className="module-header">
        <h2>我的创作</h2>
        <button className="primary-btn">
          <i className="fas fa-plus"></i>
          写点什么
        </button>
      </div>

      {/* 简约的过滤器 */}
      <div className="filter-bar">
        <div className="filter-chips">
          <button className="chip active">全部</button>
          <button className="chip">文字</button>
          <button className="chip">图片</button>
          <button className="chip">音乐</button>
          <button className="chip">视频</button>
        </div>
        <div className="view-toggle">
          <button className="icon-btn active">
            <i className="fas fa-th-large"></i>
          </button>
          <button className="icon-btn">
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      {/* 创作卡片网格 */}
      <div className="creation-grid">
        {creations.map(creation => (
          <div key={creation.id} className="creation-card">
            <div className="card-media">
              {creation.type === 'text' ? (
                <div className="text-preview">
                  <p>{creation.content}</p>
                </div>
              ) : (
                <img src={creation.cover} alt="" />
              )}
              <div className="card-overlay">
                <span className="type-badge">{creation.type}</span>
              </div>
            </div>
            <div className="card-content">
              <h3>{creation.title}</h3>
              <div className="card-meta">
                <time>{creation.date}</time>
                <div className="meta-stats">
                  <span>{creation.likes} 喜欢</span>
                  <span>{creation.comments} 评论</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 