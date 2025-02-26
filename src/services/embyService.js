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
      baseURL: `${EMBY_BASE_URL}/emby`,
      headers: {
        'X-Emby-Authorization': this.getAuthHeader(),
        'Accept': 'application/json'
      }
    });
    
    // 为每个分类维护独立的照片列表
    this.categoryPhotos = {
      all: [],
      portrait: [],
      landscape: [],
      life: []
    };
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

  async getPhotos(category = 'all') {
    try {
      const response = await this.fetchPhotos(category);
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshToken();
        return this.getPhotos(category);
      }
      throw error;
    }
  }

  async fetchPhotos(category) {
    const categoryQueries = {
      portrait: {
        // 人像照片查询
        searchQuery: {
          SearchTerm: 'person OR face OR portrait OR people',
          ImageTypes: 'Primary',
          Filters: 'HasFace',  // 必须包含人脸
          MinWidth: 600,
          SortBy: 'DateCreated',
          SortOrder: 'Descending'
        }
      },
      landscape: {
        // 风景照片查询
        searchQuery: {
          SearchTerm: 'landscape OR nature OR scenery OR outdoor',
          ImageTypes: 'Primary',
          MinWidth: 1200,  // 宽幅照片
          MinHeight: 800,
          SortBy: 'Random'
        }
      },
      life: {
        // 生活照片查询
        searchQuery: {
          SearchTerm: 'life OR daily OR event OR activity',
          ExcludeSearchTerm: 'landscape nature portrait',
          ImageTypes: 'Primary',
          SortBy: 'Random'
        }
      },
      all: {
        // 全部照片查询
        searchQuery: {
          SortBy: 'Random'
        }
      }
    };

    try {
      if (!this.token) {
        await this.refreshToken();
      }

      const baseParams = {
        IncludeItemTypes: 'Photo',
        Recursive: true,
        Fields: 'PrimaryImageAspectRatio,Overview,DateCreated,Width,Height',
        api_key: API_KEY,
        Limit: 20,
        ImageTypeLimit: 1,
        EnableImageTypes: 'Primary'
      };

      // 合并查询参数
      const queryParams = {
        ...baseParams,
        ...categoryQueries[category].searchQuery
      };

      const response = await this.client.get('/Items', { params: queryParams });

      if (!response.data.Items?.length) {
        console.warn(`No photos found for category: ${category}`);
        return { photos: [], totalCount: 0 };
      }

      // 根据分类处理照片
      let photos = response.data.Items;
      
      // 特殊处理不同分类的照片
      switch (category) {
        case 'portrait':
          // 确保照片包含人脸
          photos = photos.filter(photo => photo.HasFace);
          break;
        case 'landscape':
          // 选择宽高比大于1.5的照片
          photos = photos.filter(photo => 
            photo.Width && photo.Height && (photo.Width / photo.Height > 1.5)
          );
          break;
        case 'life':
          // 排除明显的风景和人像照片
          photos = photos.filter(photo => 
            !photo.HasFace && !(photo.Width / photo.Height > 1.5)
          );
          break;
      }

      // 确保至少返回一些照片
      if (photos.length === 0) {
        return await this.fetchPhotos('all');
      }

      // 更新分类照片列表
      this.categoryPhotos[category] = photos.map(photo => ({
        id: photo.Id,
        title: photo.Name,
        description: photo.Overview || '',
        date: new Date(photo.DateCreated).toLocaleDateString(),
        cover: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=90&fillWidth=800&fillHeight=600&api_key=${API_KEY}`,
        thumbnail: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=80&fillWidth=400&fillHeight=300&api_key=${API_KEY}`,
        original: `${EMBY_BASE_URL}/emby/Items/${photo.Id}/Images/Primary?quality=90&api_key=${API_KEY}`,
        aspectRatio: photo.PrimaryImageAspectRatio || 1.5
      }));

      return {
        photos: this.categoryPhotos[category],
        totalCount: response.data.TotalRecordCount
      };
    } catch (error) {
      console.error(`Error fetching photos for category ${category}:`, error);
      throw error;
    }
  }

  // 修改刷新方法
  async refreshCategoryPhotos(category) {
    // 清空该分类的照片列表
    this.categoryPhotos[category] = [];
    return this.getPhotos(category);
  }

  // 修改刷新所有分类的方法
  async refreshAllPhotos() {
    // 重置所有分类的起始位置
    Object.keys(this.categoryPhotos).forEach(category => {
      this.categoryPhotos[category] = [];
    });
    // 重新获取所有分类的照片
    const categories = ['all', 'portrait', 'landscape', 'life'];
    return Promise.all(categories.map(category => this.getPhotos(category)));
  }
}

export const embyService = new EmbyService(); 