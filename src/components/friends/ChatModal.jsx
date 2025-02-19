import React, { useState } from 'react';
import './ChatModal.css'; // 引入样式文件

const ChatModal = ({ friend, onClose }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // 存储聊天记录

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: 'me' }]);
            setMessage(''); // 清空输入框
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 防止换行
            handleSendMessage(); // 调用发送消息的函数
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{friend.name} 的聊天</h2>
                <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                <div className="chat-box">
                    <div className="message-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-area">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="输入消息..."
                        />
                    </div>
                    <button className="send-button" onClick={handleSendMessage}>发送</button>
                </div>
            </div>
        </div>
    );
};

export default ChatModal; 