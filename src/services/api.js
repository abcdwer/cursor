import axios from 'axios';

const API_URL = 'http://your-backend-api.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API 方法
export const authAPI = {
  login: (credentials) => 
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              id: 1,
              username: credentials.username,
              email: 'test@example.com',
              avatar: 'https://via.placeholder.com/150',
              createdAt: new Date().toISOString()
            },
            token: 'dummy-token'
          }
        });
      }, 1000);
    }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getFriends: () => api.get('/users/friends'),
  addFriend: (friendId) => api.post(`/users/friends/${friendId}`),
};

export const interestAPI = {
  getInterests: () => api.get('/interests'),
  joinGroup: (groupId) => api.post(`/interests/groups/${groupId}/join`),
};

export const outingAPI = {
  getEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData),
  joinEvent: (eventId) => api.post(`/events/${eventId}/join`),
};

export default api; 