import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { loginSuccess } from './store/authSlice';

// 导入组件
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import PersonalSpace from './components/spaces/PersonalSpace';
import FriendsSpace from './components/spaces/FriendsSpace';
import InterestSpace from './components/spaces/InterestSpace';
import OutingSpace from './components/spaces/OutingSpace';

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      dispatch(loginSuccess({
        user: JSON.parse(userData),
        token
      }));
    }
  }, [dispatch]);

  return children;
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/personal" replace />} />
        <Route path="/personal" element={<PersonalSpace />} />
        <Route path="/friends" element={<FriendsSpace />} />
        <Route path="/interests" element={<InterestSpace />} />
        <Route path="/outing" element={<OutingSpace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthWrapper>
          <AppRoutes />
        </AuthWrapper>
      </Router>
    </Provider>
  );
}

export default App;