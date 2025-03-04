const Memory = () => {
  return (
    <div className="memory-container">
      {/* 简洁的头部 */}
      <div className="module-header">
        <h2>回忆墙</h2>
        <button className="primary-btn">
          <i className="fas fa-plus"></i>
          添加回忆
        </button>
      </div>

      {/* 瀑布流布局 */}
      <div className="memory-masonry">
        {memories.map(memory => (
          <div key={memory.id} className="memory-item">
            <div className="memory-card">
              <div className="card-media">
                <img src={memory.cover} alt="" />
                <div className="media-overlay">
                  <div className="overlay-content">
                    <h3>{memory.title}</h3>
                    <p>{memory.description}</p>
                  </div>
                </div>
              </div>
              <div className="card-info">
                <div className="info-header">
                  <time>{memory.date}</time>
                  <div className="actions">
                    <button className="icon-btn">
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="icon-btn">
                      <i className="far fa-bookmark"></i>
                    </button>
                  </div>
                </div>
                {memory.tags && (
                  <div className="tags">
                    {memory.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 