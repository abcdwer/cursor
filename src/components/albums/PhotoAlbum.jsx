import React from 'react';
import PropTypes from 'prop-types';

const PhotoAlbum = React.memo(({ 
  photos = [], 
  totalCount = 0, 
  loading = false, 
  error = null, 
  onRetry 
}) => {
  if (loading) {
    return (
      <div className="photo-album-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>正在加载照片...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="photo-album-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={onRetry}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-album-container">
      <div className="photos-header">
        <h2>我的相册</h2>
        <span className="photo-count">共 {totalCount} 张照片</span>
      </div>
      
      <div className="photos-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <div className="photo-wrapper">
              <img 
                src={photo.thumbnail} 
                alt={photo.title} 
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="photo-info">
              <h4>{photo.title}</h4>
              <span>{photo.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PhotoAlbum.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  })),
  totalCount: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

PhotoAlbum.defaultProps = {
  photos: [],
  totalCount: 0,
  loading: false,
  error: null
};

export default PhotoAlbum; 