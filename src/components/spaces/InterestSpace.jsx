import React, { useState } from 'react';
import './InterestSpace.css';
import Photography from './modules/Photography/Photography';
import Food from './modules/Food/Food';
import Travel from './modules/Travel/Travel';
import Reading from './modules/Reading/Reading';
import Music from './modules/Music/Music';
import Gaming from './modules/Gaming/Gaming';
import Movie from './modules/Movie/Movie';

const InterestSpace = () => {
  const [activeCategory, setActiveCategory] = useState('photography');

  const categories = [
    { id: 'photography', name: '摄影', icon: '📸' },
    { id: 'food', name: '美食', icon: '🍜' },
    { id: 'travel', name: '旅行', icon: '✈️' },
    { id: 'reading', name: '阅读', icon: '📚' },
    { id: 'music', name: '音乐', icon: '🎵' },
    { id: 'movie', name: '影视', icon: '🎬' },
    { id: 'gaming', name: '游戏', icon: '🎮' }
  ];

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'photography':
        return <Photography />;
      case 'food':
        return <Food />;
      case 'travel':
        return <Travel />;
      case 'reading':
        return <Reading />;
      case 'music':
        return <Music />;
      case 'movie':
        return <Movie />;
      case 'gaming':
        return <Gaming />;
      default:
        return null;
    }
  };

  return (
    <div className="interest-space">
      {/* 添加樱花飘落容器 */}
      <div className="sakura-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`sakura ${['small', 'medium', 'large'][i % 3]}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
      {renderCategoryContent()}
    </div>
  );
};

export default InterestSpace;
