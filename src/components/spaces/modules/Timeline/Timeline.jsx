const Timeline = () => {
  return (
    <div className="timeline-container">
      {/* 简洁的头部 */}
      <div className="module-header">
        <h2>时光轴</h2>
        <button className="primary-btn">
          <i className="fas fa-plus"></i>
          记录此刻
        </button>
      </div>

      {/* 时间线 */}
      <div className="timeline">
        {events.map(event => (
          <div key={event.id} className="timeline-item">
            <div className="time-marker">
              <div className="date">
                <span className="month">{event.month}</span>
                <span className="day">{event.day}</span>
              </div>
              <div className="line"></div>
            </div>
            <div className="event-card">
              <div className="event-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                {event.images && (
                  <div className="image-gallery">
                    {event.images.map((img, index) => (
                      <div key={index} className="gallery-item">
                        <img src={img} alt="" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="event-meta">
                  {event.location && (
                    <span className="location">
                      <i className="fas fa-map-marker-alt"></i>
                      {event.location}
                    </span>
                  )}
                  {event.mood && (
                    <span className="mood">
                      {event.mood}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 