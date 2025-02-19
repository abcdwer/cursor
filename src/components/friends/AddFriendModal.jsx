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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>添加好友</h2>
        <input
          type="text"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
          placeholder="输入好友名称"
        />
        <button onClick={handleAddFriend}>添加</button>
        <button onClick={onClose}>关闭</button>
      </div>
    </div>
  );
};

export default AddFriendModal; 