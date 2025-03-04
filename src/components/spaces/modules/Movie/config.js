// 创建新文件存放配置
export const EMBY_SERVER = 'http://192.168.3.100:8096';
export const EMBY_API_KEY = 'f879cbe6802545268f1d0cba84dfe8e7';

export const getDateKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generateSchedule = (movies) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const seed = parseInt(getDateKey(today).replace(/-/g, ''));
  
  // 使用日期作为随机种子打乱电影顺序
  const shuffledMovies = [...movies].sort(() => seededRandom(seed) - 0.5);
  
  const scheduleList = [];
  let currentTime = new Date(today);
  currentTime.setHours(8); // 从早上8点开始排片
  
  // 生成全天的排片表
  shuffledMovies.slice(0, 8).forEach(movie => {
    const startTime = new Date(currentTime);
    const duration = movie.duration || 7200; // 默认2小时
    const endTime = new Date(startTime.getTime() + duration * 1000);
    
    scheduleList.push({
      movie,
      startTime,
      endTime,
      time: startTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    });
    
    // 下一场电影开始时间
    currentTime = new Date(endTime.getTime() + 30 * 60000); // 间隔30分钟
  });
  
  return scheduleList;
}; 