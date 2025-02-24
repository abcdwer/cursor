import axios from 'axios';

// 从环境变量或配置文件中获取
const EMBY_BASE_URL = process.env.REACT_APP_EMBY_SERVER_URL;
const API_KEY = process.env.REACT_APP_EMBY_API_KEY;
const USERNAME = process.env.REACT_APP_EMBY_USERNAME;
const PASSWORD = process.env.REACT_APP_EMBY_PASSWORD;
const DEVICE_ID = 'web-client-' + Math.random().toString(36).substring(7);

class EmbyService {
  constructor() {
    this.token = null;
    this.client = axios.create({
      baseURL: `${EMBY_BASE_URL}/emby`,  // 添加 /emby 前缀
      headers: {
        'X-Emby-Authorization': this.getAuthHeader(),
        'Accept': 'application/json'
      }
    });
  }

  getAuthHeader() {
    return `MediaBrowser Client="Web Client", Device="Browser", DeviceId="${DEVICE_ID}", Version="1.0.0"${this.token ? `, Token="${this.token}"` : ''}`;
  }

  async refreshToken() {
    try {
      const response = await axios.post(`${EMBY_BASE_URL}/emby/Users/AuthenticateByName`, {
        Username: USERNAME,
        Pw: PASSWORD
      }, {
        headers: {
          'X-Emby-Authorization': this.getAuthHeader()
        }
      });

      this.token = response.data.AccessToken;
      
      // 更新客户端的认证头
      this.client.defaults.headers['X-Emby-Authorization'] = this.getAuthHeader();
      
      return this.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  async getPhotos() {
    try {
      if (!this.token) {
        await this.refreshToken();
      }

      const response = await this.client.get('/Items', {
        params: {
          IncludeItemTypes: 'Photo',
          Recursive: true,
          Fields: 'PrimaryImageAspectRatio,Overview,DateCreated',
          api_key: API_KEY,
          Limit: 10,
          SortBy: 'Random' // 使用随机排序
        }
      });

      // 处理返回的照片数据
      const photos = response.data.Items?.map(photo => ({
        id: photo.Id,
        title: photo.Name,
        description: photo.Overview || '',
        date: new Date(photo.DateCreated).toLocaleDateString(),
        cover: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?api_key=${API_KEY}`,
        thumbnail: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?maxWidth=400&api_key=${API_KEY}`,
        aspectRatio: photo.PrimaryImageAspectRatio || 1.5
      })) || [];

      return {
        photos,
        totalCount: response.data.TotalRecordCount
      };
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshToken();
        return this.getPhotos();
      }
      throw error;
    }
  }
}

export const embyService = new EmbyService(); 