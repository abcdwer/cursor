import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PhotoAlbum.css';
import { embyService } from '../../services/embyService';

const PhotoAlbum = React.memo(({ 
  photos: initialPhotos = [], 
  totalCount = 0, 
  loading = false, 
  error = null, 
  onRetry 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // grid, masonry, slideshow
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [localPhotos, setLocalPhotos] = useState(initialPhotos);
  const [sortOrder, setSortOrder] = useState('desc');
  const loaderRef = useRef(null);

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

  // 当 props 中的 photos 更新时，更新本地状态
  useEffect(() => {
    // 只在初始化时设置照片
    if (page === 1) {
      setLocalPhotos(initialPhotos);
    }
  }, [initialPhotos, page]);

  // 添加无限滚动的观察器
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px', // 提前更多距离触发加载
      threshold: 0.1
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        console.log('Intersection observed, loading more photos');
        loadMorePhotos();
      }
    }, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  // 加载更多照片
  const loadMorePhotos = async () => {
    if (loading || !hasMore) return;

    try {
      console.log('Loading more photos, page:', page + 1);
      const nextPage = page + 1;
      const response = await embyService.getPhotos('all', nextPage, 50);
      
      if (response?.photos?.length > 0) {
        // 检查重复照片
        const existingIds = new Set(localPhotos.map(photo => photo.id));
        const newPhotos = response.photos.filter(photo => !existingIds.has(photo.id));
        
        if (newPhotos.length > 0) {
          setLocalPhotos(prev => [...prev, ...newPhotos]);
          setPage(nextPage);
          setHasMore(response.hasMore);
          console.log(`Loaded ${response.photos.length} more photos. Total: ${response.totalCount}`);
          console.log(`Page ${response.currentPage} of ${response.totalPages}`);
        } else {
          console.log('No new photos to add');
          setHasMore(false);
        }
      } else {
        setHasMore(false);
        console.log('No more photos available');
      }
    } catch (error) {
      console.error('Failed to load more photos:', error);
    }
  };

  // 渲染加载更多指示器
  const renderLoader = () => {
    if (!hasMore) {
      return (
        <div className="load-more">
          <div className="load-more-text">已加载全部照片</div>
        </div>
      );
    }

    return (
      <div ref={loaderRef} className="load-more">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>加载更多...</span>
          </div>
        ) : (
          <div className="load-more-text">向下滚动加载更多</div>
        )}
      </div>
    );
  };

  // 初始化加载各分类照片
  useEffect(() => {
    const loadCategoryPhotos = async () => {
      try {
        // 加载所有分类的照片
        const categories = ['all', 'portrait', 'landscape', 'life'];
        for (const category of categories) {
          try {
            const response = await embyService.getPhotos(category);
            if (response?.photos?.length > 0) {
              // 这里需要根据新的视图模式来处理照片的加载和显示逻辑
            }
          } catch (error) {
            console.error(`Failed to load ${category} photos:`, error);
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
    // 这里需要根据新的视图模式来处理照片的加载和显示逻辑
  }, [localPhotos]);

  // 刷新当前分类的照片
  const handleRefresh = async () => {
    // 这里需要根据新的视图模式来处理照片的加载和显示逻辑
  };

  // 切换分类
  const handleCategoryChange = (categoryId) => {
    // 这里需要根据新的视图模式来处理照片的加载和显示逻辑
  };

  // 获取当前分类的照片
  const getCurrentPhotos = () => {
    // 这里需要根据新的视图模式来处理照片的加载和显示逻辑
    return [];
  };

  // 检查当前分类是否正在加载
  const isCurrentCategoryLoading = () => false;

  // 处理照片点击
  const handlePhotoClick = (photo) => {
    // 确保照片数据结构完整
    const photoData = {
      id: photo.id,
      title: photo.title || '未命名照片',
      url: photo.url || photo.thumbnail, // 使用高清图或缩略图
      description: photo.description || '',
      date: photo.date || new Date().toLocaleDateString(),
      location: photo.location || ''
    };
    setSelectedPhoto(photoData);
  };

  // 渲染照片预览模态框
  const renderPhotoModal = () => {
    if (!selectedPhoto) return null;

    return (
      <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <img 
            src={selectedPhoto.url || selectedPhoto.thumbnail} 
            alt={selectedPhoto.title}
            onError={(e) => {
              e.target.src = selectedPhoto.thumbnail; // 如果高清图加载失败，使用缩略图
            }}
          />
          <div className="modal-info">
            <h3>{selectedPhoto.title}</h3>
            {selectedPhoto.description && <p>{selectedPhoto.description}</p>}
            <div className="modal-meta">
              <span>{selectedPhoto.date}</span>
              {selectedPhoto.location && <span>{selectedPhoto.location}</span>}
            </div>
          </div>
          <button 
            className="close-btn" 
            onClick={() => setSelectedPhoto(null)}
            title="关闭"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    );
  };

  // 渲染照片网格
  const renderPhotoGrid = () => {
    return (
      <>
        <div className="photos-container grid">
          {localPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="photo-item"
              onClick={() => handlePhotoClick(photo)}
            >
              <div className="photo-wrapper">
                <img 
                  src={photo.thumbnail || photo.url} 
                  alt={photo.title} 
                  loading="lazy" 
                />
                <div className="photo-overlay">
                  <div className="photo-info">
                    <h4>{photo.title}</h4>
                    <span>{photo.date}</span>
                  </div>
                  <div className="photo-actions">
                    <button className="action-btn" onClick={e => e.stopPropagation()}>
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="action-btn" onClick={e => e.stopPropagation()}>
                      <i className="far fa-edit"></i>
                    </button>
                    <button className="action-btn" onClick={e => e.stopPropagation()}>
                      <i className="far fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {renderLoader()}
      </>
    );
  };

  // 渲染瀑布流布局
  const renderMasonryGrid = () => {
    return (
      <>
        <div className="photos-container masonry">
          {localPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="photo-item"
              onClick={() => handlePhotoClick(photo)}
            >
              <div className="photo-wrapper">
                <img 
                  src={photo.thumbnail || photo.url} 
                  alt={photo.title} 
                  loading="lazy" 
                />
                <div className="photo-overlay">
                  <div className="photo-info">
                    <h4>{photo.title}</h4>
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {renderLoader()}
      </>
    );
  };

  // 渲染幻灯片布局
  const renderSlideshow = () => {
    return (
      <div className="photos-container slideshow">
        {localPhotos.map((photo, index) => (
          <div 
            key={photo.id}
            className={`photo-item ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handlePhotoClick(photo)}
          >
            <div className="photo-wrapper">
              <img 
                src={photo.thumbnail || photo.url} 
                alt={photo.title}
              />
              <div className="photo-overlay">
                <div className="photo-info">
                  <h4>{photo.title}</h4>
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
            <div className="slideshow-controls" onClick={e => e.stopPropagation()}>
              <button 
                className="control-btn prev"
                onClick={() => {
                  setCurrentSlide((prev) => (prev - 1 + localPhotos.length) % localPhotos.length);
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="control-btn next"
                onClick={() => {
                  setCurrentSlide((prev) => (prev + 1) % localPhotos.length);
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        ))}
        <div className="slideshow-dots" onClick={e => e.stopPropagation()}>
          {localPhotos.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    );
  };

  // 渲染照片内容
  const renderPhotoContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>正在加载照片...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <span>{error}</span>
          <button onClick={onRetry}>重试</button>
        </div>
      );
    }

    switch (viewMode) {
      case 'grid':
        return renderPhotoGrid();
      case 'masonry':
        return renderMasonryGrid();
      case 'slideshow':
        return renderSlideshow();
      default:
        return renderPhotoGrid();
    }
  };

  // 渲染不同的视图模式
  const renderPhotoView = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>正在加载照片...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <span>{error}</span>
          <button onClick={onRetry}>重试</button>
        </div>
      );
    }

    switch (viewMode) {
      case 'grid':
        return (
          <div className="photos-container grid">
            {localPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="photo-item"
                onClick={() => handlePhotoClick(photo)}
              >
                <img src={photo.url} alt={photo.title} loading="lazy" />
                <div className="photo-overlay">
                  <div className="photo-info">
                    <h4>{photo.title}</h4>
                    <span>{photo.date}</span>
                  </div>
                  <div className="photo-actions">
                    <button className="action-btn">
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="action-btn">
                      <i className="far fa-edit"></i>
                    </button>
                    <button className="action-btn">
                      <i className="far fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'masonry':
        return (
          <div className="photos-container masonry">
            {localPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="photo-item"
                onClick={() => handlePhotoClick(photo)}
              >
                <img src={photo.url} alt={photo.title} loading="lazy" />
                <div className="photo-overlay">
                  <div className="photo-info">
                    <h4>{photo.title}</h4>
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'slideshow':
        return (
          <div className="photos-container slideshow">
            {localPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                className={`photo-item ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handlePhotoClick(photo)}
              >
                <img src={photo.url} alt={photo.title} />
                <div className="photo-overlay">
                  <div className="photo-info">
                    <h4>{photo.title}</h4>
                    <span>{photo.date}</span>
                  </div>
                </div>
                <div className="slideshow-controls" onClick={e => e.stopPropagation()}>
                  <button 
                    className="control-btn prev"
                    onClick={() => {
                      setCurrentSlide((prev) => (prev - 1 + localPhotos.length) % localPhotos.length);
                    }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="control-btn next"
                    onClick={() => {
                      setCurrentSlide((prev) => (prev + 1) % localPhotos.length);
                    }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // 处理排序
  const handleSortChange = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setPage(1);
    setHasMore(true);
    // 重新加载照片
    loadPhotos(newOrder);
  };

  // 加载照片
  const loadPhotos = async (order) => {
    try {
      const response = await embyService.getPhotos('all', 1, 50, {
        sortOrder: order
      });
      
      if (response?.photos?.length > 0) {
        setLocalPhotos(response.photos);
        setHasMore(response.hasMore);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
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
    <div className="photo-album">
      {/* 相册头部 */}
      <div className="album-header">
        <div className="album-info">
          <h2>我的相册</h2>
          <div className="album-stats">
            <div className="stat-card">
              <div className="stat-icon photos">📸</div>
              <div className="stat-info">
                <span className="stat-value">{totalCount}</span>
                <span className="stat-label">总照片</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon albums">📁</div>
              <div className="stat-info">
                <span className="stat-value">12</span>
                <span className="stat-label">相册数</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon recent">🕒</div>
              <div className="stat-info">
                <span className="stat-value">28</span>
                <span className="stat-label">本月新增</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="album-actions">
          <button className="upload-btn">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>上传照片</span>
          </button>
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button 
              className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
              onClick={() => setViewMode('masonry')}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button 
              className={`view-btn ${viewMode === 'slideshow' ? 'active' : ''}`}
              onClick={() => setViewMode('slideshow')}
            >
              <i className="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 相册过滤器 */}
      <div className="album-filters">
        <div className="filter-tabs">
          <button className="filter-tab active">全部照片</button>
          <button className="filter-tab">最近添加</button>
          <button className="filter-tab">我的收藏</button>
        </div>
        <div className="filter-actions">
          <button 
            className={`sort-btn ${sortOrder === 'desc' ? 'desc' : ''}`}
            onClick={handleSortChange}
          >
            <i className="fas fa-sort"></i>
            {sortOrder === 'desc' ? '最新优先' : '最早优先'}
          </button>
        </div>
      </div>

      {/* 照片展示区域 */}
      {renderPhotoContent()}

      {/* 照片预览模态框 */}
      {renderPhotoModal()}
    </div>
  );
});

PhotoAlbum.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    url: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    date: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string
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