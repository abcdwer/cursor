import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import './Navbar.css'; // 确保引入样式文件

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 清除 Redux 状态
    dispatch(logout());
    // 清除 localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // 跳转到登录页
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/personal" className="social-space-title">社交空间</Link>
        </div>
        <ul className="nav-menu">
          <li className={location.pathname === '/personal' ? 'active' : ''}>
            <Link to="/personal">
              <i className="fas fa-user"></i>
              <span>个人空间</span>
            </Link>
          </li>
          <li className={location.pathname === '/friends' ? 'active' : ''}>
            <Link to="/friends">
              <i className="fas fa-users"></i>
              <span>好友空间</span>
            </Link>
          </li>
          <li className={location.pathname === '/interests' ? 'active' : ''}>
            <Link to="/interests">
              <i className="fas fa-heart"></i>
              <span>兴趣空间</span>
            </Link>
          </li>
          <li className={location.pathname === '/outing' ? 'active' : ''}>
            <Link to="/outing">
              <i className="fas fa-calendar"></i>
              <span>外出活动</span>
            </Link>
          </li>
          <li>
            <a onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              <span>退出</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;