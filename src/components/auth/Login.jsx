import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { loginSuccess } from '../../store/authSlice';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('用户名必填')
    .min(3, '用户名至少3个字符'),
  password: Yup.string()
    .required('密码必填')
    .min(6, '密码至少6个字符'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    // 模拟登录成功
    const userData = {
      id: 1,
      username: values.username,
      email: `${values.username}@example.com`,
      avatar: 'https://via.placeholder.com/150'
    };

    // 更新 Redux 状态
    dispatch(loginSuccess({
      user: userData,
      token: 'dummy-token'
    }));
    
    // 存储认证信息到 localStorage
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // 跳转到个人空间
    navigate('/personal', { replace: true });
    
    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <h2>登录</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <Field
                name="username"
                type="text"
                placeholder="用户名"
                className={errors.username && touched.username ? 'error' : ''}
              />
              {errors.username && touched.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <Field
                name="password"
                type="password"
                placeholder="密码"
                className={errors.password && touched.password ? 'error' : ''}
              />
              {errors.password && touched.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;