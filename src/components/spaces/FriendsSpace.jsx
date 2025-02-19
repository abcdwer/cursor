import React, { useState } from 'react';
import ChatModal from '../friends/ChatModal';
import AddFriendModal from '../friends/AddFriendModal';
import './FriendsSpace.css'; // 引入样式文件

const initialFriendsData = [
  { id: 1, name: '好友1', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: '好友2', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: '好友3', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const initialChatRecords = {
  1: [{ text: '你好！', sender: 'me' }, { text: '你在吗？', sender: 'friend' }],
  2: [{ text: '今天天气不错！', sender: 'friend' }],
  3: [{ text: '最近怎么样？', sender: 'me' }],
};

const initialDynamics = [
  '好友1 发布了新动态',
  '好友2 赞了你的动态',
  '好友3 评论了你的动态',
];

const FriendsSpace = () => {
  const [activeTab, setActiveTab] = useState('dynamics'); // 当前激活的面板
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);

  const closeChatModal = () => {
    setSelectedFriend(null);
  };

  const openAddFriendModal = () => {
    setAddFriendModalOpen(true);
  };

  const closeAddFriendModal = () => {
    setAddFriendModalOpen(false);
  };

  const openChatModal = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <div className="friends-space">
      <div className="tab-container">
        <button className={`tab-button ${activeTab === 'dynamics' ? 'active' : ''}`} onClick={() => setActiveTab('dynamics')}>
          好友动态
        </button>
        <button className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`} onClick={() => setActiveTab('friends')}>
          好友列表
        </button>
        <button className={`tab-button ${activeTab === 'find-friends' ? 'active' : ''}`} onClick={() => setActiveTab('find-friends')}>
          寻找朋友
        </button>
      </div>

      <div className="panel">
        {activeTab === 'dynamics' && (
          <div className="dynamics-panel">
            <h3>好友动态</h3>
            <ul>
              {initialDynamics.map((dynamic, index) => (
                <li key={index}>{dynamic}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'friends' && (
          <div className="friends-panel">
            <h3>好友列表</h3>
            <div className="chat-records-container">
              <ul>
                {Object.keys(initialChatRecords).map((friendId) => {
                  const friend = initialFriendsData.find(f => f.id === parseInt(friendId));
                  const lastMessage = initialChatRecords[friendId].length > 0
                    ? initialChatRecords[friendId][initialChatRecords[friendId].length - 1].text
                    : '无消息';

                  return (
                    <li key={friendId} onClick={() => openChatModal(friend)}>
                      <div className="friend-info">
                        <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                        <span className="friend-name">{friend.name}</span>
                      </div>
                      <div className="latest-message">{lastMessage}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
        {activeTab === 'find-friends' && (
          <div className="find-friends-panel">
            <h3>寻找朋友</h3>
            <button onClick={openAddFriendModal}>添加好友</button>
          </div>
        )}
      </div>

      {selectedFriend && (
        <ChatModal friend={selectedFriend} onClose={closeChatModal} messages={initialChatRecords[selectedFriend.id]} />
      )}
      {isAddFriendModalOpen && (
        <AddFriendModal onClose={closeAddFriendModal} />
      )}
    </div>
  );
};

export default FriendsSpace;
