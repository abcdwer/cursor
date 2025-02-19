import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css'; // 引入样式文件
import FriendList from './FriendList';
import AddFriendModal from './AddFriendModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState([
    { id: 1, name: '好友1' },
    { id: 2, name: '好友2' },
    { id: 3, name: '好友3' },
  ]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { text: message, type: 'sent' };
      setMessages([...messages, newMessage]);
      setMessage('');

      // 模拟接收消息
      setTimeout(() => {
        const receivedMessage = {
          text: `${selectedFriend.name} 回复: ${message}`,
          type: 'received',
        };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    // 滚动到最新消息
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAddFriend = (friend) => {
    setFriends([...friends, friend]);
    // 这里可以添加实际的添加好友逻辑，比如调用API
  };

  return (
    <div className="chat-box-container">
      <FriendList
        friends={friends}
        onSelectFriend={setSelectedFriend}
        onAddFriend={handleAddFriend}
      />
      <div className="chat-window">
        {selectedFriend ? (
          <>
            <div className="chat-header">
              <h3>{selectedFriend.name}</h3>
            </div>
            <div className="message-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <div className="input-area">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入消息..."
                onKeyPress={handleKeyPress}
              />
              <button onClick={sendMessage}>发送</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>请选择一个好友开始聊天</p>
          </div>
        )}
      </div>
      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddFriend}
      />
    </div>
  );
};

export default ChatBox; 