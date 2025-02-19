import React from 'react';
import './FriendCard.css'; // 引入样式文件

const FriendCard = ({ friend }) => {
  return (
    <div className="friend-card">
      <img src={friend.avatar || 'https://via.placeholder.com/80'} alt={friend.name} />
      <h2>{friend.name}</h2>
      {/* 可以添加更多好友信息 */}
    </div>
  );
};

export default FriendCard; 