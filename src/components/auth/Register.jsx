import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 这里添加注册逻辑
      console.log('注册信息：', formData);
      navigate('/personal'); // 或者其他合适的页面
    } catch (error) {
      console.error("注册失败:", error);
      setError("注册失败，请检查输入信息。");
    }
  };

  return (
    <div className="auth-container">
      <h2>注册</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="用户名"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="邮箱"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="密码"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="确认密码"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>
        <button type="submit">注册</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;