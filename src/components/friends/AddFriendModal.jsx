import React, { useState } from 'react';
import './AddFriendModal.css';

const AddFriendModal = ({ onClose, setFriendsData }) => {
  const [friendName, setFriendName] = useState('');

  const handleAddFriend = () => {
    if (friendName.trim()) {
      const newAvatarId = Math.floor(Math.random() * 70) + 1; // 随机生成头像ID
      const newFriend = {
        id: Date.now(), // 使用当前时间戳作为唯一ID
        name: friendName,
        avatar: `https://i.pravatar.cc/150?img=${newAvatarId}`,
      };
      setFriendsData(prev => [...prev, newFriend]);
      onClose(); // 关闭模态框
    }
  };

  const handleOverlayClick = (e) => {
    // 只有当点击的是遮罩层本身时才关闭
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>添加好友</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="输入用户名或ID搜索" 
            className="search-input"
          />
          <button className="search-btn">搜索</button>
        </div>
        <input
          type="text"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
          placeholder="输入好友名称"
        />
        <button onClick={handleAddFriend}>添加</button>
      </div>
    </div>
  );
};

export default AddFriendModal; 