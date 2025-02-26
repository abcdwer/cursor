import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PhotoAlbum.css';
import { embyService } from '../../services/embyService';

const PhotoAlbum = React.memo(({ 
  photos = [], 
  totalCount = 0, 
  loading = false, 
  error = null, 
  onRetry 
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('carousel'); // carousel, gallery, waterfall
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categoryPhotos, setCategoryPhotos] = useState({
    all: photos.slice(0, 10), // 初始化时使用传入的照片
    portrait: [],
    landscape: [],
    life: []
  });
  const [categoryLoading, setCategoryLoading] = useState({
    all: false,
    portrait: true,
    landscape: true,
    life: true
  });

  // 照片分类
  const categories = [
    { id: 'all', name: '全部', icon: '📸' },
    { id: 'portrait', name: '人像', icon: '👤' },
    { id: 'landscape', name: '风景', icon: '🌄' },
    { id: 'life', name: '生活', icon: '🌟' }
  ];

  // 视图模式
  const viewModes = [
    { id: 'carousel', name: '轮播', icon: '🎠' },
    { id: 'masonry', name: '拼贴', icon: '🎨' },
    { id: 'cards', name: '卡片', icon: '🃏' },
    { id: 'polaroid', name: '拍立得', icon: '📸' },
    { id: 'coverflow', name: '封面流', icon: '💫' },
    { id: 'grid3d', name: '3D网格', icon: '🎲' }
  ];

  // 初始化加载各分类照片
  useEffect(() => {
    const loadCategoryPhotos = async () => {
      try {
        // 先加载其他分类的照片
        const categories = ['portrait', 'landscape', 'life'];
        for (const category of categories) {
          setCategoryLoading(prev => ({ ...prev, [category]: true }));
          try {
            const response = await embyService.getPhotos(category);
            if (response.photos.length > 0) {
              setCategoryPhotos(prev => ({
                ...prev,
                [category]: response.photos.slice(0, 10)
              }));
            }
          } catch (error) {
            console.error(`Failed to load ${category} photos:`, error);
          } finally {
            setCategoryLoading(prev => ({ ...prev, [category]: false }));
          }
        }
      } catch (error) {
        console.error('Failed to load category photos:', error);
      }
    };

    loadCategoryPhotos();
  }, []);

  // 更新 all 分类的照片
  useEffect(() => {
    setCategoryPhotos(prev => ({
      ...prev,
      all: photos.slice(0, 10)
    }));
  }, [photos]);

  // 刷新当前分类的照片
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      setCategoryLoading(prev => ({ ...prev, [activeCategory]: true }));
      const response = await embyService.refreshCategoryPhotos(activeCategory);
      if (response.photos.length > 0) {
        setCategoryPhotos(prev => ({
          ...prev,
          [activeCategory]: response.photos.slice(0, 10)
        }));
      }
    } catch (error) {
      console.error('Failed to refresh photos:', error);
    } finally {
      setIsRefreshing(false);
      setCategoryLoading(prev => ({ ...prev, [activeCategory]: false }));
    }
  };

  // 切换分类
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentSlide(0);
  };

  // 获取当前分类的照片
  const getCurrentPhotos = () => categoryPhotos[activeCategory] || [];

  // 检查当前分类是否正在加载
  const isCurrentCategoryLoading = () => categoryLoading[activeCategory];

  // 渲染不同的视图模式
  const renderPhotoView = () => {
    const currentPhotos = getCurrentPhotos();
    
    if (isCurrentCategoryLoading()) {
      return (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>正在加载照片...</span>
        </div>
      );
    }

    switch (viewMode) {
      case 'carousel':
        return (
          <div className="carousel-view">
            <div className="carousel-container">
              {currentPhotos.map((photo, index) => (
                <div 
                  key={photo.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    transform: `translateX(${(index - currentSlide) * 100}%)`
                  }}
                >
                  <img src={photo.original} alt={photo.title} />
                  <div className="slide-info">
                    <h3>{photo.title}</h3>
                    <p>{photo.date}</p>
                  </div>
                </div>
              ))}
              <button 
                className="carousel-btn prev" 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length)}
                aria-label="上一张"
                disabled={currentPhotos.length <= 1}
              >
                <span>‹</span>
              </button>
              <button 
                className="carousel-btn next" 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % currentPhotos.length)}
                aria-label="下一张"
                disabled={currentPhotos.length <= 1}
              >
                <span>›</span>
              </button>
            </div>
            <div className="carousel-dots">
              {currentPhotos.map((_, index) => (
                <span 
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        );

      case 'masonry':
        return (
          <div className="masonry-view">
            <div className="masonry-grid">
              {currentPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className="masonry-item"
                  style={{
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  <div className="masonry-content">
                    <img src={photo.cover} alt={photo.title} />
                    <div className="masonry-info">
                      <div className="info-date">{photo.date}</div>
                      <h3>{photo.title}</h3>
                      <div className="info-overlay">
                        <button className="info-btn">
                          <span>查看详情</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="cards-view">
            <div className="cards-container">
              {currentPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className="card-item"
                  style={{
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  <div className="card-image">
                    <img src={photo.cover} alt={photo.title} />
                    <div className="card-gradient"></div>
                  </div>
                  <div className="card-content">
                    <div className="card-date">{photo.date}</div>
                    <h3 className="card-title">{photo.title}</h3>
                    <div className="card-actions">
                      <button className="action-btn like">
                        <span>❤️</span>
                      </button>
                      <button className="action-btn share">
                        <span>🔗</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'polaroid':
        return (
          <div className="polaroid-view">
            {currentPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                className="polaroid-item"
                style={{
                  '--delay': `${index * 0.1}s`,
                  '--rotate': `${Math.random() * 20 - 10}deg`
                }}
              >
                <div className="polaroid-image">
                  <img src={photo.cover} alt={photo.title} />
                </div>
                <div className="polaroid-caption">
                  <h3>{photo.title}</h3>
                  <span>{photo.date}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'coverflow':
        return (
          <div className="book-view">
            <div className="book-container">
              <div className="book">
                {/* 封面只在第一页显示 */}
                <div className={`book-cover ${currentSlide > 0 ? 'opened' : ''}`}>
                  <h2>我的相册</h2>
                  <p>{currentPhotos.length} 张照片</p>
                </div>

                {/* 内页 - 每次显示两页 */}
                {Array.from({ length: Math.ceil(currentPhotos.length / 2) }).map((_, pageIndex) => {
                  const leftPhotoIndex = pageIndex * 2;
                  const rightPhotoIndex = pageIndex * 2 + 1;
                  const leftPhoto = currentPhotos[leftPhotoIndex];
                  const rightPhoto = currentPhotos[rightPhotoIndex];
                  
                  return (
                    <div 
                      key={pageIndex}
                      className={`book-spread ${pageIndex < currentSlide ? 'turned' : ''}`}
                      style={{
                        '--index': pageIndex,
                        '--total': Math.ceil(currentPhotos.length / 2)
                      }}
                    >
                      {/* 左页 */}
                      <div className="book-page left-page">
                        {leftPhoto && (
                          <>
                            <div className="page-image">
                              <img 
                                src={leftPhoto.cover} 
                                alt={leftPhoto.title}
                              />
                            </div>
                            <div className="page-info">
                              <h3>{leftPhoto.title}</h3>
                              <p>{leftPhoto.date}</p>
                            </div>
                            <div className="page-number">{leftPhotoIndex + 1}</div>
                          </>
                        )}
                      </div>

                      {/* 右页 */}
                      <div className="book-page right-page">
                        {rightPhoto && (
                          <>
                            <div className="page-image">
                              <img 
                                src={rightPhoto.cover} 
                                alt={rightPhoto.title}
                              />
                            </div>
                            <div className="page-info">
                              <h3>{rightPhoto.title}</h3>
                              <p>{rightPhoto.date}</p>
                            </div>
                            <div className="page-number">{rightPhotoIndex + 1}</div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 翻页按钮 */}
              <button 
                className="page-turn-btn prev" 
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
              >
                ‹
              </button>
              <button 
                className="page-turn-btn next" 
                onClick={() => setCurrentSlide(prev => 
                  Math.min(Math.ceil(currentPhotos.length / 2) - 1, prev + 1)
                )}
                disabled={currentSlide === Math.ceil(currentPhotos.length / 2) - 1}
              >
                ›
              </button>
            </div>
          </div>
        );

      case 'grid3d':
        return (
          <div className="grid3d-view">
            {currentPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                className="grid3d-item"
                style={{
                  '--delay': `${index * 0.1}s`,
                  '--row': Math.floor(index / 4),
                  '--col': index % 4
                }}
              >
                <img src={photo.cover} alt={photo.title} />
                <div className="grid3d-info">
                  <h3>{photo.title}</h3>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="default-view">
            <p>未知的视图模式</p>
          </div>
        );
    }
  };

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
        <div className="header-left">
          <h2>我的相册</h2>
          <span className="photo-count">共 {totalCount} 张照片</span>
        </div>
        
        <div className="view-controls">
          <div className="view-modes">
            {viewModes.map(mode => (
              <button
                key={mode.id}
                className={`view-mode-btn ${viewMode === mode.id ? 'active' : ''}`}
                onClick={() => setViewMode(mode.id)}
                title={mode.name}
              >
                {mode.icon}
              </button>
            ))}
          </div>
          
          <button 
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <span className="refresh-icon">↻</span>
          </button>
        </div>
      </div>

      <div className="photo-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
      
      {renderPhotoView()}
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