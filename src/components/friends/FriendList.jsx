import React from 'react';
import './FriendList.css'; // 引入样式文件

const FriendList = ({ friends, onSelectFriend }) => {
    return (
        <div className="friend-list">
            {friends.length > 0 ? (
                friends.map(friend => (
                    <div
                        key={friend.id}
                        className="friend-item"
                        onClick={() => onSelectFriend(friend)}
                    >
                        <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                        <span className="friend-name">{friend.name}</span>
                    </div>
                ))
            ) : (
                <div className="placeholder">没有好友</div>
            )}
        </div>
    );
};

export default FriendList; 